'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase, getAuthDiagnostics, formatDiagnosticsForError } from '@/lib/supabase'
import type { AuthDiagnostics } from '@/lib/supabase'
import type { Race } from '@/lib/database.types'
import { RACE_TYPES } from '@/lib/database.types'

type ModalMode = 'create' | 'edit' | 'csv' | null

interface CsvRow {
  date: string
  type: string
  name: string
  link: string
}

interface ParsedCsvResult {
  rows: CsvRow[]
  errors: string[]
}

// Simple URL validation
function isValidUrl(str: string): boolean {
  if (!str) return true
  try {
    new URL(str)
    return true
  } catch {
    try {
      new URL('https://' + str)
      return true
    } catch {
      return false
    }
  }
}

// Normalize URL - add https:// if missing
function normalizeUrl(str: string): string | null {
  if (!str.trim()) return null
  const trimmed = str.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }
  return 'https://' + trimmed
}

// Parse date from DD.MM.YYYY format to YYYY-MM-DD
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null
  // Normalize dashes: en-dash (–) and em-dash (—) to regular hyphen (-)
  const trimmed = dateStr.trim().replace(/[–—]/g, '-')

  // Handle DD.MM.YYYY format
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (dotMatch) {
    const [, day, month, year] = dotMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Handle date ranges like "05.-06.09.2026" - take first date
  const rangeMatch = trimmed.match(/^(\d{1,2})\.\s*-\s*\d{1,2}\.(\d{1,2})\.(\d{4})$/)
  if (rangeMatch) {
    const [, day, month, year] = rangeMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  return null
}

// Parse CSV content
function parseCsv(content: string): ParsedCsvResult {
  const rows: CsvRow[] = []
  const errors: string[] = []

  const lines = content.split('\n').map(line => line.trim()).filter(line => line)

  // Skip header row if it looks like headers
  const startIndex = lines[0]?.toLowerCase().includes('datum') ||
                     lines[0]?.toLowerCase().includes('date') ||
                     lines[0]?.toLowerCase().includes('vrsta') ? 1 : 0

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Split by tab or comma
    let parts: string[]
    if (line.includes('\t')) {
      parts = line.split('\t')
    } else {
      // Handle CSV with potential quoted fields
      parts = []
      let current = ''
      let inQuotes = false
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      parts.push(current.trim())
    }

    if (parts.length < 3) {
      errors.push(`Row ${lineNum}: Not enough columns (need at least Date, Type, Name)`)
      continue
    }

    const [dateStr, typeStr, nameStr, linkStr = ''] = parts

    const parsedDate = parseDate(dateStr)
    if (!parsedDate) {
      errors.push(`Row ${lineNum}: Invalid date format "${dateStr}" (expected DD.MM.YYYY)`)
      continue
    }

    if (!nameStr.trim()) {
      errors.push(`Row ${lineNum}: Name is required`)
      continue
    }

    rows.push({
      date: parsedDate,
      type: typeStr.trim(),
      name: nameStr.trim(),
      link: linkStr.trim(),
    })
  }

  return { rows, errors }
}

export default function RacesPage() {
  const [races, setRaces] = useState<Race[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingRace, setEditingRace] = useState<Race | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')

  // Auth diagnostics state
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    race_date: '',
    race_type: '',
    region: '',
    link: '',
  })

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    race_date: '',
    link: '',
  })

  // CSV upload state
  const [csvContent, setCsvContent] = useState('')
  const [csvPreview, setCsvPreview] = useState<ParsedCsvResult | null>(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvProgress, setCsvProgress] = useState({ current: 0, total: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load races
  const loadRaces = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const { data, error } = await supabase
        .from('races')
        .select('*')
        .order('race_date', { ascending: true })

      if (error) {
        console.error('Error loading races:', error)
        setLoadError(error.message || 'Failed to load races')
        setRaces([])
      } else {
        setRaces(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading races:', err)
      setLoadError('Unexpected error loading races')
      setRaces([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRaces()
  }, [loadRaces])

  // Filter races
  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      !searchQuery ||
      race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (race.region && race.region.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = !filterType || race.race_type === filterType
    return matchesSearch && matchesType
  })

  // Get unique types from data for filter dropdown
  const uniqueTypes = Array.from(new Set(races.map(r => r.race_type).filter(Boolean)))

  function validateForm(): boolean {
    const errors = {
      name: '',
      race_date: '',
      link: '',
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.race_date) {
      errors.race_date = 'Date is required'
    }

    if (formData.link && !isValidUrl(formData.link)) {
      errors.link = 'Please enter a valid URL'
    }

    setFormErrors(errors)
    return !errors.name && !errors.race_date && !errors.link
  }

  function openCreateModal() {
    setFormData({
      name: '',
      race_date: '',
      race_type: '',
      region: '',
      link: '',
    })
    setFormErrors({ name: '', race_date: '', link: '' })
    setEditingRace(null)
    setSaveError(null)
    setModalMode('create')
  }

  function openEditModal(race: Race) {
    setFormData({
      name: race.name,
      race_date: race.race_date,
      race_type: race.race_type || '',
      region: race.region || '',
      link: race.link || '',
    })
    setFormErrors({ name: '', race_date: '', link: '' })
    setEditingRace(race)
    setSaveError(null)
    setModalMode('edit')
  }

  function openCsvModal() {
    setCsvContent('')
    setCsvPreview(null)
    setSaveError(null)
    setModalMode('csv')
  }

  function closeModal() {
    if (saving || csvUploading) return
    setModalMode(null)
    setEditingRace(null)
    setSaveError(null)
    setFormErrors({ name: '', race_date: '', link: '' })
    setCsvContent('')
    setCsvPreview(null)
  }

  // CREATE / UPDATE handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (saving) return
    if (!validateForm()) return

    setSaving(true)
    setSaveError(null)
    setPageError(null)

    const action = modalMode === 'create' ? 'CREATE' : 'UPDATE'
    const payload = {
      name: formData.name.trim(),
      race_date: formData.race_date,
      race_type: formData.race_type.trim() || null,
      region: formData.region.trim() || null,
      link: normalizeUrl(formData.link),
    }

    try {
      let error = null

      if (modalMode === 'create') {
        const result = await supabase.from('races').insert(payload)
        error = result.error
      } else if (modalMode === 'edit' && editingRace) {
        const result = await supabase
          .from('races')
          .update(payload)
          .eq('id', editingRace.id)
        error = result.error
      }

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)
        const errorMsg = error.message || 'Failed to save race'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setSaveError(`${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      closeModal()
      await loadRaces()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setSaveError(`Unexpected error occurred.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setSaving(false)
    }
  }

  // DELETE handler
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this race?')) return
    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      const { error } = await supabase.from('races').delete().eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)
        const errorMsg = error.message || 'Failed to delete race'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Delete failed: ${errorMsg}\n\nDiagnostics: ${diagInfo}`)
        return
      }

      await loadRaces()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error deleting race.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  // CSV file handler
  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setCsvContent(content)
      setCsvPreview(parseCsv(content))
    }
    reader.readAsText(file)
  }

  // CSV paste handler
  function handleCsvPaste(content: string) {
    setCsvContent(content)
    setCsvPreview(parseCsv(content))
  }

  // CSV batch upload
  async function handleCsvUpload() {
    if (!csvPreview || csvPreview.rows.length === 0) return
    if (csvUploading) return

    setCsvUploading(true)
    setSaveError(null)
    setCsvProgress({ current: 0, total: csvPreview.rows.length })

    const errors: string[] = []
    let successCount = 0

    try {
      for (let i = 0; i < csvPreview.rows.length; i++) {
        const row = csvPreview.rows[i]
        setCsvProgress({ current: i + 1, total: csvPreview.rows.length })

        const payload = {
          name: row.name,
          race_date: row.date,
          race_type: row.type || null,
          link: normalizeUrl(row.link),
        }

        const { error } = await supabase.from('races').insert(payload)

        if (error) {
          errors.push(`"${row.name}": ${error.message}`)
        } else {
          successCount++
        }
      }

      if (errors.length > 0) {
        setSaveError(`Uploaded ${successCount} races. ${errors.length} failed:\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? `\n...and ${errors.length - 5} more` : ''}`)
      } else {
        closeModal()
      }

      await loadRaces()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setSaveError(`Unexpected error during upload.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setCsvUploading(false)
    }
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('sl-SI', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  function dismissPageError() {
    setPageError(null)
  }

  return (
    <AdminProtected>
      <div>
        <div className="pageHeader">
          <h1 className="pageTitle">Races</h1>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button onClick={openCsvModal} className="secondaryBtn" disabled={loading}>
              CSV Upload
            </button>
            <button onClick={openCreateModal} className="primaryBtn" disabled={loading}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              New Race
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="formInput"
            style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="formSelect"
            style={{ minWidth: '150px' }}
          >
            <option value="">All types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type || ''}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        {!loading && races.length > 0 && (
          <div style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
            Showing {filteredRaces.length} of {races.length} races
          </div>
        )}

        {/* Auth diagnostics panel */}
        {diagnostics && (pageError || saveError || loadError) && (
          <div
            style={{
              marginBottom: 'var(--space-4)',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-muted)' }}>
              Auth Diagnostics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px', color: 'var(--color-muted)' }}>
              <span>Session:</span>
              <span style={{ color: diagnostics.hasSession ? 'var(--color-brand-green)' : 'var(--color-danger)' }}>
                {diagnostics.hasSession ? 'Valid' : 'Missing'}
              </span>
              <span>Admin:</span>
              <span style={{ color: diagnostics.isAdmin ? 'var(--color-brand-green)' : 'var(--color-danger)' }}>
                {diagnostics.isAdmin ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        )}

        {/* Page-level error banner */}
        {pageError && (
          <div
            className="loginError"
            style={{
              marginBottom: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              whiteSpace: 'pre-wrap',
            }}
          >
            <span>{pageError}</span>
            <button onClick={dismissPageError} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px' }}>
              ✕
            </button>
          </div>
        )}

        {/* Load error */}
        {loadError && (
          <div className="loginError" style={{ marginBottom: 'var(--space-4)' }}>
            {loadError}
            <button onClick={loadRaces} style={{ marginLeft: 'var(--space-3)', background: 'none', border: '1px solid currentColor', color: 'inherit', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px' }}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : filteredRaces.length === 0 && !loadError ? (
          <div className="tableContainer">
            <div className="emptyState">
              <p>{races.length === 0 ? 'No races yet. Create your first one or upload CSV!' : 'No races match your filters.'}</p>
            </div>
          </div>
        ) : filteredRaces.length > 0 ? (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaces.map((race) => (
                  <tr key={race.id}>
                    <td>{formatDate(race.race_date)}</td>
                    <td>
                      {race.race_type ? (
                        <span className="langBadge">{race.race_type}</span>
                      ) : '—'}
                    </td>
                    <td>
                      <strong>{race.name}</strong>
                    </td>
                    <td>
                      {race.link ? (
                        <a href={race.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-brand-green)', textDecoration: 'none' }}>
                          Link
                        </a>
                      ) : '—'}
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => openEditModal(race)} className="editBtn" disabled={deletingId === race.id}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(race.id)} className="dangerBtn" disabled={deletingId !== null}>
                          {deletingId === race.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Create/Edit Modal */}
        {(modalMode === 'create' || modalMode === 'edit') && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modalHeader">
                <h2 className="modalTitle">{modalMode === 'create' ? 'New Race' : 'Edit Race'}</h2>
                <button onClick={closeModal} className="modalClose" disabled={saving}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modalBody">
                  {saveError && (
                    <div className="loginError" style={{ marginBottom: 'var(--space-4)', whiteSpace: 'pre-wrap', fontSize: 'var(--text-sm)' }}>
                      {saveError}
                    </div>
                  )}
                  <div className="modalForm">
                    <div className="formGroup">
                      <label htmlFor="name" className="formLabel">Name *</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          if (formErrors.name) setFormErrors({ ...formErrors, name: '' })
                        }}
                        className="formInput"
                        placeholder="e.g. Maraton Franja"
                        disabled={saving}
                        style={formErrors.name ? { borderColor: 'var(--color-danger)' } : {}}
                      />
                      {formErrors.name && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>{formErrors.name}</div>}
                    </div>

                    <div className="formRow">
                      <div className="formGroup">
                        <label htmlFor="race_date" className="formLabel">Date *</label>
                        <input
                          id="race_date"
                          type="date"
                          value={formData.race_date}
                          onChange={(e) => {
                            setFormData({ ...formData, race_date: e.target.value })
                            if (formErrors.race_date) setFormErrors({ ...formErrors, race_date: '' })
                          }}
                          className="formInput"
                          disabled={saving}
                          style={formErrors.race_date ? { borderColor: 'var(--color-danger)' } : {}}
                        />
                        {formErrors.race_date && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>{formErrors.race_date}</div>}
                      </div>

                      <div className="formGroup">
                        <label htmlFor="race_type" className="formLabel">Type</label>
                        <select
                          id="race_type"
                          value={formData.race_type}
                          onChange={(e) => setFormData({ ...formData, race_type: e.target.value })}
                          className="formSelect"
                          disabled={saving}
                        >
                          <option value="">Select type</option>
                          {RACE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="formGroup">
                      <label htmlFor="link" className="formLabel">Link (optional)</label>
                      <input
                        id="link"
                        type="text"
                        value={formData.link}
                        onChange={(e) => {
                          setFormData({ ...formData, link: e.target.value })
                          if (formErrors.link) setFormErrors({ ...formErrors, link: '' })
                        }}
                        className="formInput"
                        placeholder="https://..."
                        disabled={saving}
                        style={formErrors.link ? { borderColor: 'var(--color-danger)' } : {}}
                      />
                      {formErrors.link && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>{formErrors.link}</div>}
                    </div>
                  </div>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={closeModal} className="secondaryBtn" disabled={saving}>Cancel</button>
                  <button type="submit" className="primaryBtn" disabled={saving}>
                    {saving ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSV Upload Modal */}
        {modalMode === 'csv' && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
              <div className="modalHeader">
                <h2 className="modalTitle">CSV Upload</h2>
                <button onClick={closeModal} className="modalClose" disabled={csvUploading}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="modalBody">
                {saveError && (
                  <div className="loginError" style={{ marginBottom: 'var(--space-4)', whiteSpace: 'pre-wrap', fontSize: 'var(--text-sm)' }}>
                    {saveError}
                  </div>
                )}

                <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                  <strong>Expected format:</strong> Date, Type, Name, Link (optional)
                  <br />
                  <span style={{ color: 'var(--color-muted)' }}>
                    Date format: DD.MM.YYYY (e.g., 01.03.2026)
                    <br />
                    Type: Cestna, Kronometer, Vzpon
                  </span>
                </div>

                <div className="formGroup">
                  <label className="formLabel">Upload CSV file</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt,.tsv"
                    onChange={handleCsvFile}
                    className="formInput"
                    disabled={csvUploading}
                    style={{ padding: '8px' }}
                  />
                </div>

                <div className="formGroup">
                  <label className="formLabel">Or paste CSV data</label>
                  <textarea
                    value={csvContent}
                    onChange={(e) => handleCsvPaste(e.target.value)}
                    className="formTextarea"
                    placeholder="01.03.2026&#9;Cestna&#9;Gran Fondo&#9;https://example.com"
                    disabled={csvUploading}
                    rows={6}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}
                  />
                </div>

                {/* Preview */}
                {csvPreview && (
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    {csvPreview.errors.length > 0 && (
                      <div style={{ marginBottom: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--color-danger)' }}>
                        <strong>Parsing errors:</strong>
                        <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
                          {csvPreview.errors.slice(0, 5).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {csvPreview.errors.length > 5 && <li>...and {csvPreview.errors.length - 5} more</li>}
                        </ul>
                      </div>
                    )}

                    {csvPreview.rows.length > 0 && (
                      <div>
                        <div style={{ marginBottom: 'var(--space-2)', fontWeight: 600, color: 'var(--color-brand-green)' }}>
                          {csvPreview.rows.length} races ready to upload
                        </div>
                        <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                          <table className="table" style={{ fontSize: 'var(--text-sm)' }}>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Name</th>
                                <th>Link</th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvPreview.rows.slice(0, 10).map((row, i) => (
                                <tr key={i}>
                                  <td>{row.date}</td>
                                  <td>{row.type || '—'}</td>
                                  <td>{row.name}</td>
                                  <td>{row.link ? 'Yes' : '—'}</td>
                                </tr>
                              ))}
                              {csvPreview.rows.length > 10 && (
                                <tr>
                                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
                                    ...and {csvPreview.rows.length - 10} more
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload progress */}
                {csvUploading && (
                  <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                    <div className="spinner" style={{ margin: '0 auto var(--space-2)' }} />
                    <div>Uploading {csvProgress.current} of {csvProgress.total}...</div>
                  </div>
                )}
              </div>

              <div className="modalFooter">
                <button type="button" onClick={closeModal} className="secondaryBtn" disabled={csvUploading}>Cancel</button>
                <button
                  type="button"
                  onClick={handleCsvUpload}
                  className="primaryBtn"
                  disabled={csvUploading || !csvPreview || csvPreview.rows.length === 0}
                >
                  {csvUploading ? 'Uploading...' : `Upload ${csvPreview?.rows.length || 0} Races`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtected>
  )
}

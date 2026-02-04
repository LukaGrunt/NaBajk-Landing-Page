'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase, getAuthDiagnostics, formatDiagnosticsForError } from '@/lib/supabase'
import type { AuthDiagnostics } from '@/lib/supabase'
import type { Race } from '@/lib/database.types'

type ModalMode = 'create' | 'edit' | null

// Simple URL validation
function isValidUrl(str: string): boolean {
  if (!str) return true // empty is valid (optional field)
  try {
    new URL(str)
    return true
  } catch {
    // Try with https:// prefix
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

  // Auth diagnostics state - only populated on-demand when errors occur
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    race_date: '',
    region: '',
    link: '',
  })

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    race_date: '',
    link: '',
  })

  // Load races with proper error handling
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

  // Filter races based on search
  const filteredRaces = races.filter((race) => {
    const matchesSearch =
      !searchQuery ||
      race.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (race.region && race.region.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

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
      region: race.region || '',
      link: race.link || '',
    })
    setFormErrors({ name: '', race_date: '', link: '' })
    setEditingRace(race)
    setSaveError(null)
    setModalMode('edit')
  }

  function closeModal() {
    if (saving) return
    setModalMode(null)
    setEditingRace(null)
    setSaveError(null)
    setFormErrors({ name: '', race_date: '', link: '' })
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
      region: formData.region.trim() || null,
      link: normalizeUrl(formData.link),
    }

    try {
      console.log(`[${action}] Submitting payload:`, payload)

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

        console.error(`[${action}] === WRITE FAILURE ===`)
        console.error(`[${action}] Error:`, error)
        console.error(`[${action}] Error code:`, error.code)
        console.error(`[${action}] Error hint:`, error.hint)
        console.error(`[${action}] Auth diagnostics:`, currentDiag)
        console.error(`[${action}] ======================`)

        const errorMsg = error.message || 'Failed to save race'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setSaveError(`${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log(`[${action}] Success!`)
      closeModal()
      await loadRaces()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error(`[${action}] Unexpected error:`, err)
      console.error(`[${action}] Auth diagnostics:`, currentDiag)
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
      console.log('[DELETE] Deleting race:', id)

      const { error } = await supabase.from('races').delete().eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[DELETE] === WRITE FAILURE ===')
        console.error('[DELETE] Error:', error)
        console.error('[DELETE] Error code:', error.code)
        console.error('[DELETE] Error hint:', error.hint)
        console.error('[DELETE] Auth diagnostics:', currentDiag)
        console.error('[DELETE] ======================')

        const errorMsg = error.message || 'Failed to delete race'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Delete failed: ${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[DELETE] Success!')
      await loadRaces()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[DELETE] Unexpected error:', err)
      console.error('[DELETE] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error deleting race.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('sl-SI', {
        weekday: 'short',
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
          <button onClick={openCreateModal} className="primaryBtn" disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Race
          </button>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by name or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="formInput"
            style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}
          />
        </div>

        {/* Auth diagnostics panel (shown when there are errors) */}
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
              <span>User ID:</span>
              <span>{diagnostics.userId || 'none'}</span>
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
            <button
              onClick={dismissPageError}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Load error banner */}
        {loadError && (
          <div className="loginError" style={{ marginBottom: 'var(--space-4)' }}>
            {loadError}
            <button
              onClick={loadRaces}
              style={{
                marginLeft: 'var(--space-3)',
                background: 'none',
                border: '1px solid currentColor',
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
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
              <p>{races.length === 0 ? 'No races yet. Create your first one!' : 'No races match your search.'}</p>
            </div>
          </div>
        ) : filteredRaces.length > 0 ? (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Region</th>
                  <th>Link</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaces.map((race) => (
                  <tr key={race.id}>
                    <td>
                      <strong>{race.name}</strong>
                    </td>
                    <td>{formatDate(race.race_date)}</td>
                    <td>{race.region || '—'}</td>
                    <td>
                      {race.link ? (
                        <a
                          href={race.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--color-brand-green)', textDecoration: 'none' }}
                        >
                          Link
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => openEditModal(race)}
                          className="editBtn"
                          disabled={deletingId === race.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(race.id)}
                          className="dangerBtn"
                          disabled={deletingId !== null}
                        >
                          {deletingId === race.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Modal */}
        {modalMode && (
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
                    <div
                      className="loginError"
                      style={{ marginBottom: 'var(--space-4)', whiteSpace: 'pre-wrap', fontSize: 'var(--text-sm)' }}
                    >
                      {saveError}
                    </div>
                  )}
                  <div className="modalForm">
                    {/* Name */}
                    <div className="formGroup">
                      <label htmlFor="name" className="formLabel">
                        Name *
                      </label>
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
                      {formErrors.name && (
                        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                          {formErrors.name}
                        </div>
                      )}
                    </div>

                    {/* Date */}
                    <div className="formGroup">
                      <label htmlFor="race_date" className="formLabel">
                        Date *
                      </label>
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
                      {formErrors.race_date && (
                        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                          {formErrors.race_date}
                        </div>
                      )}
                    </div>

                    {/* Region */}
                    <div className="formGroup">
                      <label htmlFor="region" className="formLabel">
                        Region / Location (optional)
                      </label>
                      <input
                        id="region"
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="formInput"
                        placeholder="e.g. Ljubljana, Gorenjska"
                        disabled={saving}
                      />
                    </div>

                    {/* Link */}
                    <div className="formGroup">
                      <label htmlFor="link" className="formLabel">
                        Link (optional)
                      </label>
                      <input
                        id="link"
                        type="text"
                        value={formData.link}
                        onChange={(e) => {
                          setFormData({ ...formData, link: e.target.value })
                          if (formErrors.link) setFormErrors({ ...formErrors, link: '' })
                        }}
                        className="formInput"
                        placeholder="e.g. https://marfranja.si"
                        disabled={saving}
                        style={formErrors.link ? { borderColor: 'var(--color-danger)' } : {}}
                      />
                      {formErrors.link && (
                        <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
                          {formErrors.link}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={closeModal} className="secondaryBtn" disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="primaryBtn" disabled={saving}>
                    {saving ? 'Saving...' : modalMode === 'create' ? 'Create' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtected>
  )
}

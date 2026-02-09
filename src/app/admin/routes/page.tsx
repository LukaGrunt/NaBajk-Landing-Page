'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase, getAuthDiagnostics, formatDiagnosticsForError } from '@/lib/supabase'
import type { AuthDiagnostics } from '@/lib/supabase'
import type { Route } from '@/lib/database.types'
import { REGIONS, DIFFICULTIES } from '@/lib/database.types'
import { parseGpxFile } from '@/lib/gpx-parser'

type ModalMode = 'create' | 'edit' | null

type Difficulty = 'easy' | 'medium' | 'hard'
type Region = 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState<string>('')

  // Auth diagnostics state - only populated on-demand when errors occur
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)

  // GPX processing state
  const [gpxParsing, setGpxParsing] = useState(false)
  const [gpxError, setGpxError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    gpx_data: null as string | null,
    distance_km: null as number | null,
    elevation_m: null as number | null,
    difficulty: 'medium' as Difficulty,
    region: 'gorenjska' as Region,
    traffic: '',
    road_condition: '',
    why_good: '',
    published: false,
  })

  // Load routes with proper error handling
  const loadRoutes = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading routes:', error)
        setLoadError(error.message || 'Failed to load routes')
        setRoutes([])
      } else {
        setRoutes(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading routes:', err)
      setLoadError('Unexpected error loading routes')
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadRoutes()
  }, [loadRoutes])

  // Filter routes based on search and region
  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      !searchQuery ||
      route.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !filterRegion || route.region === filterRegion
    return matchesSearch && matchesRegion
  })

  function openCreateModal() {
    setFormData({
      title: '',
      gpx_data: null,
      distance_km: null,
      elevation_m: null,
      difficulty: 'medium',
      region: 'gorenjska',
      traffic: '',
      road_condition: '',
      why_good: '',
      published: false,
    })
    setEditingRoute(null)
    setSaveError(null)
    setGpxError(null)
    setModalMode('create')
  }

  function openEditModal(route: Route) {
    setFormData({
      title: route.title,
      gpx_data: route.gpx_data,
      distance_km: route.distance_km,
      elevation_m: route.elevation_m,
      difficulty: route.difficulty,
      region: route.region,
      traffic: route.traffic || '',
      road_condition: route.road_condition || '',
      why_good: route.why_good || '',
      published: route.published,
    })
    setEditingRoute(route)
    setSaveError(null)
    setGpxError(null)
    setModalMode('edit')
  }

  function closeModal() {
    if (saving || gpxParsing) return
    setModalMode(null)
    setEditingRoute(null)
    setSaveError(null)
    setGpxError(null)
  }

  // Handle GPX file upload
  const MAX_GPX_SIZE = 10 * 1024 * 1024 // 10MB

  async function handleGpxUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setGpxError('Please upload a .gpx file')
      return
    }

    if (file.size > MAX_GPX_SIZE) {
      setGpxError('File too large (max 10MB)')
      return
    }

    setGpxParsing(true)
    setGpxError(null)

    try {
      const result = await parseGpxFile(file)

      if (result.error) {
        setGpxError(result.error)
        return
      }

      // Read file content for storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setFormData((prev) => ({
          ...prev,
          gpx_data: content,
          distance_km: result.distance_km,
          elevation_m: result.elevation_m,
        }))
      }
      reader.readAsText(file)
    } catch (err) {
      console.error('GPX parsing error:', err)
      setGpxError('Failed to parse GPX file')
    } finally {
      setGpxParsing(false)
    }
  }

  // CREATE / UPDATE handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (saving) return

    setSaving(true)
    setSaveError(null)
    setPageError(null)

    const action = modalMode === 'create' ? 'CREATE' : 'UPDATE'
    const payload = {
      title: formData.title.trim(),
      gpx_data: formData.gpx_data,
      distance_km: formData.distance_km,
      elevation_m: formData.elevation_m,
      difficulty: formData.difficulty,
      region: formData.region,
      traffic: formData.traffic.trim() || null,
      road_condition: formData.road_condition.trim() || null,
      why_good: formData.why_good.trim() || null,
      published: formData.published,
    }

    try {
      console.log(`[${action}] Submitting payload:`, { ...payload, gpx_data: payload.gpx_data ? '[GPX data]' : null })

      let error = null

      if (modalMode === 'create') {
        const result = await supabase.from('routes').insert(payload)
        error = result.error
      } else if (modalMode === 'edit' && editingRoute) {
        const result = await supabase
          .from('routes')
          .update(payload)
          .eq('id', editingRoute.id)
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

        const errorMsg = error.message || 'Failed to save route'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setSaveError(`${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log(`[${action}] Success!`)
      closeModal()
      await loadRoutes()
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
    if (!confirm('Are you sure you want to delete this route?')) return

    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      console.log('[DELETE] Deleting route:', id)

      const { error } = await supabase.from('routes').delete().eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[DELETE] === WRITE FAILURE ===')
        console.error('[DELETE] Error:', error)
        console.error('[DELETE] Error code:', error.code)
        console.error('[DELETE] Error hint:', error.hint)
        console.error('[DELETE] Auth diagnostics:', currentDiag)
        console.error('[DELETE] ======================')

        const errorMsg = error.message || 'Failed to delete route'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Delete failed: ${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[DELETE] Success!')
      await loadRoutes()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[DELETE] Unexpected error:', err)
      console.error('[DELETE] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error deleting route.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  function getRegionLabel(region: string): string {
    return REGIONS.find((r) => r.value === region)?.label || region
  }

  function getDifficultyLabel(difficulty: string): string {
    return DIFFICULTIES.find((d) => d.value === difficulty)?.label || difficulty
  }

  function dismissPageError() {
    setPageError(null)
  }

  return (
    <AdminProtected>
      <div>
        <div className="pageHeader">
          <h1 className="pageTitle">Routes</h1>
          <button onClick={openCreateModal} className="primaryBtn" disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Route
          </button>
        </div>

        {/* Search and filters */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="formInput"
            style={{ flex: '1', minWidth: '200px', maxWidth: '300px' }}
          />
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="formSelect"
            style={{ minWidth: '180px' }}
          >
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
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
              <span>Email:</span>
              <span>{diagnostics.userEmail || 'none'}</span>
              <span>Admin:</span>
              <span style={{ color: diagnostics.isAdmin ? 'var(--color-brand-green)' : 'var(--color-danger)' }}>
                {diagnostics.isAdmin ? 'Yes' : 'No'}
              </span>
              {diagnostics.sessionError && (
                <>
                  <span>Session Error:</span>
                  <span style={{ color: 'var(--color-danger)' }}>{diagnostics.sessionError}</span>
                </>
              )}
              {diagnostics.adminCheckError && (
                <>
                  <span>Admin Check Error:</span>
                  <span style={{ color: 'var(--color-danger)' }}>{diagnostics.adminCheckError}</span>
                </>
              )}
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
              onClick={loadRoutes}
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
        ) : filteredRoutes.length === 0 && !loadError ? (
          <div className="tableContainer">
            <div className="emptyState">
              <p>{routes.length === 0 ? 'No routes yet. Create your first one!' : 'No routes match your search.'}</p>
            </div>
          </div>
        ) : filteredRoutes.length > 0 ? (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Region</th>
                  <th>Distance</th>
                  <th>Elevation</th>
                  <th>Difficulty</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id}>
                    <td>
                      <strong>{route.title}</strong>
                    </td>
                    <td>
                      <span className="langBadge">{getRegionLabel(route.region)}</span>
                    </td>
                    <td>{route.distance_km ? `${route.distance_km} km` : '—'}</td>
                    <td>{route.elevation_m ? `${route.elevation_m} m` : '—'}</td>
                    <td>
                      <span
                        className={`statusBadge ${route.difficulty === 'easy' ? 'active' : route.difficulty === 'hard' ? 'inactive' : ''}`}
                      >
                        {getDifficultyLabel(route.difficulty)}
                      </span>
                    </td>
                    <td>
                      <span className={`statusBadge ${route.published ? 'active' : 'inactive'}`}>
                        <span className="statusDot" />
                        {route.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => openEditModal(route)}
                          className="editBtn"
                          disabled={deletingId === route.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="dangerBtn"
                          disabled={deletingId !== null}
                        >
                          {deletingId === route.id ? 'Deleting...' : 'Delete'}
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
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modalHeader">
                <h2 className="modalTitle">{modalMode === 'create' ? 'New Route' : 'Edit Route'}</h2>
                <button onClick={closeModal} className="modalClose" disabled={saving || gpxParsing}>
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
                    {/* Title */}
                    <div className="formGroup">
                      <label htmlFor="title" className="formLabel">
                        Title (Route overview)
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="formInput"
                        placeholder="e.g. Kranj - Ljubljana - Medvode - Škofja Loka - Kranj"
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* GPX Upload */}
                    <div className="formGroup">
                      <label htmlFor="gpx" className="formLabel">
                        GPX File {formData.gpx_data ? '(uploaded)' : ''}
                      </label>
                      <input
                        id="gpx"
                        type="file"
                        accept=".gpx"
                        onChange={handleGpxUpload}
                        className="formInput"
                        disabled={saving || gpxParsing}
                        style={{ padding: '8px' }}
                      />
                      {gpxParsing && (
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: '4px' }}>
                          Parsing GPX file...
                        </div>
                      )}
                      {gpxError && (
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-danger)', marginTop: '4px' }}>
                          {gpxError}
                        </div>
                      )}
                      {formData.distance_km !== null && formData.elevation_m !== null && (
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-green)', marginTop: '4px' }}>
                          Calculated: {formData.distance_km} km, {formData.elevation_m} m elevation
                        </div>
                      )}
                    </div>

                    {/* Region and Difficulty */}
                    <div className="formRow">
                      <div className="formGroup">
                        <label htmlFor="region" className="formLabel">
                          Region
                        </label>
                        <select
                          id="region"
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value as Region })}
                          className="formSelect"
                          disabled={saving}
                        >
                          {REGIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="formGroup">
                        <label htmlFor="difficulty" className="formLabel">
                          Difficulty
                        </label>
                        <select
                          id="difficulty"
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
                          className="formSelect"
                          disabled={saving}
                        >
                          {DIFFICULTIES.map((d) => (
                            <option key={d.value} value={d.value}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Optional fields */}
                    <div className="formGroup">
                      <label htmlFor="traffic" className="formLabel">
                        Traffic (optional)
                      </label>
                      <textarea
                        id="traffic"
                        value={formData.traffic}
                        onChange={(e) => setFormData({ ...formData, traffic: e.target.value })}
                        className="formTextarea"
                        placeholder="Describe the traffic conditions..."
                        disabled={saving}
                        rows={2}
                      />
                    </div>

                    <div className="formGroup">
                      <label htmlFor="road_condition" className="formLabel">
                        Road Condition / Kakovost ceste (optional)
                      </label>
                      <textarea
                        id="road_condition"
                        value={formData.road_condition}
                        onChange={(e) => setFormData({ ...formData, road_condition: e.target.value })}
                        className="formTextarea"
                        placeholder="Describe the road quality..."
                        disabled={saving}
                        rows={2}
                      />
                    </div>

                    <div className="formGroup">
                      <label htmlFor="why_good" className="formLabel">
                        Why is this route good? / Zakaj je dobra (optional)
                      </label>
                      <textarea
                        id="why_good"
                        value={formData.why_good}
                        onChange={(e) => setFormData({ ...formData, why_good: e.target.value })}
                        className="formTextarea"
                        placeholder="What makes this route special..."
                        disabled={saving}
                        rows={2}
                      />
                    </div>

                    {/* Published toggle */}
                    <div className="formGroup">
                      <div className="formCheckbox">
                        <input
                          id="published"
                          type="checkbox"
                          checked={formData.published}
                          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                          disabled={saving}
                        />
                        <label htmlFor="published">Published (visible to public)</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={closeModal} className="secondaryBtn" disabled={saving || gpxParsing}>
                    Cancel
                  </button>
                  <button type="submit" className="primaryBtn" disabled={saving || gpxParsing}>
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

'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase, getAuthDiagnostics, formatDiagnosticsForError } from '@/lib/supabase'
import type { AuthDiagnostics } from '@/lib/supabase'
import type { GroupRide } from '@/lib/database.types'
import { REGIONS } from '@/lib/database.types'

type Region = 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'

export default function GroupRidesPage() {
  const [groupRides, setGroupRides] = useState<GroupRide[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [editingRide, setEditingRide] = useState<GroupRide | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRegion, setFilterRegion] = useState<string>('')
  const [showCancelled, setShowCancelled] = useState(false)

  // Auth diagnostics state - only populated on-demand when errors occur
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    ride_date: '',
    ride_time: '',
    region: 'gorenjska' as Region,
    meeting_point: '',
    notes: '',
    cancelled: false,
  })

  // Load group rides with proper error handling
  const loadGroupRides = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const { data, error } = await supabase
        .from('group_rides')
        .select('*')
        .order('ride_date', { ascending: true })
        .order('ride_time', { ascending: true })

      if (error) {
        console.error('Error loading group rides:', error)
        setLoadError(error.message || 'Failed to load group rides')
        setGroupRides([])
      } else {
        setGroupRides(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading group rides:', err)
      setLoadError('Unexpected error loading group rides')
      setGroupRides([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGroupRides()
  }, [loadGroupRides])

  // Filter group rides based on search, region, and cancelled status
  const filteredRides = groupRides.filter((ride) => {
    const matchesSearch =
      !searchQuery ||
      ride.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.meeting_point.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = !filterRegion || ride.region === filterRegion
    const matchesCancelled = showCancelled || !ride.cancelled
    return matchesSearch && matchesRegion && matchesCancelled
  })

  function openEditModal(ride: GroupRide) {
    setFormData({
      title: ride.title,
      ride_date: ride.ride_date,
      ride_time: ride.ride_time,
      region: ride.region,
      meeting_point: ride.meeting_point,
      notes: ride.notes || '',
      cancelled: ride.cancelled,
    })
    setEditingRide(ride)
    setSaveError(null)
  }

  function closeModal() {
    if (saving) return
    setEditingRide(null)
    setSaveError(null)
  }

  // UPDATE handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (saving || !editingRide) return

    setSaving(true)
    setSaveError(null)
    setPageError(null)

    const payload = {
      title: formData.title.trim(),
      ride_date: formData.ride_date,
      ride_time: formData.ride_time,
      region: formData.region,
      meeting_point: formData.meeting_point.trim(),
      notes: formData.notes.trim() || null,
      cancelled: formData.cancelled,
    }

    try {
      console.log('[UPDATE] Submitting payload:', payload)

      const { error } = await supabase
        .from('group_rides')
        .update(payload)
        .eq('id', editingRide.id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[UPDATE] === WRITE FAILURE ===')
        console.error('[UPDATE] Error:', error)
        console.error('[UPDATE] Error code:', error.code)
        console.error('[UPDATE] Error hint:', error.hint)
        console.error('[UPDATE] Auth diagnostics:', currentDiag)
        console.error('[UPDATE] ======================')

        const errorMsg = error.message || 'Failed to save group ride'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setSaveError(`${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[UPDATE] Success!')
      closeModal()
      await loadGroupRides()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[UPDATE] Unexpected error:', err)
      console.error('[UPDATE] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setSaveError(`Unexpected error occurred.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setSaving(false)
    }
  }

  // CANCEL (soft delete) handler
  async function handleCancel(id: string) {
    if (!confirm('Are you sure you want to cancel this group ride? It will be hidden from public view.')) return

    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      console.log('[CANCEL] Cancelling group ride:', id)

      const { error } = await supabase
        .from('group_rides')
        .update({ cancelled: true })
        .eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[CANCEL] === WRITE FAILURE ===')
        console.error('[CANCEL] Error:', error)
        console.error('[CANCEL] Error code:', error.code)
        console.error('[CANCEL] Error hint:', error.hint)
        console.error('[CANCEL] Auth diagnostics:', currentDiag)
        console.error('[CANCEL] ======================')

        const errorMsg = error.message || 'Failed to cancel group ride'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Cancel failed: ${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[CANCEL] Success!')
      await loadGroupRides()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[CANCEL] Unexpected error:', err)
      console.error('[CANCEL] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error cancelling group ride.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  // PERMANENT DELETE handler
  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this group ride? This cannot be undone.')) return

    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      console.log('[DELETE] Deleting group ride:', id)

      const { error } = await supabase
        .from('group_rides')
        .delete()
        .eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[DELETE] === WRITE FAILURE ===')
        console.error('[DELETE] Error:', error)
        console.error('[DELETE] Error code:', error.code)
        console.error('[DELETE] Error hint:', error.hint)
        console.error('[DELETE] Auth diagnostics:', currentDiag)
        console.error('[DELETE] ======================')

        const errorMsg = error.message || 'Failed to delete group ride'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Delete failed: ${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[DELETE] Success!')
      await loadGroupRides()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[DELETE] Unexpected error:', err)
      console.error('[DELETE] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error deleting group ride.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  // RESTORE handler (uncancel)
  async function handleRestore(id: string) {
    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      console.log('[RESTORE] Restoring group ride:', id)

      const { error } = await supabase
        .from('group_rides')
        .update({ cancelled: false })
        .eq('id', id)

      if (error) {
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        console.error('[RESTORE] Error:', error)
        const errorMsg = error.message || 'Failed to restore group ride'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Restore failed: ${errorMsg}\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[RESTORE] Success!')
      await loadGroupRides()
    } catch (err) {
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[RESTORE] Unexpected error:', err)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error restoring group ride.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  function getRegionLabel(region: string): string {
    return REGIONS.find((r) => r.value === region)?.label || region
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

  function formatTime(timeStr: string): string {
    // Time is in HH:MM:SS format, just show HH:MM
    return timeStr.slice(0, 5)
  }

  function dismissPageError() {
    setPageError(null)
  }

  return (
    <AdminProtected>
      <div>
        <div className="pageHeader">
          <h1 className="pageTitle">Group Rides</h1>
        </div>

        {/* Search and filters */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by title or meeting point..."
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
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
            />
            Show cancelled
          </label>
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
              onClick={loadGroupRides}
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
        ) : filteredRides.length === 0 && !loadError ? (
          <div className="tableContainer">
            <div className="emptyState">
              <p>{groupRides.length === 0 ? 'No group rides yet.' : 'No group rides match your filters.'}</p>
            </div>
          </div>
        ) : filteredRides.length > 0 ? (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date & Time</th>
                  <th>Region</th>
                  <th>Meeting Point</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRides.map((ride) => (
                  <tr key={ride.id} style={{ opacity: ride.cancelled ? 0.6 : 1 }}>
                    <td>
                      <strong>{ride.title}</strong>
                      {ride.notes && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '4px' }}>
                          {ride.notes.length > 50 ? ride.notes.slice(0, 50) + '...' : ride.notes}
                        </div>
                      )}
                    </td>
                    <td>
                      <div>{formatDate(ride.ride_date)}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                        {formatTime(ride.ride_time)}
                      </div>
                    </td>
                    <td>
                      <span className="langBadge">{getRegionLabel(ride.region)}</span>
                    </td>
                    <td style={{ maxWidth: '200px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ride.meeting_point}
                      </div>
                    </td>
                    <td>
                      <span className={`statusBadge ${ride.cancelled ? 'inactive' : 'active'}`}>
                        <span className="statusDot" />
                        {ride.cancelled ? 'Cancelled' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => openEditModal(ride)}
                          className="editBtn"
                          disabled={deletingId === ride.id}
                        >
                          Edit
                        </button>
                        {ride.cancelled ? (
                          <>
                            <button
                              onClick={() => handleRestore(ride.id)}
                              className="editBtn"
                              disabled={deletingId !== null}
                              style={{ backgroundColor: 'var(--color-brand-green)', color: 'white' }}
                            >
                              {deletingId === ride.id ? '...' : 'Restore'}
                            </button>
                            <button
                              onClick={() => handleDelete(ride.id)}
                              className="dangerBtn"
                              disabled={deletingId !== null}
                            >
                              {deletingId === ride.id ? '...' : 'Delete'}
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleCancel(ride.id)}
                            className="dangerBtn"
                            disabled={deletingId !== null}
                          >
                            {deletingId === ride.id ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Edit Modal */}
        {editingRide && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="modalHeader">
                <h2 className="modalTitle">Edit Group Ride</h2>
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
                    {/* Title */}
                    <div className="formGroup">
                      <label htmlFor="title" className="formLabel">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="formInput"
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="formRow">
                      <div className="formGroup">
                        <label htmlFor="ride_date" className="formLabel">
                          Date
                        </label>
                        <input
                          id="ride_date"
                          type="date"
                          value={formData.ride_date}
                          onChange={(e) => setFormData({ ...formData, ride_date: e.target.value })}
                          className="formInput"
                          required
                          disabled={saving}
                        />
                      </div>

                      <div className="formGroup">
                        <label htmlFor="ride_time" className="formLabel">
                          Time
                        </label>
                        <input
                          id="ride_time"
                          type="time"
                          value={formData.ride_time}
                          onChange={(e) => setFormData({ ...formData, ride_time: e.target.value })}
                          className="formInput"
                          required
                          disabled={saving}
                        />
                      </div>
                    </div>

                    {/* Region */}
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

                    {/* Meeting Point */}
                    <div className="formGroup">
                      <label htmlFor="meeting_point" className="formLabel">
                        Meeting Point
                      </label>
                      <input
                        id="meeting_point"
                        type="text"
                        value={formData.meeting_point}
                        onChange={(e) => setFormData({ ...formData, meeting_point: e.target.value })}
                        className="formInput"
                        placeholder="e.g. Parking lot at Brdo, Ljubljana"
                        required
                        disabled={saving}
                      />
                    </div>

                    {/* Notes */}
                    <div className="formGroup">
                      <label htmlFor="notes" className="formLabel">
                        Notes (optional)
                      </label>
                      <textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="formTextarea"
                        placeholder="Additional information..."
                        disabled={saving}
                        rows={3}
                      />
                    </div>

                    {/* Cancelled toggle */}
                    <div className="formGroup">
                      <div className="formCheckbox">
                        <input
                          id="cancelled"
                          type="checkbox"
                          checked={formData.cancelled}
                          onChange={(e) => setFormData({ ...formData, cancelled: e.target.checked })}
                          disabled={saving}
                        />
                        <label htmlFor="cancelled">Cancelled (hidden from public)</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={closeModal} className="secondaryBtn" disabled={saving}>
                    Cancel
                  </button>
                  <button type="submit" className="primaryBtn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
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

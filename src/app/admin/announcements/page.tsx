'use client'

import { useState, useEffect, useCallback } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase, getAuthDiagnostics, formatDiagnosticsForError } from '@/lib/supabase'
import type { AuthDiagnostics } from '@/lib/supabase'
import type { Announcement } from '@/lib/database.types'

type ModalMode = 'create' | 'edit' | null

// Explicit language mapping - ensures we only send 'sl' or 'en'
function normalizeLanguage(lang: string): 'sl' | 'en' {
  const normalized = (lang || '').toLowerCase().trim()
  if (normalized === 'en' || normalized === 'english') return 'en'
  return 'sl'
}

// Convert empty string to null for optional date fields
function normalizeDate(dateStr: string): string | null {
  if (!dateStr || dateStr.trim() === '') return null
  try {
    return new Date(dateStr).toISOString()
  } catch {
    return null
  }
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)

  // Auth diagnostics state - only populated on-demand when errors occur
  const [diagnostics, setDiagnostics] = useState<AuthDiagnostics | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    language: 'sl' as 'sl' | 'en',
    active: false,
    start_date: '',
    end_date: '',
  })

  // Load announcements with proper error handling
  const loadAnnouncements = useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading announcements:', error)
        setLoadError(error.message || 'Failed to load announcements')
        setAnnouncements([])
      } else {
        setAnnouncements(data || [])
      }
    } catch (err) {
      console.error('Unexpected error loading announcements:', err)
      setLoadError('Unexpected error loading announcements')
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAnnouncements()
  }, [loadAnnouncements])

  function openCreateModal() {
    setFormData({
      title: '',
      body: '',
      language: 'sl',
      active: false,
      start_date: '',
      end_date: '',
    })
    setEditingAnnouncement(null)
    setSaveError(null)
    setModalMode('create')
  }

  function openEditModal(announcement: Announcement) {
    setFormData({
      title: announcement.title,
      body: announcement.body,
      language: announcement.language,
      active: announcement.active,
      start_date: announcement.start_date ? announcement.start_date.slice(0, 16) : '',
      end_date: announcement.end_date ? announcement.end_date.slice(0, 16) : '',
    })
    setEditingAnnouncement(announcement)
    setSaveError(null)
    setModalMode('edit')
  }

  function closeModal() {
    if (saving) return // Don't close while saving
    setModalMode(null)
    setEditingAnnouncement(null)
    setSaveError(null)
  }

  // CREATE / UPDATE handler
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Prevent double-submit
    if (saving) return

    setSaving(true)
    setSaveError(null)
    setPageError(null)

    const action = modalMode === 'create' ? 'CREATE' : 'UPDATE'
    const payload = {
      title: formData.title.trim(),
      body: formData.body.trim(),
      language: normalizeLanguage(formData.language),
      active: formData.active,
      start_date: normalizeDate(formData.start_date),
      end_date: normalizeDate(formData.end_date),
    }

    try {
      console.log(`[${action}] Submitting payload:`, payload)

      let error = null

      if (modalMode === 'create') {
        const result = await supabase.from('announcements').insert(payload)
        error = result.error
      } else if (modalMode === 'edit' && editingAnnouncement) {
        const result = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', editingAnnouncement.id)
        error = result.error
      }

      if (error) {
        // Fetch diagnostics on-demand for error reporting
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        // Log full context
        console.error(`[${action}] === WRITE FAILURE ===`)
        console.error(`[${action}] Error:`, error)
        console.error(`[${action}] Error code:`, error.code)
        console.error(`[${action}] Error hint:`, error.hint)
        console.error(`[${action}] Auth diagnostics:`, currentDiag)
        console.error(`[${action}] Payload:`, payload)
        console.error(`[${action}] ======================`)

        // Build user-facing error with diagnostics
        const errorMsg = error.message || 'Failed to save announcement'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setSaveError(`${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log(`[${action}] Success!`)
      closeModal()
      await loadAnnouncements()
    } catch (err) {
      // Fetch diagnostics on-demand for error reporting
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
    if (!confirm('Are you sure you want to delete this announcement?')) return

    // Prevent double-delete
    if (deletingId) return

    setDeletingId(id)
    setPageError(null)

    try {
      console.log('[DELETE] Deleting announcement:', id)

      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id)

      if (error) {
        // Fetch diagnostics on-demand for error reporting
        const currentDiag = await getAuthDiagnostics()
        setDiagnostics(currentDiag)

        // Log full context
        console.error('[DELETE] === WRITE FAILURE ===')
        console.error('[DELETE] Error:', error)
        console.error('[DELETE] Error code:', error.code)
        console.error('[DELETE] Error hint:', error.hint)
        console.error('[DELETE] Auth diagnostics:', currentDiag)
        console.error('[DELETE] ======================')

        const errorMsg = error.message || 'Failed to delete announcement'
        const diagInfo = formatDiagnosticsForError(currentDiag)
        setPageError(`Delete failed: ${errorMsg} (Code: ${error.code || 'unknown'})\n\nDiagnostics: ${diagInfo}`)
        return
      }

      console.log('[DELETE] Success!')
      await loadAnnouncements()
    } catch (err) {
      // Fetch diagnostics on-demand for error reporting
      const currentDiag = await getAuthDiagnostics()
      setDiagnostics(currentDiag)

      console.error('[DELETE] Unexpected error:', err)
      console.error('[DELETE] Auth diagnostics:', currentDiag)
      const diagInfo = formatDiagnosticsForError(currentDiag)
      setPageError(`Unexpected error deleting announcement.\n\nDiagnostics: ${diagInfo}`)
    } finally {
      setDeletingId(null)
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('sl-SI', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return '—'
    }
  }

  function dismissPageError() {
    setPageError(null)
  }

  return (
    <AdminProtected>
      <div>
        <div className="pageHeader">
          <h1 className="pageTitle">Announcements</h1>
          <button onClick={openCreateModal} className="primaryBtn" disabled={loading}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Announcement
          </button>
        </div>

        {/* Auth diagnostics panel (shown when there are errors or for debugging) */}
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
              whiteSpace: 'pre-wrap'
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
                flexShrink: 0
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
              onClick={loadAnnouncements}
              style={{
                marginLeft: 'var(--space-3)',
                background: 'none',
                border: '1px solid currentColor',
                color: 'inherit',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px'
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
        ) : announcements.length === 0 && !loadError ? (
          <div className="tableContainer">
            <div className="emptyState">
              <p>No announcements yet. Create your first one!</p>
            </div>
          </div>
        ) : announcements.length > 0 ? (
          <div className="tableContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement.id}>
                    <td>
                      <strong>{announcement.title}</strong>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '4px' }}>
                        {announcement.body.length > 60
                          ? announcement.body.slice(0, 60) + '...'
                          : announcement.body}
                      </div>
                    </td>
                    <td>
                      <span className="langBadge">{announcement.language}</span>
                    </td>
                    <td>
                      <span className={`statusBadge ${announcement.active ? 'active' : 'inactive'}`}>
                        <span className="statusDot" />
                        {announcement.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(announcement.start_date)}</td>
                    <td>{formatDate(announcement.end_date)}</td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => openEditModal(announcement)}
                          className="editBtn"
                          disabled={deletingId === announcement.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="dangerBtn"
                          disabled={deletingId !== null}
                        >
                          {deletingId === announcement.id ? 'Deleting...' : 'Delete'}
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
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHeader">
                <h2 className="modalTitle">
                  {modalMode === 'create' ? 'New Announcement' : 'Edit Announcement'}
                </h2>
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
                      <label htmlFor="title" className="formLabel">
                        Title
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="formInput"
                        placeholder="Announcement title"
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="formGroup">
                      <label htmlFor="body" className="formLabel">
                        Body
                      </label>
                      <textarea
                        id="body"
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                        className="formTextarea"
                        placeholder="Announcement content..."
                        required
                        disabled={saving}
                      />
                    </div>

                    <div className="formRow">
                      <div className="formGroup">
                        <label htmlFor="language" className="formLabel">
                          Language
                        </label>
                        <select
                          id="language"
                          value={formData.language}
                          onChange={(e) => setFormData({ ...formData, language: e.target.value as 'sl' | 'en' })}
                          className="formSelect"
                          disabled={saving}
                        >
                          <option value="sl">Slovenian (SL)</option>
                          <option value="en">English (EN)</option>
                        </select>
                      </div>

                      <div className="formGroup">
                        <label className="formLabel">&nbsp;</label>
                        <div className="formCheckbox">
                          <input
                            id="active"
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            disabled={saving}
                          />
                          <label htmlFor="active">Active</label>
                        </div>
                      </div>
                    </div>

                    <div className="formRow">
                      <div className="formGroup">
                        <label htmlFor="start_date" className="formLabel">
                          Start Date (optional)
                        </label>
                        <input
                          id="start_date"
                          type="datetime-local"
                          value={formData.start_date}
                          onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                          className="formInput"
                          disabled={saving}
                        />
                      </div>

                      <div className="formGroup">
                        <label htmlFor="end_date" className="formLabel">
                          End Date (optional)
                        </label>
                        <input
                          id="end_date"
                          type="datetime-local"
                          value={formData.end_date}
                          onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                          className="formInput"
                          disabled={saving}
                        />
                      </div>
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

'use client'

import { useState, useEffect } from 'react'
import { AdminProtected } from '@/components/AdminProtected'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/lib/database.types'

type ModalMode = 'create' | 'edit' | null

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    language: 'sl' as 'sl' | 'en',
    active: false,
    start_date: '',
    end_date: '',
  })

  // Load announcements
  useEffect(() => {
    loadAnnouncements()
  }, [])

  async function loadAnnouncements() {
    setLoading(true)
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading announcements:', error)
    } else {
      setAnnouncements(data || [])
    }
    setLoading(false)
  }

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
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setEditingAnnouncement(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      title: formData.title,
      body: formData.body,
      language: formData.language as 'sl' | 'en',
      active: formData.active,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
    }

    if (modalMode === 'create') {
      const { error } = await supabase.from('announcements').insert(payload)
      if (error) {
        console.error('Error creating announcement:', error)
        alert('Error creating announcement: ' + error.message)
      }
    } else if (modalMode === 'edit' && editingAnnouncement) {
      const { error } = await supabase
        .from('announcements')
        .update(payload)
        .eq('id', editingAnnouncement.id)
      if (error) {
        console.error('Error updating announcement:', error)
        alert('Error updating announcement: ' + error.message)
      }
    }

    setSaving(false)
    closeModal()
    loadAnnouncements()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement: ' + error.message)
    } else {
      loadAnnouncements()
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('sl-SI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AdminProtected>
      <div>
        <div className="pageHeader">
          <h1 className="pageTitle">Announcements</h1>
          <button onClick={openCreateModal} className="primaryBtn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Announcement
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="tableContainer">
            <div className="emptyState">
              <p>No announcements yet. Create your first one!</p>
            </div>
          </div>
        ) : (
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
                        <button onClick={() => openEditModal(announcement)} className="editBtn">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(announcement.id)} className="dangerBtn">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modalMode && (
          <div className="modalOverlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHeader">
                <h2 className="modalTitle">
                  {modalMode === 'create' ? 'New Announcement' : 'Edit Announcement'}
                </h2>
                <button onClick={closeModal} className="modalClose">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modalBody">
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
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modalFooter">
                  <button type="button" onClick={closeModal} className="secondaryBtn">
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

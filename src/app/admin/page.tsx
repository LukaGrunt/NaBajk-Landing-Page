'use client'

import Link from 'next/link'
import { AdminProtected } from '@/components/AdminProtected'

export default function AdminDashboardPage() {
  return (
    <AdminProtected>
      <div>
        <h1 className="pageTitle">Dashboard</h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-8)' }}>
          Welcome to the NaBajk admin dashboard.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
          <Link href="/admin/announcements" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'border-color 0.15s ease'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 var(--space-2)'
              }}>
                Announcements
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted)',
                margin: 0
              }}>
                Manage in-app announcements and popups
              </p>
            </div>
          </Link>

          <Link href="/admin/routes" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'border-color 0.15s ease'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 var(--space-2)'
              }}>
                Routes
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted)',
                margin: 0
              }}>
                Manage cycling routes and GPX data
              </p>
            </div>
          </Link>

          <Link href="/admin/group-rides" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'border-color 0.15s ease'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 var(--space-2)'
              }}>
                Group Rides
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted)',
                margin: 0
              }}>
                Manage user-created group rides
              </p>
            </div>
          </Link>

          <Link href="/admin/races" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 'var(--space-6)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              transition: 'border-color 0.15s ease'
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-lg)',
                fontWeight: 600,
                color: 'var(--color-text)',
                margin: '0 0 var(--space-2)'
              }}>
                Races
              </h2>
              <p style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-muted)',
                margin: 0
              }}>
                Manage cycling races and events
              </p>
            </div>
          </Link>
        </div>
      </div>
    </AdminProtected>
  )
}

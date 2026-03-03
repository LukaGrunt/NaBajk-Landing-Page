'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/lib/AdminAuthContext'

interface AdminProtectedProps {
  children: React.ReactNode
}

export function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAdmin, loading, signOut } = useAdminAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="adminLayout">
        <div className="loading" style={{ minHeight: '100vh' }}>
          <div className="spinner" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="adminLayout">
        <div className="accessDenied">
          <h1>Access Denied</h1>
          <p>Your account is not in the admins table.</p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>
            User ID: {user.id}
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: '4px' }}>
            Add this ID to the <code>admins</code> table in Supabase to grant access.
          </p>
          <button onClick={signOut} className="secondaryBtn" style={{ marginTop: '16px' }}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="adminLayout">
      <header className="adminHeader">
        <div className="adminLogo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NaBajk" />
          <span className="adminBadge">Admin</span>
        </div>

        <nav className="adminNav">
          <Link
            href="/admin"
            className={`adminNavLink ${pathname === '/admin' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/announcements"
            className={`adminNavLink ${pathname === '/admin/announcements' ? 'active' : ''}`}
          >
            Announcements
          </Link>
          <Link
            href="/admin/routes"
            className={`adminNavLink ${pathname === '/admin/routes' ? 'active' : ''}`}
          >
            Routes
          </Link>
          <Link
            href="/admin/group-rides"
            className={`adminNavLink ${pathname === '/admin/group-rides' ? 'active' : ''}`}
          >
            Group Rides
          </Link>
          <Link
            href="/admin/races"
            className={`adminNavLink ${pathname === '/admin/races' ? 'active' : ''}`}
          >
            Races
          </Link>
          <button onClick={signOut} className="signOutBtn">
            Sign out
          </button>
        </nav>
      </header>

      <main className="adminMain">{children}</main>
    </div>
  )
}

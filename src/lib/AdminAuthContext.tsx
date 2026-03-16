'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, checkIsAdmin, signOut } from './supabase'
import type { User } from '@supabase/supabase-js'

interface AdminAuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session from local
    // storage, so we use it as the single source of truth for initial state too.
    // This avoids getUser() which makes a live network call and can hang.
    let resolved = false

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)

        if (currentUser) {
          try {
            const adminStatus = await checkIsAdmin(currentUser.id)
            setIsAdmin(adminStatus)
          } catch {
            setIsAdmin(false)
          }
        } else {
          setIsAdmin(false)
        }

        if (!resolved) {
          resolved = true
          setLoading(false)
        }
      }
    )

    // Safety net: if the auth event never fires (e.g. network error), unblock after 8s
    const fallback = setTimeout(() => {
      if (!resolved) {
        resolved = true
        setLoading(false)
      }
    }, 8000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(fallback)
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
    setIsAdmin(false)
    router.push('/admin/login')
  }

  return (
    <AdminAuthContext.Provider value={{ user, isAdmin, loading, signOut: handleSignOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

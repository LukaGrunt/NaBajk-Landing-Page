'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getUser, checkIsAdmin, signOut } from './supabase'
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
    // Check initial auth state with timeout
    async function initAuth() {
      try {
        const { user } = await getUser()
        setUser(user)

        if (user) {
          const adminStatus = await checkIsAdmin(user.id)
          setIsAdmin(adminStatus)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    // Listen for auth changes
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
      }
    )

    return () => {
      subscription.unsubscribe()
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

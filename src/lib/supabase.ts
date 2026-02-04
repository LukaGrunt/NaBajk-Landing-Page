import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Check if current user is an admin
export async function checkIsAdmin(): Promise<boolean> {
  const { user } = await getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('admins')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return false
  return true
}

// Diagnostics type for debugging
export interface AuthDiagnostics {
  hasSession: boolean
  userId: string | null
  userEmail: string | null
  isAdmin: boolean
  sessionError: string | null
  adminCheckError: string | null
  timestamp: string
}

// Get full auth diagnostics for debugging write failures
export async function getAuthDiagnostics(): Promise<AuthDiagnostics> {
  const timestamp = new Date().toISOString()

  // Check session
  const { session, error: sessionError } = await getSession()

  if (!session) {
    return {
      hasSession: false,
      userId: null,
      userEmail: null,
      isAdmin: false,
      sessionError: sessionError?.message || 'No active session',
      adminCheckError: null,
      timestamp,
    }
  }

  const userId = session.user?.id || null
  const userEmail = session.user?.email || null

  // Check admin status
  let isAdmin = false
  let adminCheckError: string | null = null

  if (userId) {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (error) {
      adminCheckError = error.message
      isAdmin = false
    } else {
      isAdmin = !!data
    }
  }

  return {
    hasSession: true,
    userId,
    userEmail,
    isAdmin,
    sessionError: null,
    adminCheckError,
    timestamp,
  }
}

// Format diagnostics for error display
export function formatDiagnosticsForError(diag: AuthDiagnostics): string {
  const parts = [
    `User: ${diag.userId || 'none'}`,
    `Admin: ${diag.isAdmin ? 'yes' : 'no'}`,
    `Session: ${diag.hasSession ? 'valid' : 'missing'}`,
  ]
  if (diag.sessionError) parts.push(`Session error: ${diag.sessionError}`)
  if (diag.adminCheckError) parts.push(`Admin check error: ${diag.adminCheckError}`)
  return parts.join(' | ')
}

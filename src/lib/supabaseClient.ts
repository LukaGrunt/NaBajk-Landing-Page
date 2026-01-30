import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton client
// Will be null if environment variables are not set (development without Supabase)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Type for waitlist entry
export interface WaitlistEntry {
  id?: string
  email: string
  locale: 'sl' | 'en'
  created_at?: string
}

// Result type for waitlist submission
export type WaitlistResult =
  | { success: true }
  | { success: false; error: 'duplicate' | 'invalid' | 'generic' }

/**
 * Add an email to the waitlist
 * Returns success/error status for UI handling
 */
export async function addToWaitlist(email: string, locale: 'sl' | 'en'): Promise<WaitlistResult> {
  // If Supabase is not configured, simulate success for development
  if (!supabase) {
    console.log('[DEV MODE] Would add to waitlist:', { email, locale })
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    return { success: true }
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email, locale }])

    if (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === '23505') {
        return { success: false, error: 'duplicate' }
      }
      console.error('Supabase error:', error)
      return { success: false, error: 'generic' }
    }

    return { success: true }
  } catch (err) {
    console.error('Network error:', err)
    return { success: false, error: 'generic' }
  }
}

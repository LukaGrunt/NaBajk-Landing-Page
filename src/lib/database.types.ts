export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          body: string
          language: 'sl' | 'en'
          active: boolean
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          body: string
          language: 'sl' | 'en'
          active?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          body?: string
          language?: 'sl' | 'en'
          active?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          email: string
          locale: 'sl' | 'en'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          locale: 'sl' | 'en'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          locale?: 'sl' | 'en'
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type AnnouncementInsert = Database['public']['Tables']['announcements']['Insert']
export type AnnouncementUpdate = Database['public']['Tables']['announcements']['Update']

export type Admin = Database['public']['Tables']['admins']['Row']

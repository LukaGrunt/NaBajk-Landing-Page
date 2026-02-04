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
      routes: {
        Row: {
          id: string
          title: string
          gpx_data: string | null
          distance_km: number | null
          elevation_m: number | null
          difficulty: 'easy' | 'medium' | 'hard'
          region: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          traffic: string | null
          road_condition: string | null
          why_good: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          gpx_data?: string | null
          distance_km?: number | null
          elevation_m?: number | null
          difficulty: 'easy' | 'medium' | 'hard'
          region: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          traffic?: string | null
          road_condition?: string | null
          why_good?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          gpx_data?: string | null
          distance_km?: number | null
          elevation_m?: number | null
          difficulty?: 'easy' | 'medium' | 'hard'
          region?: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          traffic?: string | null
          road_condition?: string | null
          why_good?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      group_rides: {
        Row: {
          id: string
          title: string
          ride_date: string
          ride_time: string
          region: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          meeting_point: string
          notes: string | null
          cancelled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          ride_date: string
          ride_time: string
          region: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          meeting_point: string
          notes?: string | null
          cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          ride_date?: string
          ride_time?: string
          region?: 'gorenjska' | 'dolenjska' | 'stajerska' | 'primorska' | 'osrednja_slovenija' | 'prekmurje'
          meeting_point?: string
          notes?: string | null
          cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      races: {
        Row: {
          id: string
          name: string
          race_date: string
          race_type: string | null
          region: string | null
          link: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          race_date: string
          race_type?: string | null
          region?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          race_date?: string
          race_type?: string | null
          region?: string | null
          link?: string | null
          created_at?: string
          updated_at?: string
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

export type Route = Database['public']['Tables']['routes']['Row']
export type RouteInsert = Database['public']['Tables']['routes']['Insert']
export type RouteUpdate = Database['public']['Tables']['routes']['Update']

export type GroupRide = Database['public']['Tables']['group_rides']['Row']
export type GroupRideInsert = Database['public']['Tables']['group_rides']['Insert']
export type GroupRideUpdate = Database['public']['Tables']['group_rides']['Update']

export type Race = Database['public']['Tables']['races']['Row']
export type RaceInsert = Database['public']['Tables']['races']['Insert']
export type RaceUpdate = Database['public']['Tables']['races']['Update']

// Route constants
export const REGIONS = [
  { value: 'gorenjska', label: 'Gorenjska' },
  { value: 'dolenjska', label: 'Dolenjska' },
  { value: 'stajerska', label: 'Štajerska' },
  { value: 'primorska', label: 'Primorska' },
  { value: 'osrednja_slovenija', label: 'Osrednja Slovenija' },
  { value: 'prekmurje', label: 'Prekmurje' },
] as const

export const DIFFICULTIES = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
] as const

export const RACE_TYPES = [
  { value: 'Cestna', label: 'Cestna' },
  { value: 'Kronometer', label: 'Kronometer' },
  { value: 'Vzpon', label: 'Vzpon' },
] as const

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types
export interface User {
  id: string
  email: string
  mobile: string
  name: string
  role: "woman" | "police" | "parent"
  is_verified: boolean
  profile_image_url?: string
  state?: string
  city?: string
  badge_id?: string
  police_station?: string
  relation?: string
  created_at: string
  updated_at: string
  last_login?: string
  is_active: boolean
}

export interface Incident {
  id: string
  case_number: string
  reporter_id: string
  assigned_officer_id?: string
  police_station_id?: string
  title: string
  description: string
  incident_type?: string
  vehicle_number?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  status: "pending" | "in_progress" | "resolved" | "closed"
  priority: number
  notify_parent: boolean
  evidence_urls?: string[]
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface ChatRoom {
  id: string
  incident_id?: string
  user_id: string
  officer_id?: string
  police_station_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_room_id: string
  sender_id: string
  content?: string
  message_type: "text" | "image" | "location" | "alert"
  file_url?: string
  location_lat?: number
  location_lng?: number
  is_alert: boolean
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface PoliceStation {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  is_active: boolean
  created_at: string
}

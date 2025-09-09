"use server"

import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("liberty_safety")
}

// Database types
export interface User {
  _id?: string
  email: string
  mobile: string
  name: string
  role: "woman" | "police" | "parent"
  password_hash: string
  is_verified: boolean
  profile_image_url?: string

  // Role-specific fields
  state?: string
  city?: string
  badge_id?: string // for police
  police_station?: string // for police
  relation?: string // for parent

  // Metadata
  created_at: Date
  updated_at: Date
  last_login?: Date
  is_active: boolean
}

export interface Incident {
  _id?: string
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
  priority: number // 1=low, 2=medium, 3=high, 4=critical

  notify_parent: boolean
  evidence_urls?: string[] // Array of file URLs

  created_at: Date
  updated_at: Date
  resolved_at?: Date
}

export interface ChatRoom {
  _id?: string
  incident_id?: string
  user_id: string
  officer_id?: string
  police_station_id?: string

  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Message {
  _id?: string
  chat_room_id: string
  sender_id: string

  content?: string
  message_type: "text" | "image" | "location" | "alert"
  file_url?: string
  location_lat?: number
  location_lng?: number

  is_alert: boolean
  is_read: boolean

  created_at: Date
  updated_at: Date
}

export interface PoliceStation {
  _id?: string
  name: string
  address: string
  city: string
  state: string
  phone?: string
  email?: string
  latitude?: number
  longitude?: number
  is_active: boolean
  created_at: Date
}

export interface Notification {
  _id?: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  action_url?: string
  created_at: Date
}

export interface EmergencyContact {
  _id?: string
  user_id: string
  name: string
  phone: string
  relation?: string
  is_primary: boolean
  created_at: Date
}

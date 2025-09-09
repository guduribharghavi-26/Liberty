import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDatabase, type User } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret-here"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export async function createUser(userData: {
  email: string
  mobile: string
  name: string
  role: "woman" | "police" | "parent"
  password: string
  state?: string
  city?: string
  badge_id?: string
  police_station?: string
  relation?: string
}): Promise<User> {
  const db = await getDatabase()
  const passwordHash = await hashPassword(userData.password)

  // Check if user already exists
  const existingUser = await db.collection<User>("users").findOne({
    $or: [{ email: userData.email }, { mobile: userData.mobile }],
  })

  if (existingUser) {
    throw new Error("User already exists with this email or mobile number")
  }

  const newUser: User = {
    email: userData.email,
    mobile: userData.mobile,
    name: userData.name,
    role: userData.role,
    password_hash: passwordHash,
    is_verified: true, // No OTP verification needed
    state: userData.state,
    city: userData.city,
    badge_id: userData.badge_id,
    police_station: userData.police_station,
    relation: userData.relation,
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
  }

  const result = await db.collection<User>("users").insertOne(newUser)

  return {
    ...newUser,
    _id: result.insertedId.toString(),
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const db = await getDatabase()

  const user = await db.collection<User>("users").findOne({ email })

  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)
  if (!isValidPassword) {
    return null
  }

  // Update last login
  await db.collection<User>("users").updateOne(
    { _id: user._id },
    {
      $set: {
        last_login: new Date(),
        updated_at: new Date(),
      },
    },
  )

  return user
}

export async function getUserById(userId: string): Promise<User | null> {
  const db = await getDatabase()

  try {
    const user = await db.collection<User>("users").findOne({ _id: new ObjectId(userId) })
    return user
  } catch {
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()

  const user = await db.collection<User>("users").findOne({ email })
  return user
}

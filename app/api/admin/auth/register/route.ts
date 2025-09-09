import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"
import { z } from "zod"

// Admin secret key - In production, this should be in environment variables
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "LIBERTY_ADMIN_2024_SECURE_KEY"

const adminRegisterSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email(),
  mobile: z.string().min(10).max(15),
  password: z.string().min(6),
  secretKey: z.string().min(1),
  badge_id: z.string().min(1),
  police_station: z.string().min(1),
  state: z.string().min(1),
  city: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = adminRegisterSchema.parse(body)

    // Verify admin secret key
    if (validatedData.secretKey !== ADMIN_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid admin secret key. Access denied.",
        },
        { status: 403 },
      )
    }

    // Create admin user with police role
    const adminData = {
      email: validatedData.email,
      mobile: validatedData.mobile,
      name: validatedData.name,
      role: "police" as const,
      password: validatedData.password,
      state: validatedData.state,
      city: validatedData.city,
      badge_id: validatedData.badge_id,
      police_station: validatedData.police_station,
    }

    const user = await createUser(adminData)

    // Generate JWT token
    const token = generateToken(user._id!.toString())

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Admin registration successful",
    })

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Admin registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid input data",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin already exists with this email or mobile number",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Admin registration failed",
      },
      { status: 500 },
    )
  }
}

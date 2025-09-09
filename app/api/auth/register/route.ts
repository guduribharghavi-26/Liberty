import { type NextRequest, NextResponse } from "next/server"
import { createUser, generateToken } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  mobile: z.string().min(10).max(15),
  name: z.string().min(2).max(255),
  role: z.enum(["woman", "police", "parent"]),
  password: z.string().min(6),
  state: z.string().optional(),
  city: z.string().optional(),
  badge_id: z.string().optional(),
  police_station: z.string().optional(),
  relation: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Create user
    const user = await createUser(validatedData)

    // Generate JWT token
    const token = generateToken(user._id!.toString())

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user

    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: "Registration successful",
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
    console.error("Registration error:", error)

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
          message: "User already exists with this email or mobile number",
        },
        { status: 409 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      { status: 500 },
    )
  }
}

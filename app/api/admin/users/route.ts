import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { getUserById } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    const user = await getUserById(decoded.userId)
    if (!user || user.role !== "police") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 })
    }

    const db = await getDatabase()

    // Get all users (excluding password hash)
    const users = await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            password_hash: 0,
          },
        },
      )
      .sort({ created_at: -1 })
      .toArray()

    console.log("Fetched users count:", users.length) // Debug log
    console.log("Sample user:", users[0]) // Debug log

    // Convert MongoDB _id to string for frontend
    const formattedUsers = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }))

    return NextResponse.json({
      success: true,
      users: formattedUsers,
    })
  } catch (error) {
    console.error("Admin users error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      { status: 500 },
    )
  }
}

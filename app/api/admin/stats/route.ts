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

    // Get user statistics
    const totalUsers = await db.collection("users").countDocuments()
    const totalWomen = await db.collection("users").countDocuments({ role: "woman" })
    const totalPolice = await db.collection("users").countDocuments({ role: "police" })
    const totalParents = await db.collection("users").countDocuments({ role: "parent" })

    // Get incident statistics
    const totalIncidents = await db.collection("incidents").countDocuments()
    const pendingIncidents = await db.collection("incidents").countDocuments({ status: "pending" })
    const resolvedIncidents = await db.collection("incidents").countDocuments({ status: "resolved" })

    // Get chat statistics
    const activeChats = await db.collection("chat_rooms").countDocuments({ is_active: true })

    const stats = {
      total_users: totalUsers,
      total_women: totalWomen,
      total_police: totalPolice,
      total_parents: totalParents,
      total_incidents: totalIncidents,
      pending_incidents: pendingIncidents,
      resolved_incidents: resolvedIncidents,
      active_chats: activeChats,
    }

    console.log("Admin stats:", stats) // Debug log

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Admin stats error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin statistics",
      },
      { status: 500 },
    )
  }
}

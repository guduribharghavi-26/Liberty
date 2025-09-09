import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById } from "@/lib/auth"
import { getDatabase, type Notification } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

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
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const db = await getDatabase()

    const notifications = await db
      .collection<Notification>("notifications")
      .find({ user_id: user._id!.toString() })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({
      success: true,
      notifications,
    })
  } catch (error) {
    console.error("Fetch notifications error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch notifications",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const { notification_id } = await request.json()

    const db = await getDatabase()

    await db.collection("notifications").updateOne(
      {
        _id: new ObjectId(notification_id),
        user_id: user._id!.toString(),
      },
      { $set: { is_read: true } },
    )

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update notification",
      },
      { status: 500 },
    )
  }
}

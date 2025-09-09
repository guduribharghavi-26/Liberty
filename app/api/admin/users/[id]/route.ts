import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { is_active, is_verified } = await request.json()
    const db = await getDatabase()

    const updateData: any = { updated_at: new Date() }
    if (typeof is_active === "boolean") updateData.is_active = is_active
    if (typeof is_verified === "boolean") updateData.is_verified = is_verified

    await db.collection("users").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
      },
      { status: 500 },
    )
  }
}

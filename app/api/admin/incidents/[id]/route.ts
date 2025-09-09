import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { getUserById } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

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

    const { status, priority, assigned_officer_id } = await request.json()
    const db = await getDatabase()

    const updateData: any = { updated_at: new Date() }
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (assigned_officer_id) updateData.assigned_officer_id = assigned_officer_id
    if (status === "resolved") updateData.resolved_at = new Date()

    await db.collection("incidents").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({
      success: true,
      message: "Incident updated successfully",
    })
  } catch (error) {
    console.error("Update incident error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update incident",
      },
      { status: 500 },
    )
  }
}

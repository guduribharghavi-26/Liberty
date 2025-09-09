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

    // Get all incidents with reporter and officer details
    const incidents = await db
      .collection("incidents")
      .aggregate([
        {
          $addFields: {
            reporter_id_obj: { $toObjectId: "$reporter_id" },
            assigned_officer_id_obj: {
              $cond: {
                if: { $ne: ["$assigned_officer_id", null] },
                then: { $toObjectId: "$assigned_officer_id" },
                else: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reporter_id_obj",
            foreignField: "_id",
            as: "reporter",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assigned_officer_id_obj",
            foreignField: "_id",
            as: "assigned_officer",
          },
        },
        {
          $addFields: {
            reporter_name: { $arrayElemAt: ["$reporter.name", 0] },
            assigned_officer_name: { $arrayElemAt: ["$assigned_officer.name", 0] },
          },
        },
        {
          $project: {
            reporter: 0,
            assigned_officer: 0,
            reporter_id_obj: 0,
            assigned_officer_id_obj: 0,
          },
        },
        {
          $sort: { created_at: -1 },
        },
      ])
      .toArray()

    console.log("Fetched incidents count:", incidents.length) // Debug log

    // Convert MongoDB _id to string for frontend
    const formattedIncidents = incidents.map((incident) => ({
      ...incident,
      _id: incident._id.toString(),
    }))

    return NextResponse.json({
      success: true,
      incidents: formattedIncidents,
    })
  } catch (error) {
    console.error("Admin incidents error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incidents",
      },
      { status: 500 },
    )
  }
}

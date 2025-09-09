import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { getUserById } from "@/lib/auth"
import { getDatabase, type Incident } from "@/lib/mongodb"
import { generateCaseNumber } from "@/lib/utils/case-number"
import { z } from "zod"

export const runtime = "nodejs"

const createIncidentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  incident_type: z.string().optional(),
  vehicle_number: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  location_address: z.string().optional(),
  notify_parent: z.boolean().default(false),
  evidence_urls: z.array(z.string()).optional(),
})

export async function POST(request: NextRequest) {
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
    if (!user || user.role !== "woman") {
      return NextResponse.json({ success: false, message: "Only women can create incidents" }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createIncidentSchema.parse(body)

    const db = await getDatabase()

    // Generate case number
    const caseNumber = generateCaseNumber()

    // Find nearest police station (simplified - in production, use geolocation)
    const policeStation = await db.collection("police_stations").findOne({
      city: user.city || "Bangalore",
      is_active: true,
    })

    // Create incident
    const newIncident: Incident = {
      case_number: caseNumber,
      reporter_id: user._id!.toString(),
      police_station_id: policeStation?._id?.toString(),
      title: validatedData.title,
      description: validatedData.description,
      incident_type: validatedData.incident_type,
      vehicle_number: validatedData.vehicle_number,
      location_lat: validatedData.location_lat,
      location_lng: validatedData.location_lng,
      location_address: validatedData.location_address,
      notify_parent: validatedData.notify_parent,
      evidence_urls: validatedData.evidence_urls,
      status: "pending",
      priority: 2, // Default medium priority
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection<Incident>("incidents").insertOne(newIncident)
    const incident = { ...newIncident, _id: result.insertedId.toString() }

    // Create notification for police (simplified)
    if (policeStation) {
      await db.collection("notifications").insertOne({
        user_id: policeStation._id.toString(),
        title: "New Incident Reported",
        message: `New incident reported: ${validatedData.title}`,
        type: "incident",
        is_read: false,
        action_url: `/incidents/${result.insertedId}`,
        created_at: new Date(),
      })
    }

    return NextResponse.json({
      success: true,
      incident,
      message: "Incident reported successfully",
    })
  } catch (error) {
    console.error("Create incident error:", error)

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

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create incident",
      },
      { status: 500 },
    )
  }
}

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
    const filter: any = {}

    // Filter based on user role
    if (user.role === "woman") {
      filter.reporter_id = user._id!.toString()
    } else if (user.role === "police") {
      filter.$or = [{ assigned_officer_id: user._id!.toString() }, { police_station_id: user.police_station }]
    }

    const incidents = await db.collection<Incident>("incidents").find(filter).sort({ created_at: -1 }).toArray()

    return NextResponse.json({
      success: true,
      incidents,
    })
  } catch (error) {
    console.error("Fetch incidents error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch incidents",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, type Incident } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const caseNumber = searchParams.get("case_number")

    if (!caseNumber) {
      return NextResponse.json({ success: false, message: "Case number required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Find incident by case number
    const incident = await db.collection<Incident>("incidents").findOne({ case_number: caseNumber })

    if (!incident) {
      return NextResponse.json({ success: false, message: "Case not found" }, { status: 404 })
    }

    // Get reporter details (without sensitive info)
    const reporter = await db
      .collection("users")
      .findOne({ _id: incident.reporter_id }, { projection: { name: 1, mobile: 1 } })

    // Get assigned officer details if exists
    let assignedOfficer = null
    if (incident.assigned_officer_id) {
      assignedOfficer = await db
        .collection("users")
        .findOne({ _id: incident.assigned_officer_id }, { projection: { name: 1, badge_id: 1 } })
    }

    // Get police station details
    let policeStation = null
    if (incident.police_station_id) {
      policeStation = await db.collection("police_stations").findOne({ _id: incident.police_station_id })
    }

    const incidentWithDetails = {
      ...incident,
      reporter_name: reporter?.name,
      assigned_officer_name: assignedOfficer?.name,
      assigned_officer_badge: assignedOfficer?.badge_id,
      police_station_name: policeStation?.name,
      police_station_phone: policeStation?.phone,
    }

    return NextResponse.json({
      success: true,
      incident: incidentWithDetails,
    })
  } catch (error) {
    console.error("Track incident error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to track incident",
      },
      { status: 500 },
    )
  }
}

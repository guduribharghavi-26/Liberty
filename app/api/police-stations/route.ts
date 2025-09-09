import { NextResponse } from "next/server"
import { getDatabase, type PoliceStation } from "@/lib/mongodb"

export const runtime = "nodejs"

export async function GET() {
  try {
    const db = await getDatabase()

    const policeStations = await db
      .collection<PoliceStation>("police_stations")
      .find({ is_active: true })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({
      success: true,
      police_stations: policeStations,
    })
  } catch (error) {
    console.error("Fetch police stations error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch police stations",
      },
      { status: 500 },
    )
  }
}

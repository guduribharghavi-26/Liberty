import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth-utils"
import { getUserById } from "@/lib/auth"
import { getDatabase, type ChatRoom, type Message } from "@/lib/mongodb"
import { z } from "zod"

export const runtime = "nodejs"

const createChatRoomSchema = z.object({
  police_station_id: z.string(),
  incident_id: z.string().optional(),
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
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { police_station_id, incident_id } = createChatRoomSchema.parse(body)

    const db = await getDatabase()

    // Check if chat room already exists
    const existingRoom = await db.collection<ChatRoom>("chat_rooms").findOne({
      user_id: user._id!.toString(),
      police_station_id,
      is_active: true,
    })

    if (existingRoom) {
      return NextResponse.json({
        success: true,
        chat_room: existingRoom,
        message: "Chat room already exists",
      })
    }

    // Find available officer from the police station
    const officer = await db.collection("users").findOne({
      role: "police",
      police_station: police_station_id,
      is_active: true,
    })

    // Create new chat room
    const newChatRoom: ChatRoom = {
      user_id: user._id!.toString(),
      officer_id: officer?._id?.toString(),
      police_station_id,
      incident_id,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection<ChatRoom>("chat_rooms").insertOne(newChatRoom)
    const chatRoom = { ...newChatRoom, _id: result.insertedId.toString() }

    // Send initial message from officer
    if (officer) {
      const initialMessage: Message = {
        chat_room_id: result.insertedId.toString(),
        sender_id: officer._id!.toString(),
        content: `Hello, this is Officer ${officer.name} from ${police_station_id}. How can I assist you today?`,
        message_type: "text",
        is_alert: false,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date(),
      }

      await db.collection<Message>("messages").insertOne(initialMessage)
    }

    return NextResponse.json({
      success: true,
      chat_room: chatRoom,
      message: "Chat room created successfully",
    })
  } catch (error) {
    console.error("Create chat room error:", error)

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
        message: "Failed to create chat room",
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
    const filter: any = { is_active: true }

    // Filter based on user role
    if (user.role === "woman") {
      filter.user_id = user._id!.toString()
    } else if (user.role === "police") {
      filter.officer_id = user._id!.toString()
    }

    const chatRooms = await db.collection<ChatRoom>("chat_rooms").find(filter).sort({ updated_at: -1 }).toArray()

    return NextResponse.json({
      success: true,
      chat_rooms: chatRooms,
    })
  } catch (error) {
    console.error("Fetch chat rooms error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch chat rooms",
      },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { verifyToken, getUserById } from "@/lib/auth"
import { getDatabase, type Message } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { z } from "zod"

const sendMessageSchema = z.object({
  chat_room_id: z.string(),
  content: z.string().optional(),
  message_type: z.enum(["text", "image", "location", "alert"]).default("text"),
  file_url: z.string().optional(),
  location_lat: z.number().optional(),
  location_lng: z.number().optional(),
  is_alert: z.boolean().default(false),
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
    const validatedData = sendMessageSchema.parse(body)

    const db = await getDatabase()

    // Verify user has access to this chat room
    const chatRoom = await db.collection("chat_rooms").findOne({
      _id: new ObjectId(validatedData.chat_room_id),
      is_active: true,
      $or: [{ user_id: user._id!.toString() }, { officer_id: user._id!.toString() }],
    })

    if (!chatRoom) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }

    // Send message
    const newMessage: Message = {
      chat_room_id: validatedData.chat_room_id,
      sender_id: user._id!.toString(),
      content: validatedData.content,
      message_type: validatedData.message_type,
      file_url: validatedData.file_url,
      location_lat: validatedData.location_lat,
      location_lng: validatedData.location_lng,
      is_alert: validatedData.is_alert,
      is_read: false,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection<Message>("messages").insertOne(newMessage)
    const message = { ...newMessage, _id: result.insertedId.toString() }

    // Update chat room timestamp
    await db
      .collection("chat_rooms")
      .updateOne({ _id: new ObjectId(validatedData.chat_room_id) }, { $set: { updated_at: new Date() } })

    // If it's an alert, create notification
    if (validatedData.is_alert) {
      const recipientId = chatRoom.user_id === user._id!.toString() ? chatRoom.officer_id : chatRoom.user_id
      if (recipientId) {
        await db.collection("notifications").insertOne({
          user_id: recipientId,
          title: "Emergency Alert",
          message: "Emergency alert received in chat",
          type: "alert",
          is_read: false,
          action_url: `/chat/${validatedData.chat_room_id}`,
          created_at: new Date(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      message,
      message_text: "Message sent successfully",
    })
  } catch (error) {
    console.error("Send message error:", error)

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
        message: "Failed to send message",
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

    const { searchParams } = new URL(request.url)
    const chatRoomId = searchParams.get("chat_room_id")

    if (!chatRoomId) {
      return NextResponse.json({ success: false, message: "Chat room ID required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Verify user has access to this chat room
    const chatRoom = await db.collection("chat_rooms").findOne({
      _id: new ObjectId(chatRoomId),
      $or: [{ user_id: user._id!.toString() }, { officer_id: user._id!.toString() }],
    })

    if (!chatRoom) {
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 })
    }

    // Fetch messages
    const messages = await db
      .collection<Message>("messages")
      .find({ chat_room_id: chatRoomId })
      .sort({ created_at: 1 })
      .toArray()

    // Mark messages as read
    await db.collection("messages").updateMany(
      {
        chat_room_id: chatRoomId,
        sender_id: { $ne: user._id!.toString() },
      },
      { $set: { is_read: true } },
    )

    return NextResponse.json({
      success: true,
      messages,
    })
  } catch (error) {
    console.error("Fetch messages error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      { status: 500 },
    )
  }
}

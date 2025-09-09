"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Send, ImageIcon, MapPin, AlertTriangle } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"

interface Message {
  id: number
  sender: "user" | "police"
  content: string
  timestamp: string
  hasLocation?: boolean
  isAlert?: boolean
  imageUrl?: string
}

export function ChatInterface() {
  const { user } = useAuth()
  const [selectedStation, setSelectedStation] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "police",
      content: "Hello, this is Officer Sharma from Koramangala Police Station. How can I assist you today?",
      timestamp: "10:30 AM",
    },
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const stations = [
    "Koramangala Police Station",
    "Whitefield Police Station", 
    "Indiranagar Police Station",
    "MG Road Police Station",
    "Electronic City Police Station",
  ]

  const sendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hasLocation: true,
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate police response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        sender: "police",
        content:
          "Thank you for reaching out. I have received your message and location. We are reviewing your case and will respond accordingly. Please stay safe.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const sendAlert = () => {
    const alertMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      content: "EMERGENCY ALERT: I need immediate assistance. Please respond urgently.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      hasLocation: true,
      isAlert: true,
    }

    setMessages([...messages, alertMessage])

    // Simulate urgent police response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        sender: "police",
        content:
          "URGENT: We have received your emergency alert. A patrol unit has been dispatched to your location. Please stay on the line and keep yourself safe. Help is on the way.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isAlert: true,
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Secure Communication Channel</h1>
        <p className="text-gray-600 mb-6">
          Connect through encrypted channels with verified safety professionals for immediate assistance.
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select Police Station</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStation} onValueChange={setSelectedStation}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your nearest police station" />
              </SelectTrigger>
              <SelectContent>
                {stations.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {selectedStation && (
        <Card className="h-[600px] min-h-0 flex flex-col">
          <CardHeader className="patriot-gradient text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedStation}</CardTitle>
                <p className="text-orange-100">Officer on duty • Online</p>
              </div>
              <Badge className="bg-green-500 text-white">Connected</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? msg.isAlert
                          ? "bg-red-500 text-white"
                          : "bg-orange-500 text-white"
                        : msg.isAlert
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.imageUrl && (
                      <img src={msg.imageUrl} alt="sent media" className="rounded-md mb-2 max-w-full h-auto" />
                    )}
                    {msg.content && <p className="text-sm">{msg.content}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${msg.sender === "user" ? "text-orange-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </span>
                      {msg.hasLocation && (
                        <MapPin className={`h-3 w-3 ${msg.sender === "user" ? "text-orange-200" : "text-gray-400"}`} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Button onClick={sendAlert} className="bg-red-600 hover:bg-red-700 text-white flex-shrink-0 font-semibold shadow-md" size="sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Emergency Alert
                </Button>
                <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                  <MapPin className="h-3 w-3 mr-1" />
                  Location Secured
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button onClick={sendMessage} className="saffron-gradient hover:opacity-90 font-semibold">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0]
                    const imageUrl = URL.createObjectURL(file)
                    const imageMessage: Message = {
                      id: messages.length + 1,
                      sender: "user",
                      content: "",
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      imageUrl,
                    }
                    setMessages([...messages, imageMessage])
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Send, Smile, Paperclip, MoreVertical, Check, CheckCheck } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  content: string
  sender: "user" | "other"
  timestamp: string
  avatar: string
  status: "sent" | "delivered" | "read"
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hey Doc any feedback on my test results? I'm wondering...",
      sender: "user",
      timestamp: "12:34",
      avatar: "/lady_profile.png?height=32&width=32",
      status: "read"
    },
    {
      id: 2,
      content: "Hello there you will be updated as soon as the test results are out.",
      sender: "other",
      timestamp: "12:35",
      avatar: "/male_doc.png?height=32&width=32",
      status: "delivered"
    },
    {
      id: 3,
      content: "Thank you for the feedback, sir",
      sender: "user",
      timestamp: "12:36",
      avatar: "/lady_profile.png?height=32&width=32",
      status: "sent"
    }
  ])
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        content: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        avatar: "/male_Doc.png?height=32&width=32",
        status: "sent"
      }])
      setNewMessage(" ")
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <header className="flex items-center px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <Avatar className="w-10 h-10 ml-2">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Harrison" />
          <AvatarFallback>H</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1">
          <h1 className="text-lg font-semibold">Harrison</h1>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{backgroundImage: "'url(data:image/svg+xml,%3Csvg width=20 height=20 viewBox=0 0 20 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%239C92AC fill-opacity=0.05 fill-rule=evenodd%3E%3Ccircle cx=3 cy=3 r=3/%3E%3Ccircle cx=13 cy=13 r=3/%3E%3C/g%3E%3C/svg%3E)'"}}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""} animate-fadeIn`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.avatar} alt="Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div
              className={`rounded-2xl p-3 max-w-[70%] shadow-sm ${
                message.sender === "user"
                  ? "bg-custom-green text-white"
                  : "bg-custom-orange dark:bg-gray-700"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs opacity-70">{message.timestamp}</span>
                {message.sender === "user" && (
                  message.status === "sent" ? <Check className="w-3 h-3" /> :
                  message.status === "delivered" ? <CheckCheck className="w-3 h-3" /> :
                  <CheckCheck className="w-3 h-3 text-blue-400" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
          <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Smile className="w-6 h-6" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
          />
          <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <Paperclip className="w-6 h-6" />
          </Button>
          <Button size="icon" className="rounded-full bg-custom-green hover:bg-custom-orange text-white" onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
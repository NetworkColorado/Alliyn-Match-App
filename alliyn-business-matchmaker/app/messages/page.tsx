"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Search, Crown } from "lucide-react"
import Navigation from "@/components/navigation"
import { useMessaging } from "@/contexts/messaging-context"
import { useGoals } from "@/contexts/goals-context"

export default function MessagesPage() {
  const { updateGoalProgress } = useGoals()
  const { conversations, messages, sendMessage, markAsRead, getConversation, markMatchesAsViewed } = useMessaging()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    markMatchesAsViewed()
  }, [markMatchesAsViewed])

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation, newMessage.trim())
      updateGoalProgress("messages") // Track message goal
      setNewMessage("")
    }
  }

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    markAsRead(conversationId)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const selectedConv = selectedConversation ? getConversation(selectedConversation) : null
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : []

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      <Navigation />

      <div className="pt-24 pb-24 min-h-screen">
        {selectedConversation && selectedConv ? (
          // Chat View
          <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-192px)]">
            <div className="border-b p-4 flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
                ← Back
              </Button>
              {selectedConv.participants
                .filter((p) => p.id !== "user-1")
                .map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={participant.avatar || "/placeholder.svg"}
                        alt={participant.name}
                        className="object-cover object-top"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{participant.name}</h3>
                        {participant.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{participant.businessName}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex-1 p-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto">
              {conversationMessages.map((message) => {
                const isCurrentUser = message.senderId === "user-1"
                const sender = selectedConv.participants.find((p) => p.id === message.senderId)

                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8 mb-1">
                        <AvatarImage
                          src={sender?.avatar || "/placeholder.svg"}
                          alt={sender?.name}
                          className="object-cover object-top"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                          {sender?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? "bg-purple-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${isCurrentUser ? "text-purple-200" : "text-gray-500"}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {isCurrentUser && (
                      <Avatar className="w-8 h-8 mb-1">
                        <AvatarImage src="/placeholder-user.jpg" alt="You" className="object-cover object-top" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Conversations List
          <div className="max-w-md mx-auto px-4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </div>

            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Send className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-500">Start swiping to find matches and begin conversations!</p>
                </div>
              ) : (
                conversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find((p) => p.id !== "user-1")
                  if (!otherParticipant) return null

                  return (
                    <Card
                      key={conversation.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors border-0 shadow-none"
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={otherParticipant.avatar || "/placeholder.svg"}
                              alt={otherParticipant.name}
                              className="object-cover object-top"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                              {otherParticipant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-gray-900 truncate">{otherParticipant.name}</h3>
                                {otherParticipant.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                              </div>
                              <span className="text-xs text-gray-500">
                                {conversation.lastMessage ? formatTime(conversation.lastMessage.timestamp) : ""}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{otherParticipant.businessName}</p>
                            <p className="text-sm text-gray-700 truncate mt-1">
                              {conversation.lastMessage?.message || "Start a conversation"}
                            </p>
                          </div>

                          {conversation.unreadCount > 0 && (
                            <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

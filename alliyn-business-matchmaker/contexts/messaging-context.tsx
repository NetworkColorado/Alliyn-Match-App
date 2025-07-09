"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import { v4 as uuidv4 } from "uuid"

interface Participant {
  id: string
  name: string
  avatar?: string
  businessName?: string
  isPremium?: boolean
}

interface Message {
  id: string
  senderId: string
  message: string
  timestamp: Date
}

interface Conversation {
  id: string
  participants: Participant[]
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}

interface MessagingContextType {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  createConversation: (profile: any) => string
  sendMessage: (conversationId: string, text: string) => void
  markAsRead: (conversationId: string) => void
  getConversation: (id: string) => Conversation | undefined
  totalUnreadCount: number
  hasNewMatches: boolean
  markMatchesAsViewed: () => void
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

interface Props {
  children: React.ReactNode
}

// Mock auto-reply messages
const AUTO_REPLIES = [
  "That sounds interesting! Tell me more about your business.",
  "I'd love to explore potential partnerships with you.",
  "Your company looks impressive. What kind of collaboration are you looking for?",
  "Thanks for reaching out! I think there could be great synergy between our businesses.",
  "I'm excited to discuss this further. When would be a good time to chat?",
  "Your proposal aligns well with our current goals. Let's set up a meeting!",
  "I've been looking for someone with your expertise. This could be perfect timing.",
  "Your business model is fascinating. How long have you been in this industry?",
  "I think our companies could complement each other well. What's your vision for partnership?",
  "This is exactly the kind of opportunity I've been seeking. Let's make it happen!",
]

export const MessagingProvider: React.FC<Props> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [hasNewMatches, setHasNewMatches] = useState(false)

  const CURRENT_USER: Participant = {
    id: "user-1",
    name: "You",
    avatar: "/placeholder-user.jpg",
    businessName: "My Business",
    isPremium: false,
  }

  // Auto-reply function
  const sendAutoReply = (conversationId: string, otherParticipant: Participant) => {
    setTimeout(
      () => {
        const randomReply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
        const autoMessage: Message = {
          id: uuidv4(),
          senderId: otherParticipant.id,
          message: randomReply,
          timestamp: new Date(),
        }

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] || []), autoMessage],
        }))

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  messages: [...conversation.messages, autoMessage],
                  lastMessage: autoMessage,
                  unreadCount: conversation.unreadCount + 1,
                }
              : conversation,
          ),
        )
      },
      2000 + Math.random() * 3000,
    ) // Random delay between 2-5 seconds
  }

  const createConversation = (profile: any): string => {
    const conversationId = uuidv4()

    // Convert profile to participant format
    const participant: Participant = {
      id: profile.id.toString(),
      name: profile.name,
      avatar: profile.image,
      businessName: profile.businessName,
      isPremium: Math.random() > 0.6, // 40% chance of premium for demo
    }

    const newConversation: Conversation = {
      id: conversationId,
      participants: [CURRENT_USER, participant],
      messages: [],
      unreadCount: 0,
    }

    setConversations((prev) => [...prev, newConversation])
    setMessages((prev) => ({ ...prev, [conversationId]: [] }))
    setHasNewMatches(true)

    // Send initial greeting from the other person
    setTimeout(() => {
      const greetings = [
        "Hi! Thanks for matching with me. I'm excited to explore potential partnerships!",
        "Hello! I saw your profile and think our businesses could work well together.",
        "Hey there! I'm interested in learning more about your company.",
        "Hi! Your business looks really interesting. I'd love to connect!",
        "Hello! I think there might be some great collaboration opportunities between us.",
      ]

      const greeting = greetings[Math.floor(Math.random() * greetings.length)]
      const initialMessage: Message = {
        id: uuidv4(),
        senderId: participant.id,
        message: greeting,
        timestamp: new Date(),
      }

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [initialMessage],
      }))

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [initialMessage],
                lastMessage: initialMessage,
                unreadCount: 1,
              }
            : conversation,
        ),
      )
    }, 1000)

    return conversationId
  }

  const sendMessage = (conversationId: string, text: string) => {
    const newMsg: Message = {
      id: uuidv4(),
      senderId: CURRENT_USER.id,
      message: text,
      timestamp: new Date(),
    }

    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }))

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, newMsg],
              lastMessage: newMsg,
            }
          : conversation,
      ),
    )

    // Trigger auto-reply
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      const otherParticipant = conversation.participants.find((p) => p.id !== CURRENT_USER.id)
      if (otherParticipant) {
        sendAutoReply(conversationId, otherParticipant)
      }
    }
  }

  const markAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation,
      ),
    )
  }

  const markMatchesAsViewed = () => {
    setHasNewMatches(false)
  }

  const getConversation = (id: string) => conversations.find((conversation) => conversation.id === id)

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  const value: MessagingContextType = {
    conversations,
    messages,
    createConversation,
    sendMessage,
    markAsRead,
    getConversation,
    totalUnreadCount,
    hasNewMatches,
    markMatchesAsViewed,
  }

  return <MessagingContext.Provider value={value}>{children}</MessagingContext.Provider>
}

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error("useMessaging must be used within a MessagingProvider")
  }
  return context
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, X } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"

interface MatchModalProps {
  matchData: {
    profile: any
    nickname: string
    reasons: string[]
  }
  onClose: () => void
}

export default function MatchModal({ matchData, onClose }: MatchModalProps) {
  const { user } = useUser()
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card
        className={`w-full max-w-md transform transition-all duration-300 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <CardContent className="p-6 text-center space-y-4">
          <div className="relative">
            <Button variant="ghost" size="sm" className="absolute -top-2 -right-2" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>

            <div className="text-6xl mb-4">🎉</div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">It's a Match!</h2>

            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-4 py-2 mb-4">
              {matchData.nickname}
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage
                  src={user.profile?.avatar || "/placeholder.svg"}
                  alt="You"
                  className="object-cover object-top"
                />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg">
                  {user.profile?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">You</p>
            </div>

            <Heart className="w-8 h-8 text-red-500" />

            <div className="text-center">
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage
                  src={matchData.profile.image || "/placeholder.svg"}
                  alt={matchData.profile.name}
                  className="object-cover object-top"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-lg">
                  {matchData.profile.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium">{matchData.profile.name}</p>
            </div>
          </div>

          <div className="text-left space-y-2">
            <h4 className="font-semibold text-gray-900">Why you're perfect together:</h4>
            {matchData.reasons.map((reason, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600">{reason}</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleClose}>
              Keep Swiping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

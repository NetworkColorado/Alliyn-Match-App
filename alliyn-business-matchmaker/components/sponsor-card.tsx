"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Briefcase, Star, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SponsorCardProps {
  isAnimating?: boolean
  onAccept: () => void
  onDecline: () => void
}

const sponsorData = {
  businessName: "BusinessBoost Pro",
  tagline: "AI-Powered Business Growth Platform",
  description:
    "Transform your business with our comprehensive suite of AI-powered tools designed to accelerate growth, optimize operations, and maximize partnerships.",
  offer: "50% Off First 3 Months + Free Setup",
  features: [
    "Advanced Analytics Dashboard",
    "Partnership Recommendations",
    "Market Intelligence Reports",
    "24/7 Priority Support",
  ],
  location: "Available Nationwide",
  yearsInBusiness: 8,
  image: "/placeholder.svg?height=400&width=400",
  logo: "🚀",
}

export default function SponsorCard({ isAnimating, onAccept, onDecline }: SponsorCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden shadow-xl transition-transform duration-300 border-2 border-yellow-400",
        isAnimating && "scale-95 opacity-50",
      )}
    >
      {/* Sponsored Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-white" />
          <span className="text-white font-bold text-sm">SPONSORED PARTNERSHIP</span>
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="relative">
        <img
          src={sponsorData.image || "/placeholder.svg"}
          alt={sponsorData.businessName}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{sponsorData.logo}</div>
            <div>
              <h2 className="text-2xl font-bold">{sponsorData.businessName}</h2>
              <p className="text-lg opacity-90">{sponsorData.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className="font-medium">Business Growth Platform</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{sponsorData.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{sponsorData.yearsInBusiness} years helping businesses grow</span>
        </div>

        <p className="text-gray-700 leading-relaxed">{sponsorData.description}</p>

        {/* Special Offer */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">🎁 Exclusive Partnership Offer</h4>
          <p className="text-green-700 font-semibold">{sponsorData.offer}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
            <div className="space-y-2">
              {sponsorData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Partnership Types:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Technology Integration
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Strategic Alliance
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Affiliate Program
              </Badge>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600"
            onClick={onDecline}
          >
            <X className="w-4 h-4 mr-2" />
            Not Interested
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onAccept}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

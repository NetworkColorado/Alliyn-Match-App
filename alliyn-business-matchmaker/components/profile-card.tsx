import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { Crown } from "lucide-react"

interface Profile {
  id: number
  name: string
  businessName: string
  title: string
  description: string
  yearsInBusiness: number
  partnerships: string[]
  industries: string[]
  primaryIndustry?: string
  location: string
  image: string
  companyLogo?: string
  selectedTheme?: string
}

interface ProfileCardProps {
  profile: Profile
  isAnimating?: boolean
}

// Profile card themes from the shop
const profileCardThemes = [
  {
    id: "default",
    name: "Default",
    image: null,
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
  },
  {
    id: "city",
    name: "City Skyline",
    image: "/shop/city-background.png",
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/85 via-black/40 to-transparent",
  },
  {
    id: "flower",
    name: "Flower Pattern",
    image: "/shop/flower-background.png",
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
  },
  {
    id: "red-carpet",
    name: "Red Carpet",
    image: "/shop/red-carpet-background.png",
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/85 via-black/45 to-transparent",
  },
  {
    id: "luxury-home",
    name: "Luxury Home",
    image: "/shop/luxury-home-background.png",
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/80 via-black/35 to-transparent",
  },
]

export default function ProfileCard({ profile, isAnimating }: ProfileCardProps) {
  // Add this to determine if profile is premium (mock logic)
  const isPremium = Math.random() > 0.6 // 40% chance of premium for demo

  // Get the selected theme for this profile
  const selectedTheme = profile.selectedTheme || "default"
  const currentTheme = profileCardThemes.find((theme) => theme.id === selectedTheme) || profileCardThemes[0]

  return (
    <div className="relative p-1 rounded-xl overflow-hidden shadow-xl">
      {/* Theme border background */}
      {currentTheme.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentTheme.image})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500" />
      )}

      {/* Inner card with theme integration */}
      <Card
        className={cn(
          "overflow-hidden transition-transform duration-300 mobile-card-shadow relative bg-white",
          "mx-2 sm:mx-0", // Add horizontal margin on mobile
          isAnimating && "scale-95 opacity-50",
        )}
      >
        <div className="relative">
          {/* Main profile image - responsive height */}
          <img
            src={profile.image || "/placeholder.svg?height=400&width=400"}
            alt={profile.name}
            className="w-full h-72 sm:h-80 object-cover object-center"
            style={{ objectPosition: "center 20%" }}
          />

          {/* Company logo overlay - responsive sizing */}
          {profile.companyLogo && (
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full p-1.5 sm:p-2 shadow-lg border-2 border-white">
              <img
                src={profile.companyLogo || "/placeholder.svg"}
                alt={`${profile.businessName} logo`}
                className="w-full h-full object-cover object-center rounded-full"
              />
            </div>
          )}

          {/* Enhanced gradient overlay for better text visibility */}
          <div className={`absolute inset-0 ${currentTheme.overlayOpacity}`} />

          {/* Name and business info overlay - responsive text */}
          <div
            className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 ${currentTheme.textColor}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{profile.name}</h2>
              {isPremium && (
                <div className="bg-yellow-500 rounded-full p-1">
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base sm:text-lg opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {profile.businessName}
              </p>
              {isPremium && <Badge className="bg-yellow-500 text-yellow-900 text-xs">PREMIUM</Badge>}
            </div>
          </div>
        </div>

        {/* Theme background section - integrated with the card */}
        {currentTheme.image && (
          <div className="relative h-16 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentTheme.image})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white text-sm font-medium drop-shadow-lg">{currentTheme.name} Theme</p>
            </div>
          </div>
        )}

        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">{profile.title}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">{profile.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm sm:text-base">{profile.yearsInBusiness} years in business</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">{profile.primaryIndustry || profile.industries[0]}</span>
          </div>

          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{profile.description}</p>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Looking for:</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {profile.partnerships.map((partnership) => (
                  <Badge key={partnership} variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    {partnership}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Industries:</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {profile.industries.map((industry) => (
                  <Badge key={industry} variant="outline" className="border-blue-200 text-blue-700 text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

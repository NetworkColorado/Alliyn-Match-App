"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X, RotateCcw, Clock } from "lucide-react"
import Navigation from "@/components/navigation"
import ProfileCard from "@/components/profile-card"
import SponsorCard from "@/components/sponsor-card"
import { useUser } from "@/contexts/user-context"
import ConfettiAnimation from "@/components/confetti-animation"
import MatchModal from "@/components/match-modal"
import { useMatching } from "@/contexts/matching-context"
import { useMessaging } from "@/contexts/messaging-context"
import { useGoals } from "@/contexts/goals-context"

// Expanded mock business profiles data with real professional photos
const mockProfiles = [
  {
    id: 1,
    name: "Melissa Rodriguez",
    businessName: "Strategic Marketing Solutions",
    title: "Founder & Creative Director",
    description:
      "Award-winning marketing agency specializing in brand development and digital campaigns for growing businesses. We help companies tell their story and connect with their ideal customers.",
    yearsInBusiness: 7,
    partnerships: ["Co-Branding", "Referral Partner", "Event Collaborations"],
    industries: ["Marketing & Advertising", "Professional, Scientific & Technical Services", "Creative Services"],
    location: "Denver, CO",
    image: "/profiles/melissa-marketing.webp",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Robert Harrison",
    businessName: "Harrison Capital Group",
    title: "Managing Partner",
    description:
      "Private equity firm focused on mid-market acquisitions and growth capital investments. We partner with exceptional management teams to build market-leading companies.",
    yearsInBusiness: 15,
    partnerships: ["Strategic Alliances", "Joint Ventures", "Investment Partnerships"],
    industries: ["Finance & Insurance", "Professional, Scientific & Technical Services", "Investment Management"],
    location: "Chicago, IL",
    image: "/profiles/robert-executive.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "David Chen",
    businessName: "NextGen Ventures",
    title: "CEO & Co-Founder",
    description:
      "Innovation-driven venture capital firm investing in early-stage technology companies. We provide capital, mentorship, and strategic guidance to ambitious entrepreneurs.",
    yearsInBusiness: 4,
    partnerships: ["Investment Partnerships", "Strategic Alliances", "Mentorship Programs"],
    industries: ["Technology (IT) & Software", "Finance & Insurance", "Professional, Scientific & Technical Services"],
    location: "San Francisco, CA",
    image: "/profiles/david-entrepreneur.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Samantha Williams",
    businessName: "Executive Leadership Consulting",
    title: "Principal Consultant",
    description:
      "Transformational leadership consulting firm helping C-suite executives and high-potential leaders maximize their impact and drive organizational success.",
    yearsInBusiness: 9,
    partnerships: ["Strategic Alliances", "Referral Partner", "Training Partnerships"],
    industries: ["Professional, Scientific & Technical Services", "Management Consulting", "Executive Coaching"],
    location: "Atlanta, GA",
    image: "/profiles/samantha-consulting.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Emma Thompson",
    businessName: "Creative Collective Studios",
    title: "Creative Director & Owner",
    description:
      "Full-service creative agency specializing in brand identity, web design, and content creation for innovative businesses looking to make a lasting impression.",
    yearsInBusiness: 6,
    partnerships: ["Co-Branding", "Event Collaborations", "Creative Partnerships"],
    industries: ["Creative Services", "Marketing & Advertising", "Technology (IT) & Software"],
    location: "Portland, OR",
    image: "/profiles/emma-creative.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Lisa Park",
    businessName: "TechForward Solutions",
    title: "Founder & CTO",
    description:
      "Enterprise software development company creating custom solutions for Fortune 500 companies. We specialize in AI integration, cloud migration, and digital transformation.",
    yearsInBusiness: 8,
    partnerships: ["Technology Partnerships", "Strategic Alliances", "Integration Partners"],
    industries: [
      "Technology (IT) & Software",
      "Professional, Scientific & Technical Services",
      "Information Technology",
    ],
    location: "Seattle, WA",
    image: "/profiles/lisa-tech.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    name: "Angela Davis",
    businessName: "Davis Legal Advisors",
    title: "Managing Partner",
    description:
      "Boutique law firm specializing in corporate law, mergers & acquisitions, and business formation. We provide strategic legal counsel to growing companies and entrepreneurs.",
    yearsInBusiness: 12,
    partnerships: ["Referral Partner", "Strategic Alliances", "Professional Networks"],
    industries: ["Legal Services", "Professional, Scientific & Technical Services", "Business Consulting"],
    location: "New York, NY",
    image: "/profiles/angela-legal.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    name: "Michael Johnson",
    businessName: "Growth Partners International",
    title: "Principal & Business Development Director",
    description:
      "Business development and expansion consulting firm helping companies scale operations, enter new markets, and optimize growth strategies for sustainable success.",
    yearsInBusiness: 11,
    partnerships: ["Strategic Alliances", "Joint Ventures", "Market Entry Partnerships"],
    industries: ["Professional, Scientific & Technical Services", "Business Consulting", "International Trade"],
    location: "Miami, FL",
    image: "/profiles/michael-business.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 9,
    name: "James Mitchell",
    businessName: "Startup Accelerator Labs",
    title: "Founder & Managing Director",
    description:
      "Early-stage startup accelerator and incubator providing funding, mentorship, and resources to innovative entrepreneurs building the next generation of game-changing companies.",
    yearsInBusiness: 5,
    partnerships: ["Investment Partnerships", "Mentorship Programs", "Strategic Alliances"],
    industries: ["Technology (IT) & Software", "Professional, Scientific & Technical Services", "Venture Capital"],
    location: "Austin, TX",
    image: "/profiles/james-startup.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 10,
    name: "Sophia Kim",
    businessName: "Financial Strategy Group",
    title: "Senior Partner & CFO",
    description:
      "Comprehensive financial advisory firm providing strategic planning, investment management, and corporate finance solutions to high-growth companies and affluent individuals.",
    yearsInBusiness: 10,
    partnerships: ["Investment Partnerships", "Strategic Alliances", "Referral Partner"],
    industries: ["Finance & Insurance", "Professional, Scientific & Technical Services", "Investment Management"],
    location: "Los Angeles, CA",
    image: "/profiles/sophia-finance.jpeg",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 11,
    name: "Sarah Johnson",
    businessName: "TechFlow Solutions",
    title: "CEO & Founder",
    description: "Leading software development company specializing in AI-powered business automation tools.",
    yearsInBusiness: 8,
    partnerships: ["Strategic Alliances", "Joint Ventures", "Co-Branding"],
    industries: ["Technology (IT) & Software", "Professional, Scientific & Technical Services"],
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=400&width=400",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 12,
    name: "Michael Chen",
    businessName: "GreenBuild Construction",
    title: "Managing Director",
    description: "Sustainable construction company focused on eco-friendly commercial and residential projects.",
    yearsInBusiness: 12,
    partnerships: ["Affiliate Partnerships", "Sponsorship Agreements", "Referral Partner"],
    industries: ["Construction", "Real Estate & Rental Leasing"],
    location: "Austin, TX",
    image: "/placeholder.svg?height=400&width=400",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 13,
    name: "Emily Rodriguez",
    businessName: "HealthFirst Clinics",
    title: "Chief Medical Officer",
    description:
      "Network of primary care clinics providing comprehensive healthcare services to underserved communities.",
    yearsInBusiness: 6,
    partnerships: ["Event Collaborations", "Strategic Alliances"],
    industries: ["Healthcare & Social Assistance", "Nonprofits & Religious Organizations"],
    location: "Phoenix, AZ",
    image: "/placeholder.svg?height=400&width=400",
    companyLogo: "/placeholder.svg?height=100&width=100",
  },
]

export default function HomePage() {
  const {
    user,
    incrementSwipes,
    incrementMatches,
    swipedProfiles,
    addSwipedProfile,
    resetSwipedProfiles,
    simulateUpgrade,
  } = useUser()
  const { getCompatibilityScore, addMatch } = useMatching()
  const { createConversation } = useMessaging()
  const { updateGoalProgress } = useGoals()
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [showSponsor, setShowSponsor] = useState(false)
  const [matches, setMatches] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [matchData, setMatchData] = useState<{
    profile: any
    nickname: string
    reasons: string[]
  } | null>(null)
  const [timeRemaining, setTimeRemaining] = useState("")

  // Swipe gesture states
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  // Filter out already swiped profiles
  const availableProfiles = mockProfiles.filter((profile) => !swipedProfiles.includes(profile.id))
  const currentProfile = availableProfiles[currentProfileIndex]

  // Check daily limits for free users - updated to 50 swipes and 3 matches
  const canSwipe = user.accountType === "premium" || user.dailySwipes < 50
  const canMatch = user.accountType === "premium" || user.dailyMatches < 3

  // Calculate countdown timer
  const getTimeUntilReset = () => {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const timeLeft = tomorrow.getTime() - now.getTime()
    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      const countdown = getTimeUntilReset()
      setTimeRemaining(countdown)

      // Check if timer reached 0:00:00 and reset limits
      if (countdown === "00:00:00") {
        // Reset daily limits (this would normally be handled by the backend)
        localStorage.removeItem("dailySwipes")
        localStorage.removeItem("dailyMatches")
        localStorage.removeItem("lastResetDate")
        window.location.reload() // Refresh to apply changes
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Reset to first profile if we've gone through all available profiles
  useEffect(() => {
    if (availableProfiles.length > 0 && currentProfileIndex >= availableProfiles.length) {
      setCurrentProfileIndex(0)
    }
  }, [availableProfiles.length, currentProfileIndex])

  const getCompatibilityNickname = (profile: any) => {
    const reasons = []
    let nickname = "Perfect Match"

    // Check for same industry
    const sharedIndustries = profile.industries.filter((industry: string) =>
      user.profile?.industries?.includes(industry),
    )

    // Check for shared partnerships
    const sharedPartnerships = profile.partnerships.filter((partnership: string) =>
      user.profile?.partnerships?.includes(partnership),
    )

    // Industry Veterans (same industry + both 20+ years)
    if (sharedIndustries.length > 0 && profile.yearsInBusiness >= 20 && (user.profile?.yearsInBusiness || 0) >= 20) {
      nickname = "Industry Veterans"
      reasons.push("Both seasoned professionals in " + sharedIndustries[0])
    }
    // Startup Squad (both under 5 years)
    else if (profile.yearsInBusiness <= 5 && (user.profile?.yearsInBusiness || 0) <= 5) {
      nickname = "Startup Squad"
      reasons.push("Both emerging businesses ready to grow together")
    }
    // Partnership Pros (3+ shared partnership types)
    else if (sharedPartnerships.length >= 3) {
      nickname = "Partnership Pros"
      reasons.push("Multiple shared partnership interests")
    }
    // Tech Titans (both in technology)
    else if (sharedIndustries.some((industry) => industry.includes("Technology"))) {
      nickname = "Tech Titans"
      reasons.push("Both innovating in the technology space")
    }
    // Growth Gurus (both in growth-focused industries)
    else if (
      sharedIndustries.some((industry) =>
        [
          "Marketing & Advertising",
          "E-commerce & Online Marketplaces",
          "Professional, Scientific & Technical Services",
        ].includes(industry),
      )
    ) {
      nickname = "Growth Gurus"
      reasons.push("Both focused on business growth and expansion")
    }
    // Local Legends (same city)
    else if (profile.location.split(",")[1]?.trim() === user.profile?.location?.split(",")[1]?.trim()) {
      nickname = "Local Legends"
      reasons.push("Both building businesses in the same area")
    }
    // Industry Innovators (same industry)
    else if (sharedIndustries.length > 0) {
      nickname = "Industry Innovators"
      reasons.push("Both excelling in " + sharedIndustries[0])
    }
    // Partnership Pioneers (shared partnership interests)
    else if (sharedPartnerships.length > 0) {
      nickname = "Partnership Pioneers"
      reasons.push("Shared interest in " + sharedPartnerships[0])
    }

    return { nickname, reasons }
  }

  // Handle swipe gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAnimating || !canSwipe || !currentProfile) return

    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setDragOffset({ x: 0, y: 0 })

    if (cardRef.current) {
      cardRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return

    setIsDragging(false)

    const deltaX = e.clientX - dragStart.x
    const threshold = 100 // Minimum distance to trigger swipe

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swiped right - accept
        handleSwipe("right")
      } else {
        // Swiped left - decline
        handleSwipe("left")
      }
    }

    // Reset drag state
    setDragOffset({ x: 0, y: 0 })

    if (cardRef.current) {
      cardRef.current.releasePointerCapture(e.pointerId)
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating || !canSwipe || !currentProfile) return

    setIsAnimating(true)
    incrementSwipes()

    // Update goals progress for swiping
    updateGoalProgress("swipes")

    // Track this profile as swiped
    addSwipedProfile(currentProfile.id)

    if (direction === "right" && canMatch) {
      const compatibility = getCompatibilityScore(currentProfile)
      setMatches((prev) => [...prev, currentProfile.id])

      // Add to matching system
      addMatch(currentProfile, compatibility)

      // Create conversation
      const conversationId = createConversation(currentProfile)

      // Update goals progress for matching
      updateGoalProgress("matches")

      setMatchData({
        profile: currentProfile,
        nickname: compatibility.nickname,
        reasons: compatibility.reasons,
      })
      setShowConfetti(true)
      incrementMatches()

      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000)
    }

    setTimeout(() => {
      const newSwipeCount = swipeCount + 1
      setSwipeCount(newSwipeCount)

      // Show sponsor ad every 5 swipes
      if (newSwipeCount % 5 === 0) {
        setShowSponsor(true)
        return
      }

      // Move to next available profile
      if (availableProfiles.length > 1) {
        setCurrentProfileIndex((prev) => (prev + 1) % availableProfiles.length)
      }
      setIsAnimating(false)
    }, 300)
  }

  const handleResetProfiles = () => {
    resetSwipedProfiles()
    setCurrentProfileIndex(0)
    setSwipeCount(0)
  }

  const handleSponsorAccept = () => {
    // Handle sponsor acceptance - could open external link or show more info
    alert("🎉 Great! You'll be redirected to learn more about this partnership opportunity.")
    window.open("https://example.com/businessboost-partnership", "_blank")
    setShowSponsor(false)
    if (availableProfiles.length > 1) {
      setCurrentProfileIndex((prev) => (prev + 1) % availableProfiles.length)
    }
    setIsAnimating(false)
  }

  const handleSponsorDecline = () => {
    // Handle sponsor decline
    setShowSponsor(false)
    if (availableProfiles.length > 1) {
      setCurrentProfileIndex((prev) => (prev + 1) % availableProfiles.length)
    }
    setIsAnimating(false)
  }

  const handleSponsorSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      handleSponsorAccept()
    } else {
      handleSponsorDecline()
    }
  }

  // Show daily limit reached message
  if (!canSwipe || (!canMatch && user.accountType === "free")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
        <Navigation />
        <div className="pt-24 px-4 pb-24 min-h-screen">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mobile-card-shadow">
              <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Daily Limit Reached</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {!canSwipe
                  ? `You've used all 50 daily swipes. Your limits will reset in:`
                  : `You've reached your 3 daily matches limit. Your limits will reset in:`}
              </p>

              {/* Countdown Timer */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-orange-600 mb-2">{timeRemaining || "00:00:00"}</div>
                <p className="text-sm text-orange-700">Hours : Minutes : Seconds</p>
              </div>

              {/* Daily Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-blue-600">{user.dailySwipes}</span>
                  </div>
                  <p className="text-xs text-gray-500">/ 50 swipes today</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-red-600">{user.dailyMatches}</span>
                  </div>
                  <p className="text-xs text-gray-500">/ 3 matches today</p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={simulateUpgrade} className="w-full bg-purple-600 hover:bg-purple-700 mb-2">
                  Upgrade to Premium
                </Button>
                <p className="text-xs text-gray-500 mt-2">Or wait for the timer to reset your daily limits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show message when no more profiles available
  if (availableProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
        <Navigation />
        <div className="pt-24 px-4 pb-24 min-h-screen">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mobile-card-shadow">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">You've seen everyone!</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                You've swiped through all available profiles. Check back later for new business partners or reset to see
                profiles again.
              </p>
              <Button onClick={handleResetProfiles} className="bg-purple-600 hover:bg-purple-700 touch-target">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset & See Profiles Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showSponsor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
        <Navigation />

        {showConfetti && <ConfettiAnimation />}

        <div className="pt-24 px-4 pb-24 min-h-screen">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Alliyn</h1>
              <p className="text-gray-600 text-sm sm:text-base">Partnership Opportunity</p>
            </div>

            <div className="relative">
              <SponsorCard isAnimating={isAnimating} onAccept={handleSponsorAccept} onDecline={handleSponsorDecline} />

              <div className="flex justify-center gap-4 sm:gap-6 mt-6">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 border-red-200 hover:border-red-300 hover:bg-red-50 touch-target bg-transparent"
                  onClick={() => handleSponsorSwipe("left")}
                  disabled={isAnimating}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                </Button>

                <Button
                  size="lg"
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 touch-target"
                  onClick={() => handleSponsorSwipe("right")}
                  disabled={isAnimating}
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Ad Banner */}
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm z-40 safe-area-bottom">
          <span className="text-xs sm:text-sm">🚀 Boost your business with premium partnerships - </span>
          <button className="underline font-semibold text-xs sm:text-sm">Learn More</button>
        </div>
      </div>
    )
  }

  // Handle case where currentProfile might be undefined
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
        <Navigation />
        <div className="pt-24 px-4 pb-24 min-h-screen">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mobile-card-shadow">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Loading profiles...</h2>
              <p className="text-gray-600 text-sm sm:text-base">Finding the perfect business partners for you.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
      <Navigation />

      {showConfetti && <ConfettiAnimation />}

      {matchData && <MatchModal matchData={matchData} onClose={() => setMatchData(null)} />}

      <div className="pt-24 px-4 pb-24 min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Alliyn</h1>
            <p className="text-gray-600 text-sm sm:text-base">Find your perfect business partner</p>

            {/* Only show daily limits for free users */}
            {user.accountType === "free" && (
              <div className="flex justify-center gap-4 mt-4 text-xs sm:text-sm text-gray-500">
                <span>Daily Swipes: {user.dailySwipes}/50</span>
                <span>Daily Matches: {user.dailyMatches}/3</span>
              </div>
            )}

            {!canSwipe && (
              <div className="mt-2 p-2 bg-yellow-100 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-800">
                  Daily limit reached! Upgrade to Premium for unlimited swipes.
                </p>
                <Button
                  onClick={simulateUpgrade}
                  size="sm"
                  className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Simulate Premium Access
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <div
              ref={cardRef}
              className="relative cursor-grab active:cursor-grabbing select-none"
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y * 0.1}px) rotate(${dragOffset.x * 0.1}deg)`,
                transition: isDragging ? "none" : "transform 0.3s ease-out",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <ProfileCard profile={currentProfile} isAnimating={isAnimating} />

              {/* Swipe indicators */}
              {isDragging && (
                <>
                  {dragOffset.x > 50 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg pointer-events-none">
                      ACCEPT
                    </div>
                  )}
                  {dragOffset.x < -50 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg pointer-events-none">
                      DECLINE
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex justify-center gap-4 sm:gap-6 mt-6">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-14 h-14 sm:w-16 sm:h-16 border-red-200 hover:border-red-300 hover:bg-red-50 touch-target bg-transparent"
                onClick={() => handleSwipe("left")}
                disabled={isAnimating || !canSwipe}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              </Button>

              <Button
                size="lg"
                className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 touch-target"
                onClick={() => handleSwipe("right")}
                disabled={isAnimating || !canSwipe || !canMatch}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </Button>
            </div>

            {availableProfiles.length <= 3 && (
              <div className="text-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetProfiles}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50 touch-target bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Profiles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm z-40 safe-area-bottom">
        <span className="text-xs sm:text-sm">🚀 Boost your business with premium partnerships - </span>
        <button className="underline font-semibold text-xs sm:text-sm">Learn More</button>
      </div>
    </div>
  )
}

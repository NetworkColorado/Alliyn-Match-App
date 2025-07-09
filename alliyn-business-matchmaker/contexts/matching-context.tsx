"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./user-context"

interface Match {
  id: string
  profile: any
  matchedAt: Date
  compatibility: {
    nickname: string
    reasons: string[]
    score: number
  }
  conversationId?: string
}

interface MatchingContextType {
  matches: Match[]
  potentialMatches: any[]
  addMatch: (profile: any, compatibility: any) => void
  getCompatibilityScore: (profile: any) => { nickname: string; reasons: string[]; score: number }
  autoMatch: () => void
  isAutoMatching: boolean
  lastAutoMatch: Date | null
  getAllUserMatches: () => { [userId: string]: number }
}

const MatchingContext = createContext<MatchingContextType | undefined>(undefined)

export function MatchingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser()
  const [matches, setMatches] = useState<Match[]>([])
  const [potentialMatches, setPotentialMatches] = useState<any[]>([])
  const [isAutoMatching, setIsAutoMatching] = useState(false)
  const [lastAutoMatch, setLastAutoMatch] = useState<Date | null>(null)

  // Mock matches for other users (for leaderboard)
  const [otherUserMatches] = useState({
    "user-2": 42, // Sarah Johnson
    "user-3": 38, // Michael Chen
    "user-4": 47, // Emily Rodriguez
    "user-5": 31, // David Kim
  })

  // Mock potential matches pool
  const allProfiles = [
    {
      id: 1,
      name: "Sarah Johnson",
      businessName: "TechFlow Solutions",
      title: "CEO & Founder",
      description: "Leading software development company specializing in AI-powered business automation tools.",
      yearsInBusiness: 8,
      partnerships: ["Strategic Alliances", "Joint Ventures", "Co-Branding"],
      industries: ["Technology (IT) & Software", "Professional, Scientific & Technical Services"],
      location: "San Francisco, CA",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 2,
      name: "Michael Chen",
      businessName: "GreenBuild Construction",
      title: "Managing Director",
      description: "Sustainable construction company focused on eco-friendly commercial and residential projects.",
      yearsInBusiness: 12,
      partnerships: ["Affiliate Partnerships", "Sponsorship Agreements", "Referral Partner"],
      industries: ["Construction", "Real Estate & Rental Leasing"],
      location: "Austin, TX",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 3,
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
    },
    {
      id: 4,
      name: "David Kim",
      businessName: "Digital Marketing Pro",
      title: "Marketing Director",
      description: "Full-service digital marketing agency helping businesses grow their online presence.",
      yearsInBusiness: 4,
      partnerships: ["Strategic Alliances", "Joint Ventures", "Affiliate Partnerships"],
      industries: ["Marketing & Advertising", "Professional, Scientific & Technical Services"],
      location: "Los Angeles, CA",
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      id: 5,
      name: "Lisa Thompson",
      businessName: "EcoLogistics",
      title: "Operations Manager",
      description: "Sustainable logistics and supply chain solutions for environmentally conscious businesses.",
      yearsInBusiness: 15,
      partnerships: ["Strategic Alliances", "Referral Partner", "Event Collaborations"],
      industries: ["Transportation & Warehousing", "Warehousing & Logistics (3PL)"],
      location: "Seattle, WA",
      image: "/placeholder.svg?height=400&width=400",
    },
  ]

  const getCompatibilityScore = (profile: any) => {
    if (!user.profile) {
      return { nickname: "Perfect Match", reasons: [], score: 50 }
    }

    let score = 0
    const reasons: string[] = []
    let nickname = "Perfect Match"

    // Industry compatibility (30 points max)
    const sharedIndustries = profile.industries.filter((industry: string) =>
      user.profile?.industries?.includes(industry),
    )
    if (sharedIndustries.length > 0) {
      score += sharedIndustries.length * 15
      reasons.push(`Both active in ${sharedIndustries[0]}`)
    }

    // Partnership compatibility (25 points max)
    const sharedPartnerships = profile.partnerships.filter((partnership: string) =>
      user.profile?.partnerships?.includes(partnership),
    )
    if (sharedPartnerships.length > 0) {
      score += sharedPartnerships.length * 8
      reasons.push(`Shared interest in ${sharedPartnerships[0]}`)
    }

    // Experience compatibility (20 points max)
    const userYears = user.profile?.yearsInBusiness || 0
    const profileYears = profile.yearsInBusiness
    const yearsDiff = Math.abs(userYears - profileYears)
    if (yearsDiff <= 2) {
      score += 20
      reasons.push("Similar business experience levels")
    } else if (yearsDiff <= 5) {
      score += 15
      reasons.push("Complementary experience levels")
    } else if (yearsDiff <= 10) {
      score += 10
    }

    // Location compatibility (15 points max)
    const userState = user.profile?.location?.split(",")[1]?.trim()
    const profileState = profile.location.split(",")[1]?.trim()
    if (userState === profileState) {
      score += 15
      reasons.push("Both located in the same state")
    }

    // Business size compatibility (10 points max)
    if (userYears >= 20 && profileYears >= 20) {
      score += 10
      nickname = "Industry Veterans"
      reasons.unshift("Both seasoned professionals with 20+ years experience")
    } else if (userYears <= 5 && profileYears <= 5) {
      score += 10
      nickname = "Startup Squad"
      reasons.unshift("Both emerging businesses ready to grow together")
    }

    // Special nicknames based on combinations
    if (sharedPartnerships.length >= 3) {
      nickname = "Partnership Pros"
      score += 5
    } else if (sharedIndustries.some((industry) => industry.includes("Technology"))) {
      nickname = "Tech Titans"
      score += 5
    } else if (
      sharedIndustries.some((industry) =>
        ["Marketing & Advertising", "E-commerce & Online Marketplaces"].includes(industry),
      )
    ) {
      nickname = "Growth Gurus"
      score += 5
    } else if (userState === profileState && sharedIndustries.length > 0) {
      nickname = "Local Legends"
      score += 5
    }

    return { nickname, reasons, score: Math.min(score, 100) }
  }

  const addMatch = (profile: any, compatibility: any) => {
    const newMatch: Match = {
      id: `match-${Date.now()}`,
      profile,
      matchedAt: new Date(),
      compatibility,
    }

    setMatches((prev) => {
      const updatedMatches = [newMatch, ...prev]

      // Trigger a custom event to notify leaderboard
      window.dispatchEvent(
        new CustomEvent("matchAdded", {
          detail: {
            match: newMatch,
            totalMatches: updatedMatches.length,
          },
        }),
      )

      return updatedMatches
    })
  }

  const getAllUserMatches = () => {
    return {
      "1": matches.length, // Current user's actual matches
      ...otherUserMatches, // Mock data for other users
    }
  }

  const autoMatch = () => {
    // Only premium users can use auto-match
    if (user.accountType !== "premium" || !user.profile || isAutoMatching) return

    setIsAutoMatching(true)
    setLastAutoMatch(new Date())

    // Find potential matches with high compatibility scores
    const highCompatibilityProfiles = allProfiles
      .filter((profile) => !matches.some((match) => match.profile.id === profile.id))
      .map((profile) => ({
        profile,
        compatibility: getCompatibilityScore(profile),
      }))
      .filter((item) => item.compatibility.score >= 70) // Only auto-match high compatibility
      .sort((a, b) => b.compatibility.score - a.compatibility.score)

    if (highCompatibilityProfiles.length > 0) {
      const bestMatch = highCompatibilityProfiles[0]
      addMatch(bestMatch.profile, bestMatch.compatibility)

      // Show notification
      setTimeout(() => {
        alert(
          `🎉 Auto-Match Success! You've been matched with ${bestMatch.profile.businessName} (${bestMatch.compatibility.score}% compatibility)!`,
        )
      }, 1000)
    } else {
      console.log("No high-compatibility matches found for auto-match")
    }

    setTimeout(() => setIsAutoMatching(false), 2000)
  }

  // Auto-match every 20 minutes for premium users only
  useEffect(() => {
    if (user.accountType === "premium") {
      const interval = setInterval(
        () => {
          console.log("Running auto-match check...")
          autoMatch()
        },
        20 * 60 * 1000,
      ) // 20 minutes in milliseconds

      return () => clearInterval(interval)
    }
  }, [user.accountType, matches, user.profile])

  return (
    <MatchingContext.Provider
      value={{
        matches,
        potentialMatches,
        addMatch,
        getCompatibilityScore,
        autoMatch,
        isAutoMatching,
        lastAutoMatch,
        getAllUserMatches,
      }}
    >
      {children}
    </MatchingContext.Provider>
  )
}

export function useMatching() {
  const context = useContext(MatchingContext)
  if (context === undefined) {
    throw new Error("useMatching must be used within a MatchingProvider")
  }
  return context
}

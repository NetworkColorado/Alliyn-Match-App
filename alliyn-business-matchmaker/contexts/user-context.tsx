"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Update the UserProfile interface to include account status and selectedTheme
interface UserProfile {
  name: string
  businessName: string
  title: string
  description: string
  yearsInBusiness: number
  location: string
  partnerships: string[]
  industries: string[]
  primaryIndustry: string
  avatar: string
  companyLogo: string
  isActive: boolean // Add this field for account status
  email: string // Add email field
  selectedTheme: string // Add selectedTheme field
}

// Update the User interface
interface User {
  id: string
  email: string
  accountType: "free" | "premium"
  dailySwipes: number
  dailyMatches: number
  totalMatches: number
  totalDeals: number
  profile: UserProfile | null
  createdAt: string
}

// Add toggleAccountStatus method to UserContextType
interface UserContextType {
  user: User
  incrementSwipes: () => void
  incrementMatches: () => void
  upgradeToPremium: () => void
  updateProfile: (profile: UserProfile) => void
  toggleAccountStatus: () => void
  swipedProfiles: number[]
  addSwipedProfile: (id: number) => void
  resetSwipedProfiles: () => void
  simulateUpgrade: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    id: "1",
    // Add email field to user
    email: "john@innovatetech.com",
    accountType: "free",
    dailySwipes: 0,
    dailyMatches: 0,
    totalMatches: 0,
    totalDeals: 0,
    profile: {
      name: "John Smith",
      businessName: "InnovateTech Solutions",
      title: "CEO & Founder",
      description:
        "Leading technology company specializing in innovative software solutions for small and medium businesses.",
      yearsInBusiness: 5,
      location: "San Francisco, CA",
      partnerships: ["Strategic Alliances", "Joint Ventures"],
      industries: ["Technology (IT) & Software", "Professional, Scientific & Technical Services"],
      primaryIndustry: "Technology (IT) & Software",
      avatar: "/placeholder.svg?height=400&width=400",
      companyLogo: "/placeholder.svg?height=100&width=100",
      isActive: true,
      email: "john@innovatetech.com",
      selectedTheme: "default", // Add default theme
    },
    createdAt: new Date().toISOString(),
  })

  // --- track swiped profile ids (persisted) --------------------
  const [swipedProfiles, setSwipedProfiles] = useState<number[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("swipedProfiles") ?? "[]")
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("swipedProfiles", JSON.stringify(swipedProfiles))
  }, [swipedProfiles])

  // Reset daily limits at midnight (simplified version)
  useEffect(() => {
    const resetDailyLimits = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const msUntilMidnight = tomorrow.getTime() - now.getTime()

      setTimeout(() => {
        setUser((prev) => ({
          ...prev,
          dailySwipes: 0,
          dailyMatches: 0,
        }))
        resetDailyLimits() // Set up next reset
      }, msUntilMidnight)
    }

    resetDailyLimits()
  }, [])

  const incrementSwipes = () => {
    // Check daily limits for free users
    const canSwipe = user.accountType === "premium" || user.dailySwipes < 50

    if (canSwipe) {
      setUser((prev) => ({
        ...prev,
        dailySwipes: prev.dailySwipes + 1,
      }))
    }
  }

  const incrementMatches = () => {
    // Check daily limits for free users
    const canMatch = user.accountType === "premium" || user.dailyMatches < 3

    if (canMatch) {
      setUser((prev) => ({
        ...prev,
        dailyMatches: prev.dailyMatches + 1,
        totalMatches: prev.totalMatches + 1,
      }))
    }
  }

  const upgradeToPremium = () => {
    setUser((prev) => ({
      ...prev,
      accountType: "premium",
    }))
  }

  const simulateUpgrade = () => {
    setUser((prev) => ({
      ...prev,
      accountType: "premium",
    }))
  }

  // Fixed updateProfile function - don't change isActive status
  const updateProfile = (profile: UserProfile) => {
    setUser((prev) => ({
      ...prev,
      profile: {
        ...profile,
        isActive: prev.profile?.isActive ?? true, // Preserve current isActive status
      },
    }))
  }

  // Add toggleAccountStatus function
  const toggleAccountStatus = () => {
    setUser((prev) => ({
      ...prev,
      profile: prev.profile
        ? {
            ...prev.profile,
            isActive: !prev.profile.isActive,
          }
        : null,
    }))
  }

  const addSwipedProfile = (id: number) => {
    setSwipedProfiles((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const resetSwipedProfiles = () => {
    setSwipedProfiles([])
  }

  return (
    <UserContext.Provider
      value={{
        user,
        incrementSwipes,
        incrementMatches,
        upgradeToPremium,
        updateProfile,
        toggleAccountStatus,
        swipedProfiles,
        addSwipedProfile,
        resetSwipedProfiles,
        simulateUpgrade,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

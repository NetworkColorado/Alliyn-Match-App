"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Goal {
  id: string
  title: string
  description: string
  type: "daily" | "monthly"
  target: number
  current: number
  points: number
  category: "swipes" | "matches" | "deals" | "messages" | "profile"
  icon: string
  completed: boolean
  completedAt?: Date
}

interface Achievement {
  id: string
  goalId: string
  title: string
  description: string
  points: number
  completedAt: Date
  category: string
  icon: string
}

interface GoalsContextType {
  dailyGoals: Goal[]
  monthlyGoals: Goal[]
  achievements: Achievement[]
  totalPoints: number
  monthlyPoints: number
  hasPremiumDiscount: boolean
  updateGoalProgress: (category: string, amount?: number) => void
  getGoalProgress: (goalId: string) => number
  resetDailyGoals: () => void
  getAchievementsByMonth: (month: number, year: number) => Achievement[]
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined)

const initialDailyGoals: Goal[] = [
  {
    id: "daily-swipes",
    title: "Daily Swiper",
    description: "Swipe on 10 profiles",
    type: "daily",
    target: 10,
    current: 0,
    points: 7,
    category: "swipes",
    icon: "👆",
    completed: false,
  },
  {
    id: "daily-matches",
    title: "Match Maker",
    description: "Get 2 new matches",
    type: "daily",
    target: 2,
    current: 0,
    points: 10,
    category: "matches",
    icon: "💝",
    completed: false,
  },
  {
    id: "daily-messages",
    title: "Conversation Starter",
    description: "Send 3 messages",
    type: "daily",
    target: 3,
    current: 0,
    points: 8,
    category: "messages",
    icon: "💬",
    completed: false,
  },
]

const initialMonthlyGoals: Goal[] = [
  {
    id: "monthly-deals",
    title: "Deal Closer",
    description: "Complete 5 deals this month",
    type: "monthly",
    target: 5,
    current: 0,
    points: 35,
    category: "deals",
    icon: "🤝",
    completed: false,
  },
  {
    id: "monthly-matches",
    title: "Networking Pro",
    description: "Get 25 matches this month",
    type: "monthly",
    target: 25,
    current: 0,
    points: 28,
    category: "matches",
    icon: "🌟",
    completed: false,
  },
  {
    id: "monthly-profile",
    title: "Profile Perfectionist",
    description: "Update your profile 3 times",
    type: "monthly",
    target: 3,
    current: 0,
    points: 18,
    category: "profile",
    icon: "✨",
    completed: false,
  },
  {
    id: "monthly-messages",
    title: "Communication Champion",
    description: "Send 50 messages this month",
    type: "monthly",
    target: 50,
    current: 0,
    points: 25,
    category: "messages",
    icon: "📱",
    completed: false,
  },
]

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [dailyGoals, setDailyGoals] = useState<Goal[]>(() => {
    if (typeof window === "undefined") return initialDailyGoals
    try {
      const saved = localStorage.getItem("dailyGoals")
      return saved ? JSON.parse(saved) : initialDailyGoals
    } catch {
      return initialDailyGoals
    }
  })

  const [monthlyGoals, setMonthlyGoals] = useState<Goal[]>(() => {
    if (typeof window === "undefined") return initialMonthlyGoals
    try {
      const saved = localStorage.getItem("monthlyGoals")
      return saved ? JSON.parse(saved) : initialMonthlyGoals
    } catch {
      return initialMonthlyGoals
    }
  })

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem("achievements")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [totalPoints, setTotalPoints] = useState(() => {
    if (typeof window === "undefined") return 0
    try {
      const saved = localStorage.getItem("totalPoints")
      return saved ? Number.parseInt(saved) : 0
    } catch {
      return 0
    }
  })

  const [monthlyPoints, setMonthlyPoints] = useState(() => {
    if (typeof window === "undefined") return 0
    try {
      const saved = localStorage.getItem("monthlyPoints")
      const lastReset = localStorage.getItem("monthlyPointsReset")
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${now.getMonth()}`

      if (lastReset !== currentMonth) {
        // Reset monthly points if it's a new month
        localStorage.setItem("monthlyPointsReset", currentMonth)
        localStorage.setItem("monthlyPoints", "0")
        return 0
      }

      return saved ? Number.parseInt(saved) : 0
    } catch {
      return 0
    }
  })

  const [hasPremiumDiscount, setHasPremiumDiscount] = useState(() => {
    if (typeof window === "undefined") return false
    try {
      const saved = localStorage.getItem("hasPremiumDiscount")
      const discountExpiry = localStorage.getItem("premiumDiscountExpiry")

      if (discountExpiry && new Date() > new Date(discountExpiry)) {
        localStorage.removeItem("hasPremiumDiscount")
        localStorage.removeItem("premiumDiscountExpiry")
        return false
      }

      return saved === "true"
    } catch {
      return false
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("dailyGoals", JSON.stringify(dailyGoals))
  }, [dailyGoals])

  useEffect(() => {
    localStorage.setItem("monthlyGoals", JSON.stringify(monthlyGoals))
  }, [monthlyGoals])

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }, [achievements])

  useEffect(() => {
    localStorage.setItem("totalPoints", totalPoints.toString())
  }, [totalPoints])

  useEffect(() => {
    localStorage.setItem("monthlyPoints", monthlyPoints.toString())
  }, [monthlyPoints])

  // Reset daily goals at midnight
  useEffect(() => {
    const resetDailyGoals = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const msUntilMidnight = tomorrow.getTime() - now.getTime()

      setTimeout(() => {
        setDailyGoals((prev) =>
          prev.map((goal) => ({
            ...goal,
            current: 0,
            completed: false,
            completedAt: undefined,
          })),
        )
        resetDailyGoals() // Set up next reset
      }, msUntilMidnight)
    }

    resetDailyGoals()
  }, [])

  // Check for premium discount eligibility
  useEffect(() => {
    if (monthlyPoints >= 175 && !hasPremiumDiscount) {
      setHasPremiumDiscount(true)
      localStorage.setItem("hasPremiumDiscount", "true")

      // Set expiry for next month
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      localStorage.setItem("premiumDiscountExpiry", nextMonth.toISOString())

      // Trigger premium discount notification
      window.dispatchEvent(new CustomEvent("premiumDiscountEarned"))
    }
  }, [monthlyPoints, hasPremiumDiscount])

  const updateGoalProgress = (category: string, amount = 1) => {
    const now = new Date()

    // Update daily goals
    setDailyGoals((prev) =>
      prev.map((goal) => {
        if (goal.category === category && !goal.completed) {
          const newCurrent = Math.min(goal.current + amount, goal.target)
          const isCompleted = newCurrent >= goal.target

          if (isCompleted && !goal.completed) {
            // Goal completed! Add achievement and points
            const achievement: Achievement = {
              id: `${goal.id}-${Date.now()}`,
              goalId: goal.id,
              title: goal.title,
              description: goal.description,
              points: goal.points,
              completedAt: now,
              category: goal.category,
              icon: goal.icon,
            }

            setAchievements((prev) => [...prev, achievement])
            setTotalPoints((prev) => prev + goal.points)
            setMonthlyPoints((prev) => prev + goal.points)

            // Trigger goal completion event
            window.dispatchEvent(
              new CustomEvent("goalCompleted", {
                detail: { goal, achievement },
              }),
            )

            return {
              ...goal,
              current: newCurrent,
              completed: true,
              completedAt: now,
            }
          }

          return {
            ...goal,
            current: newCurrent,
          }
        }
        return goal
      }),
    )

    // Update monthly goals
    setMonthlyGoals((prev) =>
      prev.map((goal) => {
        if (goal.category === category && !goal.completed) {
          const newCurrent = Math.min(goal.current + amount, goal.target)
          const isCompleted = newCurrent >= goal.target

          if (isCompleted && !goal.completed) {
            // Goal completed! Add achievement and points
            const achievement: Achievement = {
              id: `${goal.id}-${Date.now()}`,
              goalId: goal.id,
              title: goal.title,
              description: goal.description,
              points: goal.points,
              completedAt: now,
              category: goal.category,
              icon: goal.icon,
            }

            setAchievements((prev) => [...prev, achievement])
            setTotalPoints((prev) => prev + goal.points)
            setMonthlyPoints((prev) => prev + goal.points)

            // Trigger goal completion event
            window.dispatchEvent(
              new CustomEvent("goalCompleted", {
                detail: { goal, achievement },
              }),
            )

            return {
              ...goal,
              current: newCurrent,
              completed: true,
              completedAt: now,
            }
          }

          return {
            ...goal,
            current: newCurrent,
          }
        }
        return goal
      }),
    )
  }

  const getGoalProgress = (goalId: string): number => {
    const dailyGoal = dailyGoals.find((g) => g.id === goalId)
    const monthlyGoal = monthlyGoals.find((g) => g.id === goalId)
    const goal = dailyGoal || monthlyGoal

    if (!goal) return 0
    return Math.min((goal.current / goal.target) * 100, 100)
  }

  const resetDailyGoalsManual = () => {
    setDailyGoals((prev) =>
      prev.map((goal) => ({
        ...goal,
        current: 0,
        completed: false,
        completedAt: undefined,
      })),
    )
  }

  const getAchievementsByMonth = (month: number, year: number): Achievement[] => {
    return achievements.filter((achievement) => {
      const achievementDate = new Date(achievement.completedAt)
      return achievementDate.getMonth() === month && achievementDate.getFullYear() === year
    })
  }

  return (
    <GoalsContext.Provider
      value={{
        dailyGoals,
        monthlyGoals,
        achievements,
        totalPoints,
        monthlyPoints,
        hasPremiumDiscount,
        updateGoalProgress,
        getGoalProgress,
        resetDailyGoals: resetDailyGoalsManual,
        getAchievementsByMonth,
      }}
    >
      {children}
    </GoalsContext.Provider>
  )
}

export function useGoals() {
  const context = useContext(GoalsContext)
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalsProvider")
  }
  return context
}

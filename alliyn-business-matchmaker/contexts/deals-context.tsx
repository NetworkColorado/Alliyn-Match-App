"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Deal {
  id: string
  title: string
  partner: string
  amount: string
  partnershipType: string
  date: string
  status: "In Progress" | "Completed"
  description?: string
  userId: string
}

interface DealsContextType {
  deals: Deal[]
  addDeal: (deal: Omit<Deal, "id" | "userId">) => void
  updateDeal: (id: string, updates: Partial<Deal>) => void
  getUserDeals: (userId: string) => Deal[]
  getTotalValue: (userId: string) => number
  getCompletedDealsCount: (userId: string) => number
  getAllUserStats: () => { [userId: string]: { totalValue: number; completedDeals: number } }
}

const DealsContext = createContext<DealsContextType | undefined>(undefined)

export function DealsProvider({ children }: { children: React.ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      title: "AI Integration Partnership",
      partner: "TechFlow Solutions",
      amount: "$250,000",
      partnershipType: "Strategic Alliances",
      date: "2024-01-15",
      status: "Completed",
      userId: "1",
    },
    {
      id: "deal-2",
      title: "Green Building Initiative",
      partner: "EcoConstruct Inc",
      amount: "$180,000",
      partnershipType: "Joint Ventures",
      date: "2024-01-10",
      status: "In Progress",
      userId: "1",
    },
    {
      id: "deal-3",
      title: "Healthcare Referral Program",
      partner: "MedConnect Network",
      amount: "$95,000",
      partnershipType: "Referral Partner",
      date: "2024-01-05",
      status: "Completed",
      userId: "1",
    },
    // Mock deals for other users for leaderboard
    {
      id: "deal-4",
      title: "Tech Partnership",
      partner: "InnovateTech Solutions",
      amount: "$2,400,000",
      partnershipType: "Strategic Alliances",
      date: "2024-01-20",
      status: "Completed",
      userId: "user-2", // Sarah Johnson
    },
    {
      id: "deal-5",
      title: "Construction Alliance",
      partner: "BuildCorp",
      amount: "$1,800,000",
      partnershipType: "Joint Ventures",
      date: "2024-01-18",
      status: "Completed",
      userId: "user-3", // Michael Chen
    },
    {
      id: "deal-6",
      title: "Healthcare Innovation",
      partner: "MedTech Solutions",
      amount: "$1,200,000",
      partnershipType: "Strategic Alliances",
      date: "2024-01-12",
      status: "Completed",
      userId: "user-4", // Emily Rodriguez
    },
    {
      id: "deal-7",
      title: "Marketing Campaign",
      partner: "BrandBoost Inc",
      amount: "$950,000",
      partnershipType: "Co-Branding",
      date: "2024-01-08",
      status: "Completed",
      userId: "user-5", // David Kim
    },
  ])

  const addDeal = (dealData: Omit<Deal, "id" | "userId">) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}`,
      userId: "1", // Current user
    }
    setDeals((prev) => [newDeal, ...prev])

    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent("dealAdded", { detail: newDeal }))
  }

  const updateDeal = (id: string, updates: Partial<Deal>) => {
    setDeals((prev) => {
      const updatedDeals = prev.map((deal) => (deal.id === id ? { ...deal, ...updates } : deal))

      // If status changed to completed, trigger event
      const updatedDeal = updatedDeals.find((d) => d.id === id)
      const originalDeal = prev.find((d) => d.id === id)

      if (updatedDeal && originalDeal && originalDeal.status !== "Completed" && updatedDeal.status === "Completed") {
        // Trigger a custom event to notify leaderboard
        window.dispatchEvent(new CustomEvent("dealCompleted", { detail: updatedDeal }))
      }

      return updatedDeals
    })
  }

  const getUserDeals = (userId: string) => {
    return deals.filter((deal) => deal.userId === userId)
  }

  const getTotalValue = (userId: string) => {
    return getUserDeals(userId)
      .filter((deal) => deal.status === "Completed")
      .reduce((sum, deal) => {
        return sum + Number.parseInt(deal.amount.replace(/[$,]/g, ""))
      }, 0)
  }

  const getCompletedDealsCount = (userId: string) => {
    return getUserDeals(userId).filter((deal) => deal.status === "Completed").length
  }

  const getAllUserStats = () => {
    const userIds = ["1", "user-2", "user-3", "user-4", "user-5"]
    const stats: { [userId: string]: { totalValue: number; completedDeals: number } } = {}

    userIds.forEach((userId) => {
      stats[userId] = {
        totalValue: getTotalValue(userId),
        completedDeals: getCompletedDealsCount(userId),
      }
    })

    return stats
  }

  return (
    <DealsContext.Provider
      value={{
        deals,
        addDeal,
        updateDeal,
        getUserDeals,
        getTotalValue,
        getCompletedDealsCount,
        getAllUserStats,
      }}
    >
      {children}
    </DealsContext.Provider>
  )
}

export function useDeals() {
  const context = useContext(DealsContext)
  if (context === undefined) {
    throw new Error("useDeals must be used within a DealsProvider")
  }
  return context
}

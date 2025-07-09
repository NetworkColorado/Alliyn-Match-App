"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface Transaction {
  id: string
  type: "gift_sent" | "gift_received" | "subscription" | "deposit" | "withdrawal" | "profile_card"
  description: string
  amount: number // in coins
  dollarAmount: number // in dollars
  timestamp: Date
  isPositive: boolean // true for income, false for expense
}

interface TransactionsContextType {
  transactions: Transaction[]
  coinBalance: number
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void
  updateCoinBalance: (amount: number) => void
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined)

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [coinBalance, setCoinBalance] = useState(12475) // Starting balance
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "subscription",
      description: "Premium Subscription",
      amount: -200,
      dollarAmount: -19.99,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isPositive: false,
    },
    {
      id: "2",
      type: "gift_received",
      description: "Gift Received - Coffee",
      amount: 72,
      dollarAmount: 7.2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isPositive: true,
    },
  ])

  const addTransaction = (transaction: Omit<Transaction, "id" | "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    setTransactions((prev) => [newTransaction, ...prev])

    // Update coin balance
    setCoinBalance((prev) => prev + transaction.amount)
  }

  const updateCoinBalance = (amount: number) => {
    setCoinBalance((prev) => prev + amount)
  }

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        coinBalance,
        addTransaction,
        updateCoinBalance,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionsProvider")
  }
  return context
}

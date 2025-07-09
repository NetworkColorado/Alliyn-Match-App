"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/contexts/user-context"
import { AuthProvider } from "@/contexts/auth-context"
import { MatchingProvider } from "@/contexts/matching-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { GoalsProvider } from "@/contexts/goals-context"
import { TransactionsProvider } from "@/contexts/transactions-context"
import { Toaster } from "@/components/ui/sonner"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {/* UserProvider must come **before** AuthProvider so AuthProvider can safely call useUser() */}
      <UserProvider>
        <AuthProvider>
          <TransactionsProvider>
            <MatchingProvider>
              <MessagingProvider>
                <GoalsProvider>
                  {children}
                  <Toaster />
                </GoalsProvider>
              </MessagingProvider>
            </MatchingProvider>
          </TransactionsProvider>
        </AuthProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

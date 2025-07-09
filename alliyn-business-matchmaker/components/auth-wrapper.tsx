"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = pathname?.startsWith("/auth")

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.push("/auth/signin")
    } else if (isAuthenticated && isAuthPage) {
      router.push("/")
    }
  }, [isAuthenticated, isAuthPage, router])

  // Show auth pages when not authenticated
  if (!isAuthenticated && isAuthPage) {
    return <>{children}</>
  }

  // Show main app when authenticated
  if (isAuthenticated && !isAuthPage) {
    return <>{children}</>
  }

  // Show loading or nothing while redirecting
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  )
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./user-context"

interface SignUpData {
  email: string
  password: string
  name: string
  businessName: string
  title: string
  location: string
  yearsInBusiness: number
  primaryIndustry: string
  description: string
  partnerships: string[]
  industries: string[]
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (data: SignUpData) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { updateProfile } = useUser()

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("alliyn_auth")
    if (savedAuth) {
      setIsAuthenticated(true)
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo credentials - in production, this would validate against backend
    if (email === "demo@alliyn.com" && password === "demo123") {
      setIsAuthenticated(true)
      localStorage.setItem("alliyn_auth", JSON.stringify({ email, timestamp: Date.now() }))
      setIsLoading(false)
      return true
    }

    // Check if user exists in localStorage (for demo purposes)
    const existingUsers = JSON.parse(localStorage.getItem("alliyn_users") || "[]")
    const user = existingUsers.find((u: any) => u.email === email && u.password === password)

    if (user) {
      setIsAuthenticated(true)
      localStorage.setItem("alliyn_auth", JSON.stringify({ email, timestamp: Date.now() }))

      // Update the current user profile with the stored user data
      updateProfile({
        name: user.name,
        businessName: user.businessName,
        title: user.title || "",
        description: user.description || "",
        yearsInBusiness: user.yearsInBusiness || 0,
        location: user.location || "",
        partnerships: user.partnerships || [],
        industries: user.industries || [],
        primaryIndustry: user.primaryIndustry || "",
        avatar: "/placeholder.svg?height=400&width=400",
        companyLogo: "/placeholder.svg?height=100&width=100",
        isActive: true,
        email: user.email,
        selectedTheme: "default",
      })

      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signUp = async (data: SignUpData): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem("alliyn_users") || "[]")
    const emailExists = existingUsers.some((user: any) => user.email === data.email)

    if (emailExists) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password,
      name: data.name,
      businessName: data.businessName,
      title: data.title || "",
      location: data.location || "",
      yearsInBusiness: data.yearsInBusiness || 0,
      primaryIndustry: data.primaryIndustry || "",
      description: data.description || "",
      partnerships: data.partnerships || [],
      industries: data.industries || [],
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage (in production, this would be saved to backend)
    existingUsers.push(newUser)
    localStorage.setItem("alliyn_users", JSON.stringify(existingUsers))

    // Set authentication
    setIsAuthenticated(true)
    localStorage.setItem("alliyn_auth", JSON.stringify({ email: data.email, timestamp: Date.now() }))

    // Update the current user profile with all the sign-up data
    updateProfile({
      name: data.name,
      businessName: data.businessName,
      title: data.title || "",
      description: data.description || "",
      yearsInBusiness: data.yearsInBusiness || 0,
      location: data.location || "",
      partnerships: data.partnerships || [],
      industries: data.industries || [],
      primaryIndustry: data.primaryIndustry || "",
      avatar: "/placeholder.svg?height=400&width=400",
      companyLogo: "/placeholder.svg?height=100&width=100",
      isActive: true,
      email: data.email,
      selectedTheme: "default",
    })

    setIsLoading(false)
    return true
  }

  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("alliyn_auth")
    // Redirect to sign in page
    window.location.href = "/auth/signin"
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

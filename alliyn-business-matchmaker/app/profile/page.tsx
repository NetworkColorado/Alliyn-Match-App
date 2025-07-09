"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Save, X, Camera, Building, Edit, Crown, Power, Lock, Check, Palette, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Navigation from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import ImageEditor from "@/components/image-editor"

const partnershipTypes = [
  "Strategic Alliances",
  "Joint Ventures",
  "Co-Branding",
  "Affiliate Partnerships",
  "Sponsorship Agreements",
  "Event Collaborations",
  "Incubator/Accelerator Collaborations",
  "Referral Partner",
]

const industries = [
  "Healthcare & Social Assistance",
  "Retail Trade",
  "Professional, Scientific & Technical Services",
  "Construction",
  "Educational Services",
  "Manufacturing",
  "Accommodation & Food Services",
  "Finance & Insurance",
  "Transportation & Warehousing",
  "Administrative & Support Services",
  "Real Estate & Rental Leasing",
  "Wholesale Trade",
  "Technology (IT) & Software",
  "Public Administration (Government Services)",
  "Utilities",
  "Arts, Entertainment & Recreation",
  "Agriculture, Forestry, Fishing & Hunting",
  "Mining, Oil & Gas Extraction",
  "Waste Management & Remediation Services",
  "Management of Companies & Enterprises (Holdings)",
  "Telecommunications",
  "Legal Services",
  "Automotive Repair & Maintenance",
  "Personal & Laundry Services",
  "Warehousing & Logistics (3PL)",
  "Food & Beverage Production",
  "Nonprofits & Religious Organizations",
  "Beauty & Personal Care Services",
  "Marketing & Advertising",
  "E-commerce & Online Marketplaces",
  "Insurance",
  "Media",
]

// Profile card themes from the shop
const profileCardThemes = [
  {
    id: "default",
    name: "Default",
    image: null,
    isUnlocked: true,
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
  },
  {
    id: "city",
    name: "City Skyline",
    image: "/shop/city-background.png",
    isUnlocked: false, // Will be unlocked when gifted
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/85 via-black/40 to-transparent",
  },
  {
    id: "flower",
    name: "Flower Pattern",
    image: "/shop/flower-background.png",
    isUnlocked: false,
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/90 via-black/50 to-transparent",
  },
  {
    id: "red-carpet",
    name: "Red Carpet",
    image: "/shop/red-carpet-background.png",
    isUnlocked: false,
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/85 via-black/45 to-transparent",
  },
  {
    id: "luxury-home",
    name: "Luxury Home",
    image: "/shop/luxury-home-background.png",
    isUnlocked: false,
    textColor: "text-white",
    overlayOpacity: "bg-gradient-to-t from-black/80 via-black/35 to-transparent",
  },
]

export default function ProfilePage() {
  const { user, updateProfile, toggleAccountStatus } = useUser()
  const [showPreview, setShowPreview] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [showAvatarEditor, setShowAvatarEditor] = useState(false)
  const [showLogoEditor, setShowLogoEditor] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [showFirstTimePrompt, setShowFirstTimePrompt] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Profile card theme state
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(["default", "city"]) // Mock: city theme unlocked
  const [selectedTheme, setSelectedTheme] = useState(user.profile?.selectedTheme || "default")

  const [profileData, setProfileData] = useState({
    name: user.profile?.name || "",
    businessName: user.profile?.businessName || "",
    title: user.profile?.title || "",
    description: user.profile?.description || "",
    yearsInBusiness: user.profile?.yearsInBusiness?.toString() || "",
    location: user.profile?.location || "",
    partnerships: user.profile?.partnerships || [],
    industries: user.profile?.industries || [],
    primaryIndustry: user.profile?.primaryIndustry || "",
    avatar: user.profile?.avatar || "/placeholder.svg?height=400&width=400",
    companyLogo: user.profile?.companyLogo || "/placeholder.svg?height=100&width=100",
    selectedTheme: user.profile?.selectedTheme || "default",
    email: user.profile?.email || "",
    isActive: user.profile?.isActive ?? true,
  })

  // Check for first-time login on component mount
  useEffect(() => {
    const isFirstLogin = localStorage.getItem("alliyn_first_login")
    if (isFirstLogin === "true") {
      setShowFirstTimePrompt(true)
      // Remove the flag so it doesn't show again
      localStorage.removeItem("alliyn_first_login")
    }
  }, [])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "logo") => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (type === "avatar") {
      setIsUploadingAvatar(true)
    } else {
      setIsUploadingLogo(true)
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setTempImageUrl(result)

      if (type === "avatar") {
        setShowAvatarEditor(true)
        setIsUploadingAvatar(false)
      } else {
        setShowLogoEditor(true)
        setIsUploadingLogo(false)
      }
    }

    reader.onerror = () => {
      alert("Error reading file")
      if (type === "avatar") {
        setIsUploadingAvatar(false)
      } else {
        setIsUploadingLogo(false)
      }
    }

    reader.readAsDataURL(file)
  }

  const handleAvatarUploadClick = () => {
    avatarInputRef.current?.click()
  }

  const handleLogoUploadClick = () => {
    logoInputRef.current?.click()
  }

  const handleEditAvatar = () => {
    setTempImageUrl(profileData.avatar)
    setShowAvatarEditor(true)
  }

  const handleEditLogo = () => {
    setTempImageUrl(profileData.companyLogo)
    setShowLogoEditor(true)
  }

  const handleAvatarSave = (editedImageUrl: string) => {
    setProfileData((prev) => ({
      ...prev,
      avatar: editedImageUrl,
    }))
    setShowAvatarEditor(false)
    setTempImageUrl(null)
  }

  const handleLogoSave = (editedImageUrl: string) => {
    setProfileData((prev) => ({
      ...prev,
      companyLogo: editedImageUrl,
    }))
    setShowLogoEditor(false)
    setTempImageUrl(null)
  }

  const handleEditorCancel = () => {
    setShowAvatarEditor(false)
    setShowLogoEditor(false)
    setTempImageUrl(null)
  }

  const handlePartnershipToggle = (partnership: string) => {
    setProfileData((prev) => ({
      ...prev,
      partnerships: prev.partnerships.includes(partnership)
        ? prev.partnerships.filter((p) => p !== partnership)
        : [...prev.partnerships, partnership],
    }))
  }

  const handleIndustryToggle = (industry: string) => {
    setProfileData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i) => i !== industry)
        : [...prev.industries, industry],
    }))
  }

  const handleThemeSelect = (themeId: string) => {
    if (unlockedThemes.includes(themeId)) {
      setSelectedTheme(themeId)
      setProfileData((prev) => ({
        ...prev,
        selectedTheme: themeId,
      }))
    }
  }

  const handleSave = () => {
    const updatedProfile = {
      ...profileData,
      yearsInBusiness: Number.parseInt(profileData.yearsInBusiness) || 0,
      selectedTheme: selectedTheme,
    }
    updateProfile(updatedProfile)
    setShowFirstTimePrompt(false) // Hide the prompt after saving
    alert("Profile saved successfully!")
  }

  const handleDismissPrompt = () => {
    setShowFirstTimePrompt(false)
  }

  // Get current theme data - use saved theme from profile data
  const currentTheme = profileCardThemes.find((theme) => theme.id === profileData.selectedTheme) || profileCardThemes[0]

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-bottom">
        <Navigation />

        <div className="pt-24 pb-24 px-4 min-h-screen">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Profile Preview</h1>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>

            {/* Theme border wrapper */}
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
              <Card className="overflow-hidden relative bg-white">
                <div className="relative">
                  {/* Main profile image - positioned to show top/face */}
                  <img
                    src={profileData.avatar || "/placeholder.svg?height=400&width=400"}
                    alt={profileData.name}
                    className="w-full h-48 object-cover object-top"
                  />

                  {/* Company logo overlay */}
                  {profileData.companyLogo && (
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full p-1 shadow-lg border-2 border-white">
                      <img
                        src={profileData.companyLogo || "/placeholder.svg"}
                        alt={`${profileData.businessName} logo`}
                        className="w-full h-full object-cover object-center rounded-full"
                      />
                    </div>
                  )}

                  {/* Premium badge overlay */}
                  {user.accountType === "premium" && (
                    <div className="absolute top-4 left-4 bg-yellow-500 rounded-full p-2 shadow-lg">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Enhanced gradient overlay for better text visibility */}
                  <div className={`absolute inset-0 ${currentTheme.overlayOpacity}`} />

                  <div className={`absolute bottom-4 left-4 ${currentTheme.textColor}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow-lg">
                        {profileData.name}
                      </h2>
                      {user.accountType === "premium" && (
                        <Badge className="bg-yellow-500 text-yellow-900 text-xs">PREMIUM</Badge>
                      )}
                    </div>
                    <p className="text-lg opacity-95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-shadow-lg">
                      {profileData.businessName}
                    </p>
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

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">{profileData.title}</p>
                    <p className="text-sm text-gray-600">{profileData.location}</p>
                    <p className="text-sm text-gray-600">{profileData.yearsInBusiness} years in business</p>
                    <p className="text-sm text-gray-600 font-medium">Primary Industry: {profileData.primaryIndustry}</p>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{profileData.description}</p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Looking for:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.partnerships.map((partnership) => (
                          <Badge key={partnership} variant="secondary" className="bg-purple-100 text-purple-700">
                            {partnership}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Industries:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.industries.map((industry) => (
                          <Badge key={industry} variant="outline" className="border-blue-200 text-blue-700">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      <Navigation />

      {/* Image Editors */}
      {showAvatarEditor && tempImageUrl && (
        <ImageEditor
          imageUrl={tempImageUrl}
          onSave={handleAvatarSave}
          onCancel={handleEditorCancel}
          aspectRatio={4 / 3} // 4:3 aspect ratio for profile pictures
          title="Profile Picture"
        />
      )}

      {showLogoEditor && tempImageUrl && (
        <ImageEditor
          imageUrl={tempImageUrl}
          onSave={handleLogoSave}
          onCancel={handleEditorCancel}
          aspectRatio={1} // 1:1 aspect ratio for logos (square)
          title="Company Logo"
        />
      )}

      <div className="pt-24 pb-24 px-4 min-h-screen">
        <div className="max-w-md mx-auto">
          {/* First-time setup prompt */}
          {showFirstTimePrompt && (
            <Alert className="mb-6 border-purple-200 bg-purple-50">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Welcome to Alliyn!</strong> Complete your profile to start connecting with business
                    partners.
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismissPrompt}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your business profile</p>
            </div>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="text-center">
                <Label className="text-base font-medium mb-3 block">Profile Picture</Label>
                <div className="relative">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} className="object-cover object-top" />
                    <AvatarFallback>
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "avatar")}
                  className="hidden"
                />

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleAvatarUploadClick} disabled={isUploadingAvatar}>
                    {isUploadingAvatar ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        Upload New
                      </>
                    )}
                  </Button>

                  {profileData.avatar !== "/placeholder.svg?height=400&width=400" && (
                    <Button variant="outline" size="sm" onClick={handleEditAvatar}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">This will be your main profile image</p>
              </div>

              {/* Company Logo Upload */}
              <div className="text-center">
                <Label className="text-base font-medium mb-3 block">Company Logo</Label>
                <div className="relative">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full p-2 border-2 border-gray-200">
                    <img
                      src={profileData.companyLogo || "/placeholder.svg"}
                      alt="Company Logo"
                      className="w-full h-full object-cover object-center rounded-full"
                    />
                  </div>
                  {isUploadingLogo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  className="hidden"
                />

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleLogoUploadClick} disabled={isUploadingLogo}>
                    {isUploadingLogo ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Building className="w-4 h-4 mr-2" />
                        Upload New
                      </>
                    )}
                  </Button>

                  {profileData.companyLogo !== "/placeholder.svg?height=100&width=100" && (
                    <Button variant="outline" size="sm" onClick={handleEditLogo}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">Appears as small circle on your profile</p>
              </div>
            </CardContent>
          </Card>

          {/* Unique Gifts Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Unique Gifts - Profile Card Themes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Unlock new profile card themes when someone gifts them to you. Change your profile appearance with these
                exclusive backgrounds.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {profileCardThemes.map((theme) => {
                  const isUnlocked = unlockedThemes.includes(theme.id)
                  const isSelected = selectedTheme === theme.id

                  return (
                    <div
                      key={theme.id}
                      className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-purple-500 bg-purple-50"
                          : isUnlocked
                            ? "border-gray-200 hover:border-gray-300"
                            : "border-gray-100 bg-gray-50"
                      }`}
                      onClick={() => handleThemeSelect(theme.id)}
                    >
                      {/* Theme preview */}
                      <div className="relative w-full h-20 rounded-md overflow-hidden mb-2">
                        {theme.image ? (
                          <div
                            className="w-full h-full bg-cover bg-center opacity-60"
                            style={{ backgroundImage: `url(${theme.image})` }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                        )}

                        {/* Sample text overlay */}
                        <div className={`absolute inset-0 ${theme.overlayOpacity}`} />
                        <div
                          className={`absolute bottom-1 left-2 ${theme.textColor} text-xs font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}
                        >
                          Sample Text
                        </div>

                        {/* Lock/Check overlay */}
                        <div className="absolute top-1 right-1">
                          {isSelected ? (
                            <div className="bg-purple-500 rounded-full p-1">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : !isUnlocked ? (
                            <div className="bg-gray-500 rounded-full p-1">
                              <Lock className="w-3 h-3 text-white" />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-center">
                        <h4 className={`text-sm font-medium ${isUnlocked ? "text-gray-900" : "text-gray-400"}`}>
                          {theme.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {isUnlocked ? (isSelected ? "Active" : "Available") : "Locked"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>How to unlock:</strong> Ask your matches to gift you profile card themes from the shop!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={profileData.businessName}
                  onChange={(e) => setProfileData({ ...profileData, businessName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Years in Business</Label>
                  <Input
                    id="years"
                    type="number"
                    min="0"
                    max="100"
                    value={profileData.yearsInBusiness}
                    onChange={(e) => setProfileData({ ...profileData, yearsInBusiness: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="primaryIndustry">Primary Industry</Label>
                <Select
                  value={profileData.primaryIndustry}
                  onValueChange={(value) => setProfileData({ ...profileData, primaryIndustry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Business Description</Label>
                <Textarea
                  id="description"
                  value={profileData.description}
                  onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your business, what you do, and what makes you unique..."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Partnership Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Types of Partnerships</Label>
                <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {partnershipTypes.map((partnership) => (
                    <Badge
                      key={partnership}
                      variant={profileData.partnerships.includes(partnership) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handlePartnershipToggle(partnership)}
                    >
                      {partnership}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Industries of Interest</Label>
                <p className="text-sm text-gray-500 mb-3">Select industries you want to connect with</p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {industries.map((industry) => (
                    <Badge
                      key={industry}
                      variant={profileData.industries.includes(industry) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => handleIndustryToggle(industry)}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Account Status</h4>
                  <p className="text-sm text-gray-500">
                    {user.profile?.isActive
                      ? "Your profile is active and visible to other users"
                      : "Your profile is disabled and hidden from other users"}
                  </p>
                </div>
                <Button
                  variant={user.profile?.isActive ? "destructive" : "default"}
                  onClick={toggleAccountStatus}
                  className="flex items-center gap-2"
                >
                  <Power className="w-4 h-4" />
                  {user.profile?.isActive ? "Disable Account" : "Enable Account"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full mt-6">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

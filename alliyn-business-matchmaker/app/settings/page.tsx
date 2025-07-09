"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Settings,
  Crown,
  MapPin,
  Bell,
  CreditCard,
  Plus,
  Download,
  Upload,
  Heart,
  LogOut,
  MessageCircle,
  User,
  Coins,
} from "lucide-react"
import Navigation from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import { useAuth } from "@/contexts/auth-context"
import { useTransactions } from "@/contexts/transactions-context"

export default function SettingsPage() {
  const { user, upgradeToPremium } = useUser()
  const { signOut } = useAuth()
  const { coinBalance, transactions, addTransaction } = useTransactions()

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
  })

  const [searchRadius, setSearchRadius] = useState([50])

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    description: "",
    email: user.profile?.email || "",
  })

  // Helper functions for coin/dollar conversion
  const coinsToDollars = (coins: number) => (coins / 10).toFixed(2)
  const dollarToCoins = (dollars: number) => Math.round(dollars * 10)

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleDeposit = () => {
    const amount = Number.parseFloat(depositAmount)
    if (amount > 0) {
      const coins = dollarToCoins(amount)
      addTransaction({
        type: "deposit",
        description: `Deposited $${amount.toFixed(2)}`,
        amount: coins,
        timestamp: new Date().toISOString(),
      })
      setDepositAmount("")
      setShowDepositModal(false)
    }
  }

  const handleWithdraw = () => {
    const amount = Number.parseFloat(withdrawAmount)
    if (amount > 0) {
      const coins = dollarToCoins(amount)
      if (coins <= coinBalance) {
        addTransaction({
          type: "withdrawal",
          description: `Withdrew $${amount.toFixed(2)}`,
          amount: -coins,
          timestamp: new Date().toISOString(),
        })
        setWithdrawAmount("")
        setShowWithdrawModal(false)
      } else {
        alert("Insufficient balance")
      }
    }
  }

  const handleUpgrade = () => {
    addTransaction({
      type: "subscription",
      description: "Premium subscription upgrade",
      amount: -500, // $50 = 500 coins
      timestamp: new Date().toISOString(),
    })
    upgradeToPremium()
  }

  const handleSignOut = () => {
    signOut()
  }

  const handleContactSubmit = () => {
    if (contactForm.subject && contactForm.description) {
      // Here you would typically send the contact form to your backend
      alert("Thank you for your message! We'll get back to you soon.")
      setContactForm({
        subject: "",
        description: "",
        email: user.profile?.email || "",
      })
      setShowContactModal(false)
    } else {
      alert("Please fill in all required fields.")
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // Get recent transactions (last 10)
  const recentTransactions = transactions.slice(-10).reverse()

  // Generate a user ID based on user data (in a real app, this would come from your backend)
  const userId = `ALY-${user.profile?.name?.replace(/\s+/g, "").toUpperCase().slice(0, 3) || "USR"}-${Date.now().toString().slice(-6)}`

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      <Navigation />

      <div className="pt-24 pb-24 px-4 min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          {/* Profile Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user.profile?.avatar || "/placeholder.svg"} className="object-cover object-top" />
                  <AvatarFallback>
                    {user.profile?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{user.profile?.name}</h3>
                    {user.accountType === "premium" && (
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Crown className="w-3 h-3 mr-1" />
                        PREMIUM
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.profile?.title}</p>
                  <p className="text-sm text-gray-500">{user.profile?.businessName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{user.totalMatches}</div>
                  <div className="text-sm text-red-500">Total Matches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium Upgrade */}
          {user.accountType === "free" && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Unlimited daily swipes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Unlimited daily matches</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Priority profile visibility</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Advanced matching filters</span>
                  </div>
                </div>
                <Button onClick={handleUpgrade} className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade for $50/month
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Location Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input id="location" value={user.profile?.location || ""} placeholder="Enter your location" readOnly />
              </div>
              <div className="space-y-3">
                <Label htmlFor="radius">Search Radius</Label>
                <div className="space-y-2">
                  <Slider
                    id="radius"
                    min={1}
                    max={100}
                    step={1}
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 mile</span>
                    <span className="font-medium text-gray-900">{searchRadius[0]} miles</span>
                    <span>100 miles</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Balance Display */}
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{coinBalance}</span>
                  <span className="text-sm text-blue-500">coins</span>
                </div>
                <div className="text-sm text-blue-600">≈ ${coinsToDollars(coinBalance)} USD</div>
              </div>

              {/* Wallet Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Plus className="w-4 h-4" />
                      Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Deposit Funds</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deposit-amount">Amount (USD)</Label>
                        <Input
                          id="deposit-amount"
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                        {depositAmount && (
                          <p className="text-sm text-gray-500 mt-1">
                            = {dollarToCoins(Number.parseFloat(depositAmount) || 0)} coins
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleDeposit} className="flex-1">
                          <Upload className="w-4 h-4 mr-2" />
                          Deposit
                        </Button>
                        <Button variant="outline" onClick={() => setShowDepositModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw Funds</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                        />
                        {withdrawAmount && (
                          <p className="text-sm text-gray-500 mt-1">
                            = {dollarToCoins(Number.parseFloat(withdrawAmount) || 0)} coins
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleWithdraw} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Withdraw
                        </Button>
                        <Button variant="outline" onClick={() => setShowWithdrawModal(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                    <CreditCard className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Card
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddCardModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Recent Transactions */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Transactions</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-xs text-gray-500">{formatTimeAgo(transaction.timestamp)}</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}
                            {transaction.amount} coins
                          </div>
                          <div className="text-xs text-gray-500">${coinsToDollars(Math.abs(transaction.amount))}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">No transactions yet</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Matches</div>
                  <div className="text-sm text-gray-500">Get notified when you have new matches</div>
                </div>
                <Switch checked={notifications.matches} onCheckedChange={() => handleNotificationChange("matches")} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Messages</div>
                  <div className="text-sm text-gray-500">Get notified about new messages</div>
                </div>
                <Switch checked={notifications.messages} onCheckedChange={() => handleNotificationChange("messages")} />
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>User ID</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{userId}</span>
                </div>
              </div>

              <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full flex items-center gap-2 bg-transparent">
                    <MessageCircle className="w-4 h-4" />
                    Contact Us
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input
                        id="contact-subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-description">Description *</Label>
                      <Textarea
                        id="contact-description"
                        value={contactForm.description}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Please describe your issue in detail..."
                        rows={4}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Your User ID ({userId}) will be automatically included with your message.
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleContactSubmit} className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" onClick={() => setShowContactModal(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

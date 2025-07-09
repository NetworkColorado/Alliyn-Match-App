"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, Coffee, Wine, UtensilsCrossed, Heart, DollarSign, Gift, Clock, ChevronDown } from "lucide-react"
import Navigation from "@/components/navigation"
import { useMatching } from "@/contexts/matching-context"
import { useMessaging } from "@/contexts/messaging-context"
import { useTransactions } from "@/contexts/transactions-context"
import { useRouter } from "next/navigation"

// Coin Icon Component
const CoinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <img src="/icons/coin.png" alt="Coin" className={className} />
)

// Shop products
const shopProducts = [
  {
    id: "coffee",
    name: "Coffee",
    coins: 104,
    icon: Coffee,
    image: "/shop/coffee.png",
    description: "A warm cup of coffee",
  },
  {
    id: "cocktail",
    name: "Cocktail",
    coins: 150,
    icon: Wine,
    image: "/shop/cocktail.png",
    description: "A refreshing cocktail",
  },
  {
    id: "lunch",
    name: "Lunch",
    coins: 325,
    icon: UtensilsCrossed,
    image: "/shop/lunch.png",
    description: "A delicious lunch",
  },
  {
    id: "dinner",
    name: "Dinner for Two",
    coins: 520,
    icon: Heart,
    image: "/shop/dinner.png",
    description: "Romantic dinner for two",
  },
  {
    id: "money-bag",
    name: "Money Bag",
    coins: 0, // Custom amount
    icon: DollarSign,
    image: "/shop/money-bag.png",
    description: "Custom amount of coins",
    isCustom: true,
  },
]

// Profile card backgrounds
const profileCards = [
  {
    id: "city",
    name: "City Profile Card Background",
    coins: 100,
    image: "/shop/city-background.png",
    description: "Urban city skyline background",
  },
  {
    id: "flower",
    name: "Flower Profile Card",
    coins: 100,
    image: "/shop/flower-background.png",
    description: "Beautiful flower pattern background",
  },
  {
    id: "red-carpet",
    name: "Red Carpet Profile Card",
    coins: 100,
    image: "/shop/red-carpet-background.png",
    description: "Elegant red carpet background",
  },
  {
    id: "luxury-home",
    name: "Luxury Home Profile Card Background",
    coins: 100,
    image: "/shop/luxury-home-background.png",
    description: "Luxurious home interior background",
  },
]

// Mock gifts data - showing received amounts (after 30% deduction for gifts)
const mockGifts = [
  {
    id: "1",
    from: {
      id: "user-2",
      name: "Melissa Rodriguez",
      avatar: "/profiles/melissa-marketing.webp",
    },
    gift: "Coffee",
    giftIcon: Coffee,
    coins: Math.floor(104 * 0.7), // 72 coins (30% deducted)
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isNew: true,
  },
  {
    id: "2",
    from: {
      id: "user-3",
      name: "Robert Harrison",
      avatar: "/profiles/robert-executive.jpeg",
    },
    gift: "Cocktail",
    giftIcon: Wine,
    coins: Math.floor(150 * 0.7), // 105 coins (30% deducted)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isNew: true,
  },
  {
    id: "3",
    from: {
      id: "user-4",
      name: "Samantha Williams",
      avatar: "/profiles/samantha-consulting.jpeg",
    },
    gift: "Lunch",
    giftIcon: UtensilsCrossed,
    coins: Math.floor(325 * 0.7), // 227 coins (30% deducted)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isNew: false,
  },
  {
    id: "4",
    from: {
      id: "user-5",
      name: "David Chen",
      avatar: "/profiles/david-entrepreneur.jpeg",
    },
    gift: "Dinner for Two",
    giftIcon: Heart,
    coins: Math.floor(520 * 0.7), // 364 coins (30% deducted)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isNew: false,
  },
  {
    id: "5",
    from: {
      id: "user-6",
      name: "Emma Thompson",
      avatar: "/profiles/emma-creative.jpeg",
    },
    gift: "Money Bag",
    giftIcon: DollarSign,
    coins: Math.floor(250 * 0.7), // 175 coins (30% deducted)
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    isNew: false,
  },
]

export default function ShopPage() {
  const router = useRouter()
  const { matches } = useMatching()
  const safeMatches = matches ?? [] // Prevent undefined errors
  const { createConversation } = useMessaging()
  const { addTransaction } = useTransactions()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [gifts, setGifts] = useState(mockGifts)
  const [showAllGifts, setShowAllGifts] = useState(false)
  const [showGiftNotification, setShowGiftNotification] = useState(false)
  const [giftDropdownLimit, setGiftDropdownLimit] = useState(5)

  // Check for new gifts on page load
  useEffect(() => {
    const hasNewGifts = gifts.some((gift) => gift.isNew)
    if (hasNewGifts) {
      setShowGiftNotification(true)
    }
  }, [])

  const handlePurchase = (product: any) => {
    setSelectedProduct(product)
    setPurchaseOpen(true)
  }

  const handleSendGift = () => {
    if (selectedRecipient && selectedProduct) {
      const recipient = safeMatches.find((match) => match.id.toString() === selectedRecipient)
      if (recipient) {
        let coinAmount = selectedProduct.coins
        let dollarAmount = coinAmount / 10

        // Handle custom amount for money bag
        if (selectedProduct.isCustom && customAmount) {
          coinAmount = Number.parseInt(customAmount)
          dollarAmount = coinAmount / 10
        }

        // Determine transaction type and recipient amount
        let transactionType: "gift_sent" | "profile_card" = "gift_sent"
        let recipientCoins = coinAmount

        // Check if it's a profile card (100% commission)
        const isProfileCard = profileCards.some((card) => card.id === selectedProduct.id)
        if (isProfileCard) {
          transactionType = "profile_card"
          recipientCoins = 0 // Recipient gets nothing for profile cards
        } else {
          // For gifts, recipient gets 70% (30% commission)
          recipientCoins = Math.floor(coinAmount * 0.7)
        }

        // Add transaction for sender (spending coins)
        addTransaction({
          type: transactionType,
          description: `Gift Sent - ${selectedProduct.name} to ${recipient.profile.name}`,
          amount: -coinAmount,
          dollarAmount: -dollarAmount,
          isPositive: false,
        })

        // Simulate recipient receiving coins (if not profile card)
        if (!isProfileCard) {
          // This would normally be handled by the recipient's app instance
          // For demo purposes, we're just showing what would happen
          console.log(`${recipient.profile.name} would receive ${recipientCoins} coins`)
        }

        alert(`Gift sent to ${recipient.profile.name}!`)
        setPurchaseOpen(false)
        setSelectedProduct(null)
        setSelectedRecipient("")
        setCustomAmount("")
      }
    }
  }

  const handleThankYou = (gift: any) => {
    // Create conversation and redirect to messages
    const conversationId = createConversation(gift.from)
    router.push("/messages")
  }

  const markGiftsAsRead = () => {
    setGifts((prev) => prev.map((gift) => ({ ...gift, isNew: false })))
    setShowGiftNotification(false)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getSelectedMatchDisplay = () => {
    if (!selectedRecipient) return "Select a match"
    const match = safeMatches.find((m) => m.id.toString() === selectedRecipient)
    return match ? `${match.profile.name} - ${match.profile.businessName}` : "Select a match"
  }

  const newGifts = gifts.filter((gift) => gift.isNew)
  const displayedGifts = showAllGifts ? gifts.slice(0, 50) : gifts.slice(0, giftDropdownLimit)

  return (
    <div className="min-h-screen bg-gray-50 safe-area-bottom">
      <Navigation />

      {/* Gift Notification Modal */}
      <Dialog open={showGiftNotification} onOpenChange={setShowGiftNotification}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-500" />
              New Gifts Received!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {newGifts.map((gift) => {
              const GiftIcon = gift.giftIcon
              return (
                <div key={gift.id} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={gift.from.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{gift?.from?.name?.charAt(0) ?? "?"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{gift.from.name}</p>
                    <div className="flex items-center gap-2">
                      <GiftIcon className="w-4 h-4 text-purple-500" />
                      <p className="text-sm text-gray-600">Sent you {gift.gift}</p>
                    </div>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CoinIcon className="w-4 h-4" />+{gift.coins} coins earned
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleThankYou(gift)} className="bg-purple-600 hover:bg-purple-700">
                    Thank You
                  </Button>
                </div>
              )
            })}
            <Button onClick={markGiftsAsRead} className="w-full bg-transparent" variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="pt-24 pb-24 px-4 min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Alliyn Shop</h1>
            <p className="text-gray-600">Here you can gift your matches, and these gifts will be sent to them</p>
            <p className="text-sm text-gray-500 mt-1">Each amount is worth a dollar amount</p>
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="profile-cards" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Profile Cards
              </TabsTrigger>
              <TabsTrigger value="gifts" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Your Gifts
                {newGifts.length > 0 && <Badge className="bg-red-500 text-white text-xs ml-1">{newGifts.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Here you will see the gifts you can buy with the amount of coins it costs
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {shopProducts.map((product) => {
                  const Icon = product.icon
                  return (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="mb-3">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 mx-auto rounded-lg object-cover"
                          />
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                        <p className="text-xs text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center justify-center gap-1 mb-3">
                          <CoinIcon className="w-5 h-5" />
                          <span className="font-bold text-yellow-600">
                            {product.isCustom ? "Custom" : product.coins}
                          </span>
                        </div>
                        <Button size="sm" className="w-full" onClick={() => handlePurchase(product)}>
                          Purchase
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="profile-cards" className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  Once gifted, it will unlock a different profile card background that the user can switch to
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {profileCards.map((card) => (
                  <Card key={card.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        <img
                          src={card.image || "/placeholder.svg"}
                          alt={card.name}
                          className="w-16 h-16 mx-auto rounded-lg object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{card.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{card.description}</p>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <CoinIcon className="w-5 h-5" />
                        <span className="font-bold text-yellow-600">{card.coins}</span>
                      </div>
                      <Button size="sm" className="w-full" onClick={() => handlePurchase(card)}>
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gifts" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Gifts</h2>
                <Select
                  value={giftDropdownLimit.toString()}
                  onValueChange={(value) => setGiftDropdownLimit(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                In this section, you can see your gifts with the newest gifts showing up first
              </p>

              <div className="space-y-3">
                {displayedGifts.map((gift) => {
                  const GiftIcon = gift.giftIcon
                  return (
                    <Card key={gift.id} className={gift.isNew ? "ring-2 ring-purple-500" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={gift.from.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{gift?.from?.name?.charAt(0) ?? "?"}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{gift.from.name}</h3>
                              {gift.isNew && <Badge className="bg-red-500 text-white text-xs">New</Badge>}
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <GiftIcon className="w-4 h-4 text-purple-500" />
                              <p className="text-sm text-gray-600">{gift.gift}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-xs text-gray-500">{formatTimeAgo(gift.timestamp)}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-2">
                              <CoinIcon className="w-4 h-4" />
                              <span className="font-bold text-green-600">+{gift.coins}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => handleThankYou(gift)}>
                              Thank You
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {gifts.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No gifts yet</h3>
                      <p className="text-gray-500">Gifts from your matches will appear here</p>
                    </CardContent>
                  </Card>
                )}

                {gifts.length > giftDropdownLimit && !showAllGifts && (
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAllGifts(true)}>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    View All Gifts
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Purchase Modal */}
          <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Send Gift: {selectedProduct?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedProduct?.isCustom && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Custom Amount (coins)</label>
                    <Input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Send to:</label>
                  {safeMatches.length === 0 ? (
                    <div className="p-3 text-center text-gray-500 border rounded-lg">
                      No matches available. Make some matches first!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a match" />
                        </SelectTrigger>
                        <SelectContent>
                          {safeMatches.map((match) => (
                            <SelectItem key={match.id} value={match.id.toString()}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage
                                    src={match.profile.image || "/placeholder.svg"}
                                    alt={match.profile.name}
                                    className="object-cover object-top"
                                  />
                                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                                    {match.profile.name?.charAt(0) ?? "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span>
                                  {match.profile.name} - {match.profile.businessName}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Show selected match details */}
                      {selectedRecipient &&
                        (() => {
                          const selectedMatch = safeMatches.find((m) => m.id.toString() === selectedRecipient)
                          return selectedMatch ? (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={selectedMatch.profile.image || "/placeholder.svg"}
                                  alt={selectedMatch.profile.name}
                                  className="object-cover object-top"
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                  {selectedMatch.profile.name?.charAt(0) ?? "?"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{selectedMatch.profile.name}</p>
                                <p className="text-xs text-gray-500">{selectedMatch.profile.businessName}</p>
                                <p className="text-xs text-gray-400">
                                  {selectedMatch.profile.industries?.[0] || "Business Professional"}
                                </p>
                              </div>
                            </div>
                          ) : null
                        })()}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span>Total Cost:</span>
                  <div className="flex items-center gap-1">
                    <CoinIcon className="w-5 h-5" />
                    <span className="font-bold text-yellow-600">
                      {selectedProduct?.isCustom ? customAmount || "0" : selectedProduct?.coins || "0"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSendGift}
                    className="flex-1"
                    disabled={!selectedRecipient || (selectedProduct?.isCustom && !customAmount)}
                  >
                    Send Gift
                  </Button>
                  <Button variant="outline" onClick={() => setPurchaseOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Send, Camera, Users, Eye, ThumbsUp, CornerDownRight, X } from "lucide-react"
import Navigation from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import { useMatching } from "@/contexts/matching-context"
import ProfileCard from "@/components/profile-card"

// Mock community posts data tied to specific user profiles
const mockCommunityPosts = [
  // Melissa Rodriguez - Marketing
  {
    id: 1,
    userId: 1,
    author: "Melissa Rodriguez",
    authorTitle: "Founder & Creative Director",
    authorCompany: "Strategic Marketing Solutions",
    authorAvatar: "/profiles/melissa-marketing.webp",
    content:
      "Just wrapped up an incredible brand transformation project for a local tech startup. The power of authentic storytelling in B2B marketing never ceases to amaze me. When you align your brand message with your audience's pain points, magic happens. 🚀\n\nKey takeaway: Your brand isn't what you say it is—it's what your customers experience it to be.",
    image: "/placeholder.svg?height=300&width=500&text=Brand+Strategy+Workshop",
    timestamp: "2 hours ago",
    likes: 47,
    comments: 12,
    shares: 8,
    views: 234,
    tags: ["#BrandStrategy", "#Marketing", "#Startups"],
  },
  {
    id: 2,
    userId: 1,
    author: "Melissa Rodriguez",
    authorTitle: "Founder & Creative Director",
    authorCompany: "Strategic Marketing Solutions",
    authorAvatar: "/profiles/melissa-marketing.webp",
    content:
      "Hosting a free webinar next week: 'Digital Marketing Trends That Actually Matter in 2024'. We'll dive deep into AI-powered personalization, authentic content creation, and the death of traditional advertising. Who's interested? 🎯",
    timestamp: "1 day ago",
    likes: 89,
    comments: 23,
    shares: 15,
    views: 456,
    tags: ["#DigitalMarketing", "#Webinar", "#AI"],
  },

  // Robert Harrison - Finance
  {
    id: 3,
    userId: 2,
    author: "Robert Harrison",
    authorTitle: "Managing Partner",
    authorCompany: "Harrison Capital Group",
    authorAvatar: "/profiles/robert-executive.jpeg",
    content:
      "Market volatility creates opportunity. While others panic, smart investors position themselves for the next growth cycle. We're seeing incredible value in mid-market companies with strong fundamentals and adaptable business models.\n\nRemember: The best time to plant a tree was 20 years ago. The second best time is now. 🌳",
    timestamp: "4 hours ago",
    likes: 156,
    comments: 34,
    shares: 28,
    views: 892,
    tags: ["#Investment", "#MarketAnalysis", "#Growth"],
  },
  {
    id: 4,
    userId: 2,
    author: "Robert Harrison",
    authorTitle: "Managing Partner",
    authorCompany: "Harrison Capital Group",
    authorAvatar: "/profiles/robert-executive.jpeg",
    content:
      "Proud to announce our latest portfolio company just closed a $50M Series B! This manufacturing tech company is revolutionizing supply chain efficiency. Sometimes the most boring industries hide the most exciting opportunities. 📈",
    image: "/placeholder.svg?height=300&width=500&text=Investment+Announcement",
    timestamp: "3 days ago",
    likes: 203,
    comments: 45,
    shares: 67,
    views: 1234,
    tags: ["#PrivateEquity", "#Manufacturing", "#SeriesB"],
  },

  // David Chen - Tech/VC
  {
    id: 5,
    userId: 3,
    author: "David Chen",
    authorTitle: "CEO & Co-Founder",
    authorCompany: "NextGen Ventures",
    authorAvatar: "/profiles/david-entrepreneur.jpeg",
    content:
      "AI isn't replacing entrepreneurs—it's amplifying the best ones. Just met with a founder who's using machine learning to solve a 50-year-old logistics problem. The solution is elegant, scalable, and addresses a $10B market. This is why I love early-stage investing. 🤖",
    timestamp: "6 hours ago",
    likes: 78,
    comments: 19,
    shares: 12,
    views: 345,
    tags: ["#AI", "#VentureCapital", "#Innovation"],
  },
  {
    id: 6,
    userId: 3,
    author: "David Chen",
    authorTitle: "CEO & Co-Founder",
    authorCompany: "NextGen Ventures",
    authorAvatar: "/profiles/david-entrepreneur.jpeg",
    content:
      "Startup advice: Your first product will be wrong. Your second will be less wrong. Your third might actually solve the problem. The key is failing fast, learning faster, and iterating with purpose. Embrace the pivot—it's not failure, it's evolution. 🔄",
    timestamp: "2 days ago",
    likes: 124,
    comments: 28,
    shares: 19,
    views: 567,
    tags: ["#StartupAdvice", "#ProductDevelopment", "#Entrepreneurship"],
  },

  // Samantha Williams - Consulting
  {
    id: 7,
    userId: 4,
    author: "Samantha Williams",
    authorTitle: "Principal Consultant",
    authorCompany: "Executive Leadership Consulting",
    authorAvatar: "/profiles/samantha-consulting.jpeg",
    content:
      "Leadership isn't about having all the answers—it's about asking the right questions. In today's session with a Fortune 500 CEO, we discovered that their biggest challenge wasn't strategy or execution, but communication alignment across departments. Sometimes the solution is simpler than we think. 💡",
    timestamp: "1 hour ago",
    likes: 92,
    comments: 16,
    shares: 11,
    views: 278,
    tags: ["#Leadership", "#Communication", "#ExecutiveCoaching"],
  },
  {
    id: 8,
    userId: 4,
    author: "Samantha Williams",
    authorTitle: "Principal Consultant",
    authorCompany: "Executive Leadership Consulting",
    authorAvatar: "/profiles/samantha-consulting.jpeg",
    content:
      "The future of work isn't remote vs. in-person—it's about intentional collaboration. Companies that master hybrid work environments will have a massive competitive advantage. It's not about where you work, but how effectively you work together. 🏢🏠",
    image: "/placeholder.svg?height=300&width=500&text=Future+of+Work+Strategy",
    timestamp: "5 days ago",
    likes: 167,
    comments: 42,
    shares: 31,
    views: 789,
    tags: ["#FutureOfWork", "#HybridWork", "#Leadership"],
  },

  // Emma Thompson - Creative
  {
    id: 9,
    userId: 5,
    author: "Emma Thompson",
    authorTitle: "Creative Director & Owner",
    authorCompany: "Creative Collective Studios",
    authorAvatar: "/profiles/emma-creative.jpeg",
    content:
      "Design isn't just about making things look pretty—it's about solving problems beautifully. Today's brand identity project for a sustainable fashion startup perfectly captures their mission: bold, conscious, and unapologetically authentic. When design meets purpose, brands become movements. ✨",
    image: "/placeholder.svg?height=300&width=500&text=Sustainable+Fashion+Brand",
    timestamp: "3 hours ago",
    likes: 134,
    comments: 27,
    shares: 18,
    views: 445,
    tags: ["#Design", "#Branding", "#Sustainability"],
  },
  {
    id: 10,
    userId: 5,
    author: "Emma Thompson",
    authorTitle: "Creative Director & Owner",
    authorCompany: "Creative Collective Studios",
    authorAvatar: "/profiles/emma-creative.jpeg",
    content:
      "Creative block is real, but it's not permanent. My go-to strategies: 1) Change your environment 2) Consume different content 3) Collaborate with someone outside your field 4) Take a walk without your phone. Sometimes the best ideas come when you stop trying so hard. 🎨",
    timestamp: "1 week ago",
    likes: 89,
    comments: 21,
    shares: 14,
    views: 356,
    tags: ["#Creativity", "#Design", "#Productivity"],
  },

  // Lisa Park - Tech
  {
    id: 11,
    userId: 6,
    author: "Lisa Park",
    authorTitle: "Founder & CTO",
    authorCompany: "TechForward Solutions",
    authorAvatar: "/profiles/lisa-tech.jpeg",
    content:
      "Cloud migration isn't just a tech upgrade—it's a business transformation. Just helped a 200-person company reduce their infrastructure costs by 40% while improving performance and security. The key? Starting with business objectives, not technical specifications. 🚀",
    timestamp: "8 hours ago",
    likes: 76,
    comments: 15,
    shares: 9,
    views: 298,
    tags: ["#CloudMigration", "#DigitalTransformation", "#CostOptimization"],
  },
  {
    id: 12,
    userId: 6,
    author: "Lisa Park",
    authorTitle: "Founder & CTO",
    authorCompany: "TechForward Solutions",
    authorAvatar: "/profiles/lisa-tech.jpeg",
    content:
      "AI integration success story: Our client's customer service team now handles 3x more inquiries with the same headcount. The secret? We didn't replace humans—we augmented them. AI handles routine queries, humans focus on complex problem-solving. Win-win. 🤖🤝",
    image: "/placeholder.svg?height=300&width=500&text=AI+Customer+Service+Dashboard",
    timestamp: "4 days ago",
    likes: 198,
    comments: 38,
    shares: 29,
    views: 723,
    tags: ["#AI", "#CustomerService", "#Automation"],
  },

  // Angela Davis - Legal
  {
    id: 13,
    userId: 7,
    author: "Angela Davis",
    authorTitle: "Managing Partner",
    authorCompany: "Davis Legal Advisors",
    authorAvatar: "/profiles/angela-legal.jpeg",
    content:
      "M&A activity is heating up, but due diligence is more critical than ever. Seeing too many deals fall apart because buyers didn't properly assess cultural fit alongside financial metrics. Remember: You're not just acquiring assets, you're acquiring people and processes. 📊",
    timestamp: "5 hours ago",
    likes: 112,
    comments: 24,
    shares: 16,
    views: 387,
    tags: ["#MergersAndAcquisitions", "#DueDiligence", "#CorporateLaw"],
  },
  {
    id: 14,
    userId: 7,
    author: "Angela Davis",
    authorTitle: "Managing Partner",
    authorCompany: "Davis Legal Advisors",
    authorAvatar: "/profiles/angela-legal.jpeg",
    content:
      "Startup founders: Your operating agreement is not boilerplate. It's the constitution of your company. Spend time getting it right now, or spend 10x more fixing it later. The most expensive legal advice is the advice you don't get. ⚖️",
    timestamp: "6 days ago",
    likes: 145,
    comments: 31,
    shares: 22,
    views: 534,
    tags: ["#StartupLaw", "#OperatingAgreements", "#LegalAdvice"],
  },

  // Michael Johnson - Business Development
  {
    id: 15,
    userId: 8,
    author: "Michael Johnson",
    authorTitle: "Principal & Business Development Director",
    authorCompany: "Growth Partners International",
    authorAvatar: "/profiles/michael-business.jpeg",
    content:
      "International expansion isn't just about new markets—it's about new perspectives. Our client just entered the European market and discovered their product solves a completely different problem there. Sometimes the best growth comes from unexpected directions. 🌍",
    timestamp: "7 hours ago",
    likes: 83,
    comments: 18,
    shares: 12,
    views: 312,
    tags: ["#InternationalBusiness", "#MarketExpansion", "#Growth"],
  },
  {
    id: 16,
    userId: 8,
    author: "Michael Johnson",
    authorTitle: "Principal & Business Development Director",
    authorCompany: "Growth Partners International",
    authorAvatar: "/profiles/michael-business.jpeg",
    content:
      "Partnership strategy session today revealed a golden rule: The best partnerships aren't 50/50—they're 100/100. Each party brings their full commitment to shared success. When both sides are all-in, magic happens. 🤝",
    image: "/placeholder.svg?height=300&width=500&text=Partnership+Strategy+Framework",
    timestamp: "2 weeks ago",
    likes: 156,
    comments: 33,
    shares: 25,
    views: 678,
    tags: ["#Partnerships", "#BusinessStrategy", "#Collaboration"],
  },

  // James Mitchell - Startup Accelerator
  {
    id: 17,
    userId: 9,
    author: "James Mitchell",
    authorTitle: "Founder & Managing Director",
    authorCompany: "Startup Accelerator Labs",
    authorAvatar: "/profiles/james-startup.jpeg",
    content:
      "Demo Day was incredible! 12 startups, 12 unique solutions to real problems. From healthcare AI to sustainable packaging, this cohort proves that innovation happens when diverse minds tackle big challenges. The future is being built right here. 🚀",
    image: "/placeholder.svg?height=300&width=500&text=Demo+Day+2024",
    timestamp: "12 hours ago",
    likes: 234,
    comments: 56,
    shares: 43,
    views: 1123,
    tags: ["#DemoDay", "#Startups", "#Innovation"],
  },
  {
    id: 18,
    userId: 9,
    author: "James Mitchell",
    authorTitle: "Founder & Managing Director",
    authorCompany: "Startup Accelerator Labs",
    authorAvatar: "/profiles/james-startup.jpeg",
    content:
      "Mentor Monday wisdom: 'Build something people want' sounds simple, but most founders build what they think people want. The difference? Talking to customers before writing code. Validation beats assumption every time. 💡",
    timestamp: "3 days ago",
    likes: 167,
    comments: 41,
    shares: 28,
    views: 589,
    tags: ["#StartupAdvice", "#CustomerValidation", "#Mentorship"],
  },

  // Sophia Kim - Financial Strategy
  {
    id: 19,
    userId: 10,
    author: "Sophia Kim",
    authorTitle: "Senior Partner & CFO",
    authorCompany: "Financial Strategy Group",
    authorAvatar: "/profiles/sophia-finance.jpeg",
    content:
      "Cash flow is king, but cash flow forecasting is the kingdom. Just helped a growing SaaS company avoid a cash crunch by implementing proper 13-week rolling forecasts. Predictability beats profitability when you're scaling. 📈",
    timestamp: "9 hours ago",
    likes: 94,
    comments: 22,
    shares: 17,
    views: 367,
    tags: ["#CashFlow", "#FinancialPlanning", "#SaaS"],
  },
  {
    id: 20,
    userId: 10,
    author: "Sophia Kim",
    authorTitle: "Senior Partner & CFO",
    authorCompany: "Financial Strategy Group",
    authorAvatar: "/profiles/sophia-finance.jpeg",
    content:
      "Investment portfolio review season is here. Reminder: Diversification isn't just about different stocks—it's about different asset classes, geographies, and time horizons. Your future self will thank you for thinking long-term. 💰",
    image: "/placeholder.svg?height=300&width=500&text=Portfolio+Diversification+Chart",
    timestamp: "1 week ago",
    likes: 178,
    comments: 35,
    shares: 24,
    views: 645,
    tags: ["#InvestmentStrategy", "#PortfolioManagement", "#WealthBuilding"],
  },
]

export default function CommunityPage() {
  const { user } = useUser()
  const { matches } = useMatching()
  const [newPost, setNewPost] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for posts with comments
  const [posts, setPosts] = useState(() => {
    // Initialize posts with empty comment threads
    return mockCommunityPosts.map((post) => ({
      ...post,
      commentThread: [] as Array<{
        id: number
        userId: number
        author: string
        authorAvatar: string
        content: string
        timestamp: string
        likes: number
        replies: Array<{
          id: number
          userId: number
          author: string
          authorAvatar: string
          content: string
          timestamp: string
          likes: number
        }>
      }>,
    }))
  })

  // Get matched user IDs from the matches array
  const matchedUserIds = matches.map((match) => match.profile.id)

  // Filter posts to only show those from matched users
  const visiblePosts = posts.filter((post) => matchedUserIds.includes(post.userId))

  const [selectedProfile, setSelectedProfile] = useState<any>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePost = () => {
    if (newPost.trim() || selectedImage) {
      // Here you would typically send the post to your backend
      console.log("New post:", { content: newPost, image: selectedImage })
      setNewPost("")
      setSelectedImage(null)
    }
  }

  const handleLike = (postId: number) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleComment = (postId: number) => {
    // Handle comment functionality
    console.log("Comment on post:", postId)
  }

  const addComment = (postId: number, content: string) => {
    if (!content.trim()) return

    const newComment = {
      id: Date.now(),
      userId: Number.parseInt(user.id),
      author: user.profile?.name || "You",
      authorAvatar: user.profile?.avatar || "/placeholder-user.jpg",
      content,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentThread: [...post.commentThread, newComment],
              comments: post.comments + 1,
            }
          : post,
      ),
    )
  }

  const addReply = (postId: number, commentId: number, content: string) => {
    if (!content.trim()) return

    const newReply = {
      id: Date.now(),
      userId: Number.parseInt(user.id),
      author: user.profile?.name || "You",
      authorAvatar: user.profile?.avatar || "/placeholder-user.jpg",
      content,
      timestamp: "Just now",
      likes: 0,
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentThread: post.commentThread.map((comment) =>
                comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment,
              ),
            }
          : post,
      ),
    )
  }

  const handleProfileClick = (userId: number) => {
    // Find the profile from mockProfiles (you'll need to import this from the main page or create a shared profiles file)
    const mockProfiles = [
      {
        id: 1,
        name: "Melissa Rodriguez",
        businessName: "Strategic Marketing Solutions",
        title: "Founder & Creative Director",
        description:
          "Award-winning marketing agency specializing in brand development and digital campaigns for growing businesses.",
        yearsInBusiness: 7,
        partnerships: ["Co-Branding", "Referral Partner", "Event Collaborations"],
        industries: ["Marketing & Advertising", "Professional, Scientific & Technical Services", "Creative Services"],
        location: "Denver, CO",
        image: "/profiles/melissa-marketing.webp",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 2,
        name: "Robert Harrison",
        businessName: "Harrison Capital Group",
        title: "Managing Partner",
        description: "Private equity firm focused on mid-market acquisitions and growth capital investments.",
        yearsInBusiness: 15,
        partnerships: ["Strategic Alliances", "Joint Ventures", "Investment Partnerships"],
        industries: ["Finance & Insurance", "Professional, Scientific & Technical Services", "Investment Management"],
        location: "Chicago, IL",
        image: "/profiles/robert-executive.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 3,
        name: "David Chen",
        businessName: "NextGen Ventures",
        title: "CEO & Co-Founder",
        description: "Innovation-driven venture capital firm investing in early-stage technology companies.",
        yearsInBusiness: 4,
        partnerships: ["Investment Partnerships", "Strategic Alliances", "Mentorship Programs"],
        industries: [
          "Technology (IT) & Software",
          "Finance & Insurance",
          "Professional, Scientific & Technical Services",
        ],
        location: "San Francisco, CA",
        image: "/profiles/david-entrepreneur.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 4,
        name: "Samantha Williams",
        businessName: "Executive Leadership Consulting",
        title: "Principal Consultant",
        description:
          "Transformational leadership consulting firm helping C-suite executives and high-potential leaders maximize their impact.",
        yearsInBusiness: 9,
        partnerships: ["Strategic Alliances", "Referral Partner", "Training Partnerships"],
        industries: ["Professional, Scientific & Technical Services", "Management Consulting", "Executive Coaching"],
        location: "Atlanta, GA",
        image: "/profiles/samantha-consulting.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 5,
        name: "Emma Thompson",
        businessName: "Creative Collective Studios",
        title: "Creative Director & Owner",
        description: "Full-service creative agency specializing in brand identity, web design, and content creation.",
        yearsInBusiness: 6,
        partnerships: ["Co-Branding", "Event Collaborations", "Creative Partnerships"],
        industries: ["Creative Services", "Marketing & Advertising", "Technology (IT) & Software"],
        location: "Portland, OR",
        image: "/profiles/emma-creative.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 6,
        name: "Lisa Park",
        businessName: "TechForward Solutions",
        title: "Founder & CTO",
        description: "Enterprise software development company creating custom solutions for Fortune 500 companies.",
        yearsInBusiness: 8,
        partnerships: ["Technology Partnerships", "Strategic Alliances", "Integration Partners"],
        industries: [
          "Technology (IT) & Software",
          "Professional, Scientific & Technical Services",
          "Information Technology",
        ],
        location: "Seattle, WA",
        image: "/profiles/lisa-tech.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 7,
        name: "Angela Davis",
        businessName: "Davis Legal Advisors",
        title: "Managing Partner",
        description: "Boutique law firm specializing in corporate law, mergers & acquisitions, and business formation.",
        yearsInBusiness: 12,
        partnerships: ["Referral Partner", "Strategic Alliances", "Professional Networks"],
        industries: ["Legal Services", "Professional, Scientific & Technical Services", "Business Consulting"],
        location: "New York, NY",
        image: "/profiles/angela-legal.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 8,
        name: "Michael Johnson",
        businessName: "Growth Partners International",
        title: "Principal & Business Development Director",
        description: "Business development and expansion consulting firm helping companies scale operations.",
        yearsInBusiness: 11,
        partnerships: ["Strategic Alliances", "Joint Ventures", "Market Entry Partnerships"],
        industries: ["Professional, Scientific & Technical Services", "Business Consulting", "International Trade"],
        location: "Miami, FL",
        image: "/profiles/michael-business.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 9,
        name: "James Mitchell",
        businessName: "Startup Accelerator Labs",
        title: "Founder & Managing Director",
        description: "Early-stage startup accelerator and incubator providing funding, mentorship, and resources.",
        yearsInBusiness: 5,
        partnerships: ["Investment Partnerships", "Mentorship Programs", "Strategic Alliances"],
        industries: ["Technology (IT) & Software", "Professional, Scientific & Technical Services", "Venture Capital"],
        location: "Austin, TX",
        image: "/profiles/james-startup.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
      {
        id: 10,
        name: "Sophia Kim",
        businessName: "Financial Strategy Group",
        title: "Senior Partner & CFO",
        description:
          "Comprehensive financial advisory firm providing strategic planning, investment management, and corporate finance solutions.",
        yearsInBusiness: 10,
        partnerships: ["Investment Partnerships", "Strategic Alliances", "Referral Partner"],
        industries: ["Finance & Insurance", "Professional, Scientific & Technical Services", "Investment Management"],
        location: "Los Angeles, CA",
        image: "/profiles/sophia-finance.jpeg",
        companyLogo: "/placeholder.svg?height=100&width=100",
      },
    ]

    const profile = mockProfiles.find((p) => p.id === userId)
    if (profile) {
      setSelectedProfile(profile)
    }
  }

  const handleAddMatch = (profile: any) => {
    // Check if already matched
    const isAlreadyMatched = matchedUserIds.includes(profile.id)

    if (!isAlreadyMatched) {
      // Add to matching system (you'll need to import these from matching context)
      // addMatch(profile, { nickname: "New Connection", reasons: ["Connected via Community"] })

      // For now, just show success message
      alert(`Successfully matched with ${profile.name}!`)

      // Close modal
      setSelectedProfile(null)
    }
  }

  const CommentInput = ({
    placeholder,
    onSubmit,
  }: {
    placeholder: string
    onSubmit: (text: string) => void
  }) => {
    const [value, setValue] = useState("")

    return (
      <div className="flex items-start gap-2 mt-2">
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={user.profile?.avatar || "/placeholder-user.jpg"} />
          <AvatarFallback>{user.profile?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSubmit(value)
                setValue("")
              }
            }}
          />
          <Button
            size="sm"
            disabled={!value.trim()}
            onClick={() => {
              onSubmit(value)
              setValue("")
            }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  const CommentThread = ({
    postId,
    comment,
  }: {
    postId: number
    comment: any
  }) => {
    const [showReply, setShowReply] = useState(false)

    return (
      <div className="mt-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={comment.authorAvatar || "/placeholder.svg"} />
            <AvatarFallback>{comment.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{comment.author}</p>
              <p className="text-sm text-gray-800 mt-1">{comment.content}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
              <span>{comment.timestamp}</span>
              <button className="hover:underline" onClick={() => setShowReply(!showReply)}>
                Reply
              </button>
            </div>

            {showReply && (
              <CommentInput
                placeholder="Write a reply..."
                onSubmit={(txt) => {
                  addReply(postId, comment.id, txt)
                  setShowReply(false)
                }}
              />
            )}

            {/* Replies */}
            {comment.replies.map((reply: any) => (
              <div key={reply.id} className="flex items-start gap-2 mt-3 ml-6">
                <CornerDownRight className="w-4 h-4 text-gray-400 mt-2 shrink-0" />
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{reply.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{reply.author}</p>
                    <p className="text-sm text-gray-800 mt-1">{reply.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{reply.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const ProfileModal = ({ profile, onClose }: { profile: any; onClose: () => void }) => {
    const isAlreadyMatched = matchedUserIds.includes(profile.id)

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Profile</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-4">
            <ProfileCard profile={profile} />

            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => handleAddMatch(profile)}
                disabled={isAlreadyMatched}
                className={`flex-1 ${
                  isAlreadyMatched ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isAlreadyMatched ? "Already Matched" : "Add Match"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 safe-area-bottom">
      <Navigation />

      <div className="pt-24 px-4 pb-24 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Community</h1>
            <p className="text-gray-600 text-sm sm:text-base">Connect with your business network</p>
          </div>

          {/* Create Post Card */}
          <Card className="mb-6 mobile-card-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.profile?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{user.profile?.name}</p>
                  <p className="text-xs text-gray-500">{user.profile?.title}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                placeholder="Share your business insights..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-3 min-h-[80px] resize-none"
              />

              {selectedImage && (
                <div className="mb-3 relative">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedImage(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Camera className="w-4 h-4 mr-1" />
                    Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <Button
                  onClick={handlePost}
                  disabled={!newPost.trim() && !selectedImage}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {visiblePosts.length === 0 ? (
              <Card className="text-center p-8 mobile-card-shadow">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">
                  Start matching with other business professionals to see their posts in your community feed.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">Find Matches</Button>
              </Card>
            ) : (
              visiblePosts.map((post) => (
                <Card key={post.id} className="mobile-card-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          className="w-12 h-12 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all"
                          onClick={() => handleProfileClick(post.userId)}
                        >
                          <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{post.author}</p>
                          <p className="text-xs text-gray-600">{post.authorTitle}</p>
                          <p className="text-xs text-gray-500">{post.authorCompany}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-800 mb-3 whitespace-pre-line leading-relaxed">{post.content}</p>

                    {post.image && (
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post content"
                        className="w-full h-64 object-cover rounded-lg mb-3"
                      />
                    )}

                    {post.tags && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Separator className="mb-4" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="text-gray-600 hover:text-red-500 hover:bg-red-50 p-2"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.likes}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComment(post.id)}
                          className="text-gray-600 hover:text-blue-500 hover:bg-blue-50 p-2"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">{post.commentThread.length}</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-1 text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs">{Math.round((post.likes / post.views) * 100)}% engagement</span>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-4">
                      {post.commentThread.map((comment) => (
                        <CommentThread key={comment.id} postId={post.id} comment={comment} />
                      ))}

                      <CommentInput placeholder="Add a comment..." onSubmit={(txt) => addComment(post.id, txt)} />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
      {selectedProfile && <ProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
    </div>
  )
}

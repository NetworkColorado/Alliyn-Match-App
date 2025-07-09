import { Badge } from "@/components/ui/badge"
import { Crown, Trophy, Star, Zap, Target, TrendingUp, Users, DollarSign, Award, Flame } from "lucide-react"

interface AchievementBadgeProps {
  type: string
  size?: "sm" | "md" | "lg"
}

const achievements = {
  // Deal-based achievements
  "deal-king": {
    icon: Crown,
    label: "Deal King",
    color: "bg-yellow-500 text-white",
    description: "Highest deal value this month",
  },
  "deal-maker": {
    icon: DollarSign,
    label: "Deal Maker",
    color: "bg-green-500 text-white",
    description: "Most deals completed",
  },
  "big-closer": {
    icon: Target,
    label: "Big Closer",
    color: "bg-blue-500 text-white",
    description: "Closed deals over $100K",
  },

  // Connection-based achievements
  connector: {
    icon: Users,
    label: "Super Connector",
    color: "bg-purple-500 text-white",
    description: "Most connections made",
  },
  networker: {
    icon: Star,
    label: "Master Networker",
    color: "bg-indigo-500 text-white",
    description: "50+ successful matches",
  },
  "partnership-pro": {
    icon: Award,
    label: "Partnership Pro",
    color: "bg-pink-500 text-white",
    description: "High partnership conversion rate",
  },

  // Performance achievements
  "rising-star": {
    icon: TrendingUp,
    label: "Rising Star",
    color: "bg-orange-500 text-white",
    description: "Fastest growing this month",
  },
  consistent: {
    icon: Zap,
    label: "Consistent Performer",
    color: "bg-teal-500 text-white",
    description: "Top 5 for 3 months straight",
  },
  "hot-streak": {
    icon: Flame,
    label: "Hot Streak",
    color: "bg-red-500 text-white",
    description: "5 deals in one week",
  },

  // Rank achievements
  champion: {
    icon: Trophy,
    label: "Champion",
    color: "bg-yellow-600 text-white",
    description: "#1 Overall",
  },
}

export function AchievementBadge({ type, size = "sm" }: AchievementBadgeProps) {
  const achievement = achievements[type as keyof typeof achievements]

  if (!achievement) return null

  const Icon = achievement.icon
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <Badge
      className={`${achievement.color} ${sizeClasses[size]} flex items-center gap-1 font-semibold border-0`}
      title={achievement.description}
    >
      <Icon className={iconSizes[size]} />
      {achievement.label}
    </Badge>
  )
}

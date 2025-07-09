"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, MessageCircle, Settings, ShoppingBag, User, Users } from "lucide-react"
import { useMessaging } from "@/contexts/messaging-context"

export default function Navigation() {
  const pathname = usePathname()
  const { conversations } = useMessaging()

  // Calculate total unread messages
  const totalUnread = conversations.reduce((total, conv) => total + conv.unreadCount, 0)

  const navItems = [
    {
      href: "/",
      icon: Heart,
      label: "Match",
      isActive: pathname === "/",
    },
    {
      href: "/messages",
      icon: MessageCircle,
      label: "Messages",
      isActive: pathname === "/messages",
      badge: totalUnread > 0 ? (totalUnread > 99 ? "99+" : totalUnread.toString()) : null,
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      isActive: pathname === "/settings",
    },
    {
      href: "/shop",
      icon: ShoppingBag,
      label: "Shop",
      isActive: pathname === "/shop",
    },
    {
      href: "/community",
      icon: Users,
      label: "Community",
      isActive: pathname === "/community",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      isActive: pathname === "/profile",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                item.isActive ? "text-purple-600 bg-purple-50" : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-18px] flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

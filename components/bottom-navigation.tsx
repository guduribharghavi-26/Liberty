"use client"

import { Home, MessageSquare, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export function BottomNavigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Don't show bottom nav on auth page
  if (pathname === "/auth") return null

  const scrollToSuccessStories = () => {
    const element = document.getElementById("success-stories")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/",
      show: true,
    },
    {
      icon: MessageSquare,
      label: "Chat",
      href: "/chat",
      show: user?.role !== "parent",
    },
    {
      icon: Trophy,
      label: "Stories",
      onClick: scrollToSuccessStories,
      show: user?.role !== "parent",
    },
  ].filter((item) => item.show)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-lg md:hidden z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = item.href === pathname

          if (item.onClick) {
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="flex flex-col items-center py-2 px-4 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={index}
              href={item.href!}
              className={`flex flex-col items-center py-2 px-4 transition-colors ${
                isActive ? "text-purple-600" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

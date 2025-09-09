"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/", label: "Home" },
    ...(user?.role !== "parent" ? [{ href: "/chat", label: "Real-Time Chat" }] : []),
    ...(user?.role === "woman" ? [{ href: "/report", label: "Report a Case" }] : []),
    ...(user?.role === "police" ? [{ href: "/admin", label: "Admin Dashboard" }] : []),
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-orange-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/liberty-logo.png" alt="Liberty Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Liberty
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.name} ({user.role})
                </span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="saffron-gradient hover:opacity-90 text-white font-semibold shadow-md">
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-orange-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm text-gray-600">
                    Welcome, {user.name} ({user.role})
                  </span>
                  <Button onClick={logout} variant="outline" size="sm" className="w-fit bg-transparent">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="saffron-gradient hover:opacity-90 text-white font-semibold w-fit shadow-md">
                    Login / Register
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-purple-50 to-teal-50 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access this section of Liberty. Your safety and security are our priority.
            </p>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700">
                Sign In to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              You are not authorized to access this section. This area is restricted to {allowedRoles.join(" and ")}{" "}
              accounts only.
            </p>
            <div className="bg-white p-4 rounded-lg border border-orange-200 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Current Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Required Role:</strong>{" "}
                {allowedRoles.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(" or ")}
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

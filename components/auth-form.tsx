"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Shield, UserCheck, Users } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type UserRole = "woman" | "police" | "parent"

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [selectedRole, setSelectedRole] = useState<UserRole>("woman")
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    state: "",
    city: "",
    badgeId: "",
    policeStation: "",
    relation: "",
  })

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate authentication
    const userData = {
      id: "1",
      name: formData.name || "Demo User",
      role: selectedRole,
      mobile: formData.mobile,
    }

    login(userData)

    toast({
      title: isLogin ? "Login Successful" : "Registration Successful",
      description: `Welcome to Liberty, ${userData.name}!`,
    })

    router.push("/")
  }

  const roleIcons = {
    woman: Shield,
    police: UserCheck,
    parent: Users,
  }

  const RoleIcon = roleIcons[selectedRole]

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image 
            src="/liberty-logo.png" 
            alt="Liberty Logo" 
            width={120} 
            height={120}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {isLogin ? "Welcome Back to Liberty" : "Join Liberty Community"}
        </h1>
        <p className="text-gray-600">
          {isLogin
            ? "Access your secure Liberty safety dashboard"
            : "Register for comprehensive safety services and protection"}
        </p>
      </div>

      <Card>
        <CardHeader className="patriot-gradient text-white">
          <CardTitle className="flex items-center justify-center">
            <RoleIcon className="h-5 w-5 mr-2" />
            {isLogin ? "Secure Login" : "Safety Registration"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={isLogin ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full saffron-gradient hover:opacity-90 font-semibold"
                >
                  Access Liberty Portal
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Role Selection */}
                <div>
                  <Label>Select Your Role</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                    <SelectTrigger className="bg-orange-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="woman">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          Woman - Safety & Protection Services
                        </div>
                      </SelectItem>
                      <SelectItem value="police">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Police Officer - Safety Provider
                        </div>
                      </SelectItem>
                      <SelectItem value="parent">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Parent/Guardian - Family Safety
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Mobile for OTP verification"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Create Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a strong password"
                    required
                  />
                </div>

                {/* Role-specific fields */}
                {selectedRole === "woman" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="Your state"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Your city"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Identity Verification Documents</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                          <Upload className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Aadhaar Card</p>
                        </div>
                        <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                          <Upload className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">Face Photo</p>
                        </div>
                        {/* <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                          <Upload className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-600">ID Proof</p>
                        </div> */}
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "police" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="badgeId">Badge ID *</Label>
                        <Input
                          id="badgeId"
                          value={formData.badgeId}
                          onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                          placeholder="Your badge number"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="policeStation">Police Station *</Label>
                        <Input
                          id="policeStation"
                          value={formData.policeStation}
                          onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                          placeholder="Your station name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          placeholder="Your state"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Your city"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Official Credentials</Label>
                      <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors mt-2">
                        <Upload className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Official ID or Credentials</p>
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "parent" && (
                  <>
                    <div>
                      <Label htmlFor="relation">Relationship *</Label>
                      <Select
                        value={formData.relation}
                        onValueChange={(value) => setFormData({ ...formData, relation: value })}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-sm text-orange-800">
                        <strong>Note:</strong> Parent accounts require invitation/confirmation from the registered
                        woman's account for security purposes.
                      </p>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full saffron-gradient hover:opacity-90 font-semibold"
                >
                  Join Liberty Community
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to Liberty's Terms of Service and Privacy Policy. Your safety and
              privacy are our top priorities.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

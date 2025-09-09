"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Key, AlertTriangle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function AdminAuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
    badge_id: "",
    police_station: "",
    state: "",
    city: "",
  })
  const [errors, setErrors] = useState<any>({})

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: any = {}

    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required"
      if (!formData.secretKey.trim()) newErrors.secretKey = "Admin secret key is required"
      if (!formData.badge_id.trim()) newErrors.badge_id = "Badge ID is required"
      if (!formData.police_station.trim()) newErrors.police_station = "Police station is required"
      if (!formData.state.trim()) newErrors.state = "State is required"
      if (!formData.city.trim()) newErrors.city = "City is required"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password.trim()) newErrors.password = "Password is required"
    if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const endpoint = isLogin ? "/api/admin/auth/login" : "/api/admin/auth/register"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Login the user
        login({
          id: data.user._id,
          name: data.user.name,
          role: "police",
          mobile: data.user.mobile,
        })

        toast({
          title: isLogin ? "Login Successful" : "Registration Successful",
          description: `Welcome to Liberty Admin, ${data.user.name}!`,
        })

        router.push("/admin")
      } else {
        toast({
          title: "Error",
          description: data.message || "Authentication failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{isLogin ? "Admin Login" : "Admin Registration"}</h1>
        <p className="text-gray-600">
          {isLogin ? "Access the Liberty administrative dashboard" : "Register as a Liberty platform administrator"}
        </p>
      </div>

      <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
          <CardTitle className="flex items-center justify-center">
            <Lock className="h-5 w-5 mr-2" />
            Secure Admin Access
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={isLogin ? "login" : "register"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Admin Login
              </TabsTrigger>
              <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                Admin Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@police.gov.in"
                    className={errors.email ? "border-red-500" : ""}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-semibold"
                >
                  {loading ? "Signing In..." : "Access Admin Dashboard"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Admin Registration:</strong> You need a valid admin secret key to register as a platform
                  administrator. This key is provided by the system owner.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Secret Key - Most Important */}
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <Label htmlFor="secretKey" className="text-red-800 font-semibold">
                    Admin Secret Key *
                  </Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="Enter the admin secret key"
                    className={`mt-2 ${errors.secretKey ? "border-red-500" : "border-red-300"}`}
                    required
                  />
                  {errors.secretKey && <p className="text-red-500 text-sm mt-1">{errors.secretKey}</p>}
                  <p className="text-xs text-red-600 mt-1">
                    This key is required to verify your authorization to register as an admin.
                  </p>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="+91 9876543210"
                      className={errors.mobile ? "border-red-500" : ""}
                      required
                    />
                    {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Official Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@police.gov.in"
                    className={errors.email ? "border-red-500" : ""}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Police Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="badge_id">Badge ID *</Label>
                    <Input
                      id="badge_id"
                      value={formData.badge_id}
                      onChange={(e) => setFormData({ ...formData, badge_id: e.target.value })}
                      placeholder="e.g., ADM001"
                      className={errors.badge_id ? "border-red-500" : ""}
                      required
                    />
                    {errors.badge_id && <p className="text-red-500 text-sm mt-1">{errors.badge_id}</p>}
                  </div>

                  <div>
                    <Label htmlFor="police_station">Police Station *</Label>
                    <Input
                      id="police_station"
                      value={formData.police_station}
                      onChange={(e) => setFormData({ ...formData, police_station: e.target.value })}
                      placeholder="Central Police Station"
                      className={errors.police_station ? "border-red-500" : ""}
                      required
                    />
                    {errors.police_station && <p className="text-red-500 text-sm mt-1">{errors.police_station}</p>}
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Karnataka"
                      className={errors.state ? "border-red-500" : ""}
                      required
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bangalore"
                      className={errors.city ? "border-red-500" : ""}
                      required
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Create Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Create a strong password"
                      className={errors.password ? "border-red-500" : ""}
                      required
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                      required
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 font-semibold"
                >
                  {loading ? "Registering..." : "Register as Admin"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                <span className="text-sm font-semibold text-orange-800">Security Notice</span>
              </div>
              <p className="text-xs text-orange-700">
                Admin access is restricted and monitored. All administrative actions are logged for security purposes.
                Unauthorized access attempts will be reported to authorities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

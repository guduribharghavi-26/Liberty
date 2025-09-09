"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Shield,
  Search,
  Eye,
  UserCheck,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  LogOut,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  name: string
  email: string
  mobile: string
  role: "woman" | "police" | "parent"
  is_verified: boolean
  is_active: boolean
  state?: string
  city?: string
  badge_id?: string
  police_station?: string
  relation?: string
  created_at: string
  last_login?: string
}

interface Incident {
  _id: string
  case_number: string
  title: string
  description: string
  status: "pending" | "in_progress" | "resolved" | "closed"
  priority: number
  reporter_name?: string
  assigned_officer_name?: string
  created_at: string
}

interface AdminStats {
  total_users: number
  total_women: number
  total_police: number
  total_parents: number
  total_incidents: number
  pending_incidents: number
  resolved_incidents: number
  active_chats: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== "police") {
      router.push("/admin/auth")
      return
    }
    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching admin data...") // Debug log

      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats")
      const statsData = await statsResponse.json()
      console.log("Stats response:", statsData) // Debug log

      if (statsData.success) {
        setStats(statsData.stats)
      } else {
        console.error("Stats fetch failed:", statsData.message)
      }

      // Fetch users
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      console.log("Users response:", usersData) // Debug log

      if (usersData.success) {
        setUsers(usersData.users || [])
        console.log("Users set:", usersData.users?.length || 0) // Debug log
      } else {
        console.error("Users fetch failed:", usersData.message)
        setError("Failed to fetch users: " + usersData.message)
      }

      // Fetch incidents
      const incidentsResponse = await fetch("/api/admin/incidents")
      const incidentsData = await incidentsResponse.json()
      console.log("Incidents response:", incidentsData) // Debug log

      if (incidentsData.success) {
        setIncidents(incidentsData.incidents || [])
      } else {
        console.error("Incidents fetch failed:", incidentsData.message)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      setError("Network error occurred while fetching data")
      toast({
        title: "Error",
        description: "Failed to fetch admin data. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAdminData()
  }

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      })

      const data = await response.json()
      if (data.success) {
        setUsers(users.map((user) => (user._id === userId ? { ...user, is_active: isActive } : user)))
        toast({
          title: "Success",
          description: `User ${isActive ? "activated" : "deactivated"} successfully`,
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update user status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update user error:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const updateIncidentStatus = async (incidentId: string, status: string, priority?: number) => {
    try {
      const response = await fetch(`/api/admin/incidents/${incidentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority }),
      })

      const data = await response.json()
      if (data.success) {
        setIncidents(
          incidents.map((incident) =>
            incident._id === incidentId
              ? { ...incident, status: status as any, priority: priority || incident.priority }
              : incident,
          ),
        )
        toast({
          title: "Success",
          description: "Incident updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update incident",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update incident error:", error)
      toast({
        title: "Error",
        description: "Failed to update incident",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/auth")
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile?.includes(searchTerm)
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Liberty platform operations and users</p>
          {user && (
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-800">Logged in as: {user.name} (Admin)</Badge>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Admin Access Notice */}
      <Alert className="border-green-200 bg-green-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure Admin Access:</strong> You are logged in with administrative privileges. All actions are
          monitored and logged for security purposes.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="liberty-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total_users}</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-4 flex space-x-4 text-xs text-gray-500">
                <span>Women: {stats.total_women}</span>
                <span>Police: {stats.total_police}</span>
                <span>Parents: {stats.total_parents}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="liberty-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Incidents</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.total_incidents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="mt-4 flex space-x-4 text-xs text-gray-500">
                <span>Pending: {stats.pending_incidents}</span>
                <span>Resolved: {stats.resolved_incidents}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="liberty-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Chats</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.active_chats}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="liberty-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Status</p>
                  <p className="text-lg font-semibold text-green-600">Operational</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
        <p>
          Debug Info: Users loaded: {users.length}, Incidents loaded: {incidents.length}
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management ({users.length})</TabsTrigger>
          <TabsTrigger value="incidents">Incident Management ({incidents.length})</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Registered Users ({users.length})</span>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="woman">Women</SelectItem>
                      <SelectItem value="police">Police</SelectItem>
                      <SelectItem value="parent">Parents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                  <Button onClick={handleRefresh} variant="outline" className="mt-4 bg-transparent">
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Role</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-800">{user.name || "N/A"}</p>
                              <p className="text-sm text-gray-500">{user.email || "N/A"}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge
                              className={`${
                                user.role === "woman"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "police"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "Unknown"}
                            </Badge>
                            {user.badge_id && <p className="text-xs text-gray-500 mt-1">Badge: {user.badge_id}</p>}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
                              <span>{user.mobile || "N/A"}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              <span className="truncate max-w-32">{user.email || "N/A"}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {user.city && user.state ? (
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                <span>
                                  {user.city}, {user.state}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Not provided</span>
                            )}
                            {user.police_station && <p className="text-xs text-gray-500 mt-1">{user.police_station}</p>}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col space-y-1">
                              <Badge
                                className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                              >
                                {user.is_active ? "Active" : "Inactive"}
                              </Badge>
                              <Badge
                                className={
                                  user.is_verified ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {user.is_verified ? "Verified" : "Unverified"}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600">
                              <p>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</p>
                              {user.last_login && (
                                <p className="text-xs text-gray-500">
                                  Last: {new Date(user.last_login).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateUserStatus(user._id, !user.is_active)}
                                className={
                                  user.is_active
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-green-600 hover:text-green-700"
                                }
                              >
                                {user.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Incident Management ({incidents.length})</span>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {incidents.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No incidents found</p>
                  <Button onClick={handleRefresh} variant="outline" className="mt-4 bg-transparent">
                    Refresh Data
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Case Details</th>
                        <th className="text-left p-3">Reporter</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Priority</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.map((incident) => (
                        <tr key={incident._id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium text-gray-800">{incident.case_number || "N/A"}</p>
                              <p className="text-sm text-gray-600 truncate max-w-48">{incident.title || "N/A"}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-gray-600">{incident.reporter_name || "Unknown"}</p>
                            {incident.assigned_officer_name && (
                              <p className="text-xs text-gray-500">Officer: {incident.assigned_officer_name}</p>
                            )}
                          </td>
                          <td className="p-3">
                            <Select
                              value={incident.status}
                              onValueChange={(value) => updateIncidentStatus(incident._id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Select
                              value={incident.priority?.toString() || "2"}
                              onValueChange={(value) =>
                                updateIncidentStatus(incident._id, incident.status, Number.parseInt(value))
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Low</SelectItem>
                                <SelectItem value="2">Medium</SelectItem>
                                <SelectItem value="3">High</SelectItem>
                                <SelectItem value="4">Critical</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-gray-600">
                              {incident.created_at ? new Date(incident.created_at).toLocaleDateString() : "N/A"}
                            </p>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Emergency Response Mode</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-Assignment</span>
                  <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>SMS Notifications</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Real-time Chat</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Verify Pending Police Officers
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review High Priority Cases
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Monitor Active Chats
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Generate Safety Report
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

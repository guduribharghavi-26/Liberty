import { Navbar } from "@/components/navbar"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Footer } from "@/components/footer"
import { RoleGuard } from "@/components/role-guard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <RoleGuard allowedRoles={["police"]}>
          <AdminDashboard />
        </RoleGuard>
      </main>
      <Footer />
    </div>
  )
}

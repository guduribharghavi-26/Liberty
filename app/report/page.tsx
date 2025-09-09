import { Navbar } from "@/components/navbar"
import { ReportForm } from "@/components/report-form"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"
import { RoleGuard } from "@/components/role-guard"

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <RoleGuard allowedRoles={["woman"]}>
          <ReportForm />
        </RoleGuard>
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  )
}

import { Navbar } from "@/components/navbar"
import { AuthForm } from "@/components/auth-form"
import { Footer } from "@/components/footer"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AuthForm />
      </main>
      <Footer />
    </div>
  )
}

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { SuccessStories } from "@/components/success-stories"
import { Footer } from "@/components/footer"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <SuccessStories />
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  )
}

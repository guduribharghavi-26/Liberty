import { Button } from "@/components/ui/button"
import { Shield, Heart, Users } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo Display */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/liberty-logo.png" 
              alt="Liberty - Safety is not a privilege. It's a right." 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-orange-800 bg-clip-text text-transparent">
            Welcome to Liberty
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-semibold">Safety is not a privilege. It's a right.</p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Liberty empowers every woman with immediate access to safety resources, secure communication with law enforcement, 
            and comprehensive protection services. Your safety is our sacred duty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth">
              <Button
                size="lg"
                className="saffron-gradient hover:opacity-90 text-white px-8 py-3 text-lg font-semibold shadow-lg"
              >
                Join Liberty Today
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3 text-lg font-semibold bg-white/80 backdrop-blur-sm"
              >
                Emergency Support
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Protected</h3>
              <p className="text-gray-600">Advanced security protocols ensure your safety and privacy at all times</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Empowering Women</h3>
              <p className="text-gray-600">Built with deep understanding of women's safety needs and challenges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Community Support</h3>
              <p className="text-gray-600">Connected network of verified professionals and support systems</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

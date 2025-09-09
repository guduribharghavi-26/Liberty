import Link from "next/link"
import { Shield, Heart, Phone, Mail, MapPin } from 'lucide-react'
import Image from "next/image"

export function Footer() {
  return (
    <footer className="safety-gradient text-white py-16 mb-16 md:mb-0">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/liberty-logo.png" 
                alt="Liberty Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <span className="text-2xl font-bold">Liberty</span>
            </div>
            <p className="text-orange-100 mb-4 leading-relaxed">
              Safety is not a privilege. It's a right. – Liberty empowers every woman with immediate access to 
              safety resources, secure communication with law enforcement, and comprehensive protection services.
            </p>
            <div className="flex items-center text-orange-200">
              <Heart className="h-4 w-4 mr-2" />
              <span className="text-sm">Protecting women across India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-orange-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-orange-200 hover:text-white transition-colors">
                  Emergency Chat
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-orange-200 hover:text-white transition-colors">
                  Report Case
                </Link>
              </li>
              <li>
                <Link href="#" className="text-orange-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-orange-200">
                <Phone className="h-4 w-4 mr-2" />
                <span>Emergency: 100</span>
              </li>
              <li className="flex items-center text-orange-200">
                <Phone className="h-4 w-4 mr-2" />
                <span>Women Helpline: 1091</span>
              </li>
              <li className="flex items-center text-orange-200">
                <Mail className="h-4 w-4 mr-2" />
                <span>help@liberty.com</span>
              </li>
              <li className="flex items-center text-orange-200">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Available Pan-India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-orange-700 mt-12 pt-8 text-center">
          <p className="text-orange-200">© 2025 Liberty - Safety is not a privilege. It's a right.</p>
          <p className="text-orange-300 text-sm mt-2">Empowering women's safety across India, 24/7.</p>
          <p className="text-orange-300 text-sm mt-2">Made by Nagasri Bharghavi</p>
        </div>
      </div>
    </footer>
  )
}

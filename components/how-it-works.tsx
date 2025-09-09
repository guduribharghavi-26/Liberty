import { Card, CardContent } from "@/components/ui/card"
import { MapPin, MessageSquare, Shield } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: MapPin,
      title: "Connect Securely",
      description: "Instantly connect to verified safety stations through encrypted channels with location verification.",
    },
    {
      icon: MessageSquare,
      title: "Communicate Safely",
      description: "Share information through secure, monitored channels with trained safety professionals.",
    },
    {
      icon: Shield,
      title: "Get Protected",
      description: "Receive immediate professional response from certified safety personnel in your area.",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">How Liberty Protects You</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three-step safety system designed to ensure your protection and peace of mind
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative liberty-card border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 saffron-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 patriot-gradient rounded-full flex items-center justify-center text-white font-bold shadow-md">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

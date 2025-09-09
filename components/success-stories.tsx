"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Clock } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"

export function SuccessStories() {
  const { user } = useAuth()

  // Hide success stories from parent role
  if (user?.role === "parent") {
    return null
  }

  const stories = [
    {
      id: 1,
      title: "Safety Threat Resolved",
      location: "Mumbai, Maharashtra",
      description: "Liberty's rapid response team successfully resolved a workplace harassment case with immediate intervention and legal support.",
      status: "Resolved",
      timeAgo: "2 days ago",
      image: "/libertypic1.png",
    },
    {
      id: 2,
      title: "Journey to Recovery",
      location: "Delhi, NCR",
      description: "After experiencing domestic violence, Sarah found solace and strength through our counseling services and support groups. She's now advocating for others.",
      status: "Resolved",
      timeAgo: "1 week ago",
      image: "/libertypic2.png",
    },
    {
      id: 3,
      title: "Empowered Through Self-Defense",
      location: "Bangalore, Karnataka",
      description: "Maria joined our self-defense classes after a street incident left her feeling vulnerable. She now walks with confidence, knowing she can protect herself.",
      status: "Resolved",
      timeAgo: "3 weeks ago",
      image: "/libertypic3.png",
    },
  ]

  return (
    <section id="success-stories" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Liberty Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories of how Liberty has made a difference in women's lives across India
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story) => (
            <Card
              key={story.id}
              className="liberty-card border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={story.image || "/placeholder.svg"} alt={story.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {story.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{story.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{story.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {story.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {story.timeAgo}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

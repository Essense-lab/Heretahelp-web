'use client'

import { 
  Shield, 
  Clock, 
  MapPin, 
  CreditCard, 
  MessageSquare, 
  Star,
  Smartphone,
  Users,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    name: 'Verified Technicians',
    description: 'All our technicians are background-checked, licensed, and insured for your peace of mind.',
    icon: Shield,
  },
  {
    name: 'Real-Time Tracking',
    description: 'Track your technician\'s location and get live updates on service progress.',
    icon: MapPin,
  },
  {
    name: '24/7 Availability',
    description: 'Emergency services available around the clock, including weekends and holidays.',
    icon: Clock,
  },
  {
    name: 'Secure Payments',
    description: 'Pay safely through our encrypted platform. No cash needed, digital receipts included.',
    icon: CreditCard,
  },
  {
    name: 'Direct Messaging',
    description: 'Chat directly with your technician to discuss details and ask questions.',
    icon: MessageSquare,
  },
  {
    name: 'Quality Guarantee',
    description: 'All work comes with our satisfaction guarantee. Not happy? We\'ll make it right.',
    icon: CheckCircle,
  },
]

const benefits = [
  {
    title: 'For Customers',
    features: [
      'Get multiple competitive bids',
      'Choose based on price and reviews',
      'Service at your location',
      'Transparent pricing',
      'Quality guarantee',
      'Emergency support'
    ],
    icon: Users,
    color: 'bg-blue-500'
  },
  {
    title: 'For Technicians',
    features: [
      'Flexible work schedule',
      'Grow your business',
      'Secure payment processing',
      'Customer management tools',
      'Marketing support',
      'Professional network'
    ],
    icon: Smartphone,
    color: 'bg-green-500'
  }
]

export function Features() {
  return (
    <div id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main features */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Here Ta Help?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            We've built the most comprehensive platform for mobile repair services with features that benefit everyone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                </div>
              </div>
              <p className="mt-4 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits for different user types */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900">
              Built for Everyone
            </h3>
            <p className="mt-4 text-lg text-gray-500">
              Whether you need service or provide it, our platform has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`${benefit.color} px-6 py-4`}>
                  <div className="flex items-center">
                    <benefit.icon className="h-8 w-8 text-white" />
                    <h4 className="ml-3 text-xl font-bold text-white">{benefit.title}</h4>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <ul className="space-y-3">
                    {benefit.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-20">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Trusted by Thousands
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                <div className="text-gray-500">Customer Rating</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">99.5%</div>
                <div className="text-gray-500">Service Success Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">&lt; 30 min</div>
                <div className="text-gray-500">Average Response Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

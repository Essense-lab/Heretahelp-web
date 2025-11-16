
'use client'

import Image from 'next/image'

const features = [
  {
    name: 'Verified Technicians',
    description: 'All our technicians are background-checked, licensed, and insured for your peace of mind.',
    emoji: '🛡️',
  },
  {
    name: 'Real-Time Tracking',
    description: 'Track your technician\'s location and get live updates on service progress.',
    emoji: '📍',
  },
  {
    name: '24/7 Availability',
    description: 'Emergency services available around the clock, including weekends and holidays.',
    emoji: '⏰',
  },
  {
    name: 'Secure Payments',
    description:
      'Full payment is collected upfront and held in escrow. Funds stay secure until you confirm the job is done—or five days pass—then they’re released to the technician.',
    emoji: '💳',
  },
  {
    name: 'Direct Messaging',
    description: 'Chat directly with your technician to discuss details and ask questions.',
    emoji: '💬',
  },
  {
    name: 'Quality Guarantee',
    description: 'All work comes with our satisfaction guarantee. Not happy? We\'ll make it right.',
    emoji: '✅',
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
    emoji: '🙋‍♀️',
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
    emoji: '🧰',
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
            <div
              key={feature.name}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-4xl" role="img" aria-label={feature.name}>{feature.emoji}</span>
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
                    <span className="text-3xl" role="img" aria-label={benefit.title}>{benefit.emoji}</span>
                    <h4 className="ml-3 text-xl font-bold text-white">{benefit.title}</h4>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <ul className="space-y-3">
                    {benefit.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="mr-3" role="img" aria-hidden="true">✅</span>
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
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-72 sm:h-96">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
                  alt="Happy customer leaving a five-star review"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm uppercase tracking-widest text-primary-100 mb-1">Customer Spotlight</p>
                  <h3 className="text-2xl font-bold leading-tight">
                    "Here Ta Help made it effortless to book and trust the technicians who showed up."
                  </h3>
                  <p className="mt-3 text-sm text-primary-100">Sarah J. • Verified Customer</p>
                </div>
              </div>

              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Trusted by Thousands
                  </h3>
                  <p className="mt-3 text-gray-600">
                    Real reviews from real people. Our community keeps us accountable to deliver top-notch service every single time.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                  <div className="text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-2">
                      <div className="flex space-x-1 text-yellow-400 text-lg">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} role="img" aria-label="star">⭐</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">4.9 / 5</div>
                    <div className="text-gray-500">Average Rating</div>
                  </div>

                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900 mb-2">10K+</div>
                    <div className="text-gray-500">Happy Customers</div>
                  </div>

                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gray-900 mb-2">500+</div>
                    <div className="text-gray-500">Verified Technicians</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

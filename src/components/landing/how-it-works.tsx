'use client'

const steps = [
  {
    name: 'Request Service',
    description: 'Tell us what you need and where you are. Our smart matching system finds the best technicians for your specific needs.',
    emoji: '📍',
    details: [
      'Describe your problem',
      'Set your location',
      'Choose service type',
      'Upload photos if needed'
    ]
  },
  {
    name: 'Get Matched',
    description: 'Receive bids from qualified technicians in your area. Compare prices, reviews, and availability.',
    emoji: '🤝',
    details: [
      'Verified technicians bid',
      'Compare prices & reviews',
      'Check availability',
      'Ask questions via chat'
    ]
  },
  {
    name: 'Service Completed',
    description: 'Your chosen technician arrives at your location and completes the work professionally.',
    emoji: '🔧',
    details: [
      'Technician arrives on time',
      'Professional service',
      'Real-time updates',
      'Quality guarantee'
    ]
  },
  {
    name: 'Secure Payment',
    description:
      'We collect payment upfront and hold it in escrow.',
    emoji: '💳',
    details: [
      'Funds held in escrow until you confirm',
      'Automatic release after five days if no issues',
      'Secure payment processing',
      'Digital receipts & service reviews'
    ]
  },
]

export function HowItWorks() {
  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Getting help is simple. Just four easy steps to get your repair needs handled professionally.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {steps.map((step, stepIdx) => (
              <div key={step.name} className="relative">
                {/* Connection line */}
                {stepIdx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-200 rounded-full"></div>
                  </div>
                )}
                
                <div className="relative z-10 bg-white">
                  <div className="text-center">
                    <span className="text-4xl" role="img" aria-label={step.name}>{step.emoji}</span>
                    <h3 className="mt-4 text-xl font-medium text-gray-900">{step.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                    
                    <div className="mt-6">
                      <ul className="space-y-2 text-sm text-gray-600">
                        {step.details.map((detail) => (
                          <li key={detail} className="flex items-center justify-center">
                            <span className="mr-2" role="img" aria-hidden="true">✅</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Here Ta Help for their repair needs. 
              Get your first service quote in minutes.
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Start Your Service Request
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-sm text-gray-500 mt-1">Services Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-gray-500 mt-1">Verified Technicians</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4.9</div>
            <div className="text-sm text-gray-500 mt-1">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-gray-500 mt-1">Emergency Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}

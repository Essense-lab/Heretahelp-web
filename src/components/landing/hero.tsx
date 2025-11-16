'use client'

interface HeroProps {
  onGetStarted: () => void
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Mobile Repair Services</span>{' '}
                <span className="block text-primary xl:inline">When You Need Them</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Professional technicians for cars, boats, diesel trucks, tires, locksmith services, towing, mobile wash, and motorcycle repair. 
                Get help anywhere, anytime with our network of verified professionals.
              </p>

              {/* Trust indicators */}
              <div className="mt-6 flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex items-center">
                  <div className="flex space-x-1 text-yellow-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} role="img" aria-label="star">⭐</span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">4.9/5 rating</span>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">10,000+</span> services completed
                </div>
              </div>

              <div className="mt-8 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <button
                    onClick={onGetStarted}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors"
                  >
                    Get Started Now
                    <span className="ml-2" role="img" aria-label="arrow">
                      ➡️
                    </span>
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors">
                    <span className="mr-2" role="img" aria-label="play">
                      ▶️
                    </span>
                    Watch Demo
                  </button>
                </div>
              </div>

              {/* Key benefits */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white">
                      <span className="text-sm font-medium">24</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">24/7 Availability</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white">
                      <span className="text-sm font-medium">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Verified Technicians</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-white">
                      <span className="text-sm font-medium">$</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Fair Pricing</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-br from-primary-100 to-primary-200 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-32 w-32 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl">🔧</div>
            </div>
            <p className="mt-4 text-lg font-medium text-primary-800">
              Professional Service at Your Location
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

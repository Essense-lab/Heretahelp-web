'use client'

interface CTAProps {
  onGetStarted: () => void
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-xl text-primary-100">
            Join thousands of satisfied customers and professional technicians on our platform.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* For Customers */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 text-3xl" role="img" aria-label="Customers">
                🙋‍♂️
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">For Customers</h3>
                <p className="text-gray-600">Need repair services?</p>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Get multiple competitive bids
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Service at your location
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Verified, insured technicians
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                24/7 emergency support
              </li>
            </ul>
            
            <button
              onClick={onGetStarted}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Request Service Now
              <span className="ml-2" role="img" aria-label="arrow">➡️</span>
            </button>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Free to post • No upfront costs • Pay only when satisfied
            </p>
          </div>

          {/* For Technicians */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex-shrink-0 text-3xl" role="img" aria-label="Technicians">
                🧰
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">For Technicians</h3>
                <p className="text-gray-600">Grow your business</p>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Flexible work schedule
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Secure payment processing
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Customer management tools
              </li>
              <li className="flex items-center text-gray-700">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mr-3"></div>
                Marketing and lead generation
              </li>
            </ul>
            
            <button
              onClick={onGetStarted}
              className="w-full bg-secondary text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              Join as Technician
              <span className="ml-2" role="img" aria-label="arrow">➡️</span>
            </button>
            
            <p className="text-sm text-gray-500 text-center mt-4">
              Background check required • Insurance verification • Professional network
            </p>
          </div>
        </div>

        {/* Emergency CTA */}
        <div className="mt-12 text-center">
          <div className="bg-red-600 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              🚨 Need Emergency Service?
            </h3>
            <p className="text-red-100 mb-4">
              Our emergency response team is available 24/7 for urgent repairs and roadside assistance.
            </p>
            <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get Emergency Help Now
            </button>
          </div>
        </div>

        {/* App download */}
        <div className="mt-12 text-center">
          <p className="text-primary-100 mb-6">
            Also available on mobile for the complete experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
              <div className="mr-3">
                <div className="text-xs">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </button>
            <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
              <div className="mr-3">
                <div className="text-xs">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

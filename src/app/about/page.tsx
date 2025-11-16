export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HereTaHelp</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting vehicle owners with trusted automotive professionals for instant, reliable service.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              HereTaHelp was founded with the vision of revolutionizing the automotive service industry.
              We believe that quality vehicle maintenance and repair should be accessible, transparent,
              and convenient for everyone.
            </p>
            <p className="text-gray-600">
              Our platform connects vehicle owners with certified technicians who can provide
              on-demand service, towing, repairs, and maintenance, all through a simple,
              user-friendly mobile and web application.
            </p>
          </div>
          <div className="bg-gray-100 rounded-lg p-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 mb-4">Happy Customers</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 mb-4">Certified Technicians</div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Service Availability</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Why Choose HereTaHelp?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Professionals</h3>
              <p className="text-gray-600">
                All our technicians are thoroughly vetted, certified, and insured for your peace of mind.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Service</h3>
              <p className="text-gray-600">
                Get help when you need it most with our on-demand booking system and real-time tracking.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden fees or surprise charges. Know exactly what you'll pay before booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

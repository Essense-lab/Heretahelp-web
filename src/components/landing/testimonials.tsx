'use client'

import Image from 'next/image'

const testimonials = [
  {
    content: "Here Ta Help saved my day! My car broke down on the highway and within 30 minutes, a certified technician was there to help. Professional, fast, and reasonably priced.",
    author: {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Car Repair',
  },
  {
    content: "As a boat owner, finding reliable marine repair services was always a challenge. Here Ta Help connected me with an expert who fixed my engine issues right at the marina.",
    author: {
      name: 'Mike Rodriguez',
      role: 'Boat Enthusiast',
      image: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Boat Repair',
  },
  {
    content: "I run a small trucking company and Here Ta Help has been a game-changer for our fleet maintenance. Quick response times and quality work every time.",
    author: {
      name: 'David Chen',
      role: 'Fleet Manager',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Diesel Truck',
  },
  {
    content: "Got locked out of my car at 2 AM. The locksmith arrived in 20 minutes and had me back in my car quickly. Excellent emergency service!",
    author: {
      name: 'Jennifer Williams',
      role: 'Nurse',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Locksmith',
  },
  {
    content: "The towing service was professional and careful with my classic car. They understood the value and treated it with the respect it deserved.",
    author: {
      name: 'Robert Thompson',
      role: 'Car Dealer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Towing',
  },
  {
    content: "Flat tire on a busy street, but the tire technician made it safe and quick. Great service and fair pricing. Highly recommend!",
    author: {
      name: 'Lisa Anderson',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
    },
    rating: 5,
    service: 'Tire Services',
  },
]

export function Testimonials() {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Don't just take our word for it. Here's what real customers have to say about their experience.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="flex space-x-1 text-yellow-400 text-lg">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} role="img" aria-label="star">⭐</span>
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium text-primary bg-primary-100 px-2 py-1 rounded">
                  {testimonial.service}
                </span>
              </div>
              
              <div className="relative">
                <span className="absolute top-0 left-0 text-primary-200 text-4xl transform -translate-x-2 -translate-y-3" aria-hidden="true">“</span>
                <p className="text-gray-700 italic relative z-10 pl-6">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary-100">
                  <Image
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    priority={index < 3}
                  />
                </div>
                <div className="ml-4">
                  <div className="text-base font-medium text-gray-900">
                    {testimonial.author.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.author.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional social proof */}
        <div className="mt-16 bg-primary-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Join Our Growing Community
            </h3>
            
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10,000+</div>
                <div className="text-sm text-gray-600 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600 mt-1">Expert Technicians</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-gray-600 mt-1">Cities Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-gray-600 mt-1">Support Available</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Get Started Today
              </button>
              <button className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                Become a Technician
              </button>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted and secured by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-gray-400">STRIPE</div>
            <div className="text-2xl font-bold text-gray-400">SUPABASE</div>
            <div className="text-2xl font-bold text-gray-400">MAPBOX</div>
            <div className="text-2xl font-bold text-gray-400">SSL SECURED</div>
          </div>
        </div>
      </div>
    </div>
  )
}

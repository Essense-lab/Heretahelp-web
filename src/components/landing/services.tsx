'use client'

const services = [
  {
    name: 'Car Repair',
    description: 'Professional automotive repair services at your location. From diagnostics to complex repairs.',
    emoji: '🚗',
    features: ['Engine diagnostics', 'Brake repair', 'Battery replacement', 'Oil changes'],
  },
  {
    name: 'Boat Repair',
    description: 'Marine repair services for all types of watercraft. Get back on the water quickly.',
    emoji: '⛵',
    features: ['Engine service', 'Hull repair', 'Electrical systems', 'Winterization'],
  },
  {
    name: 'Diesel Truck Repair',
    description: 'Heavy-duty diesel truck repair and maintenance services for commercial vehicles.',
    emoji: '🚛',
    features: ['Engine overhaul', 'Transmission repair', 'Brake systems', 'Fleet maintenance'],
  },
  {
    name: 'Tire Services',
    description: 'Complete tire services including repair, replacement, and roadside assistance.',
    emoji: '🛞',
    features: ['Tire replacement', 'Flat tire repair', 'Wheel balancing', 'Roadside service'],
  },
  {
    name: 'Locksmith',
    description: 'Professional locksmith services for automotive, residential, and commercial needs.',
    emoji: '🔑',
    features: ['Car lockouts', 'Key replacement', 'Lock repair', 'Security systems'],
  },
  {
    name: 'Towing',
    description: 'Reliable towing services for all vehicle types. Fast response times guaranteed.',
    emoji: '🚚',
    features: ['Emergency towing', 'Flatbed service', 'Motorcycle towing', 'Long distance'],
  },
  {
    name: 'Mobile Wash',
    description: 'On-demand detailing and car wash services delivered wherever you need them.',
    emoji: '🧼',
    features: ['Exterior wash', 'Interior detailing', 'Ceramic coating', 'Fleet washing'],
  },
  {
    name: 'Motorcycle Repair',
    description: 'Specialized motorcycle repair and maintenance by certified technicians.',
    emoji: '🏍️',
    features: ['Engine tuning', 'Brake service', 'Electrical diagnostics', 'Performance upgrades'],
  },
]

export function Services() {
  return (
    <div id="services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Mobile Repair Services
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Professional technicians for car, boat, diesel, tire, locksmith, towing, mobile wash, and motorcycle services—available wherever you are.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 text-3xl leading-none">
                    <span role="img" aria-label={`${service.name} icon`}>
                      {service.emoji}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-gray-500">{service.description}</p>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Services Include:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-gray-600">
                        <div className="flex-shrink-0 w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50">
                <button className="w-full text-center text-primary font-medium hover:text-primary-700 transition-colors">
                  Request Service →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Emergency Service?
            </h3>
            <p className="text-gray-600 mb-6">
              Our emergency response team is available 24/7 for urgent repairs and roadside assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                Emergency Service
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Schedule Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'

const navigation = {
  services: [
    { name: 'Car Repair', href: '#' },
    { name: 'Boat Repair', href: '#' },
    { name: 'Diesel Truck', href: '#' },
    { name: 'Tire Services', href: '#' },
    { name: 'Locksmith', href: '#' },
    { name: 'Towing', href: '#' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'Safety', href: '#' },
    { name: 'Community Guidelines', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  technicians: [
    { name: 'Become a Technician', href: '#' },
    { name: 'Technician Resources', href: '#' },
    { name: 'Training Programs', href: '#' },
    { name: 'Insurance Info', href: '#' },
    { name: 'Payment Terms', href: '#' },
    { name: 'Success Stories', href: '#' },
  ],
}

const social = [
  { name: 'Facebook', href: '#', emoji: '📘' },
  { name: 'Instagram', href: '#', emoji: '📸' },
  { name: 'Twitter', href: '#', emoji: '🐦' },
  { name: 'LinkedIn', href: '#', emoji: '💼' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white text-2xl">
                <span role="img" aria-label="Here Ta Help logo">🔧</span>
              </div>
              <span className="text-xl font-bold text-white">Here Ta Help</span>
            </Link>
            <p className="text-gray-300 text-base">
              Professional mobile repair services for cars, boats, trucks, tires, locksmith services, and towing. 
              Get help when and where you need it most.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <span className="mr-3 text-primary" role="img" aria-label="phone">📞</span>
                <span>1-800-HERE-HELP</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="mr-3 text-primary" role="img" aria-label="email">✉️</span>
                <span>support@heretahelp.online</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="mr-3 text-primary" role="img" aria-label="location">📍</span>
                <span>Available nationwide</span>
              </div>
            </div>
            
            <div className="flex space-x-6">
              {social.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">{item.name}</span>
                  <span className="text-2xl" role="img" aria-label={item.name}>{item.emoji}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Services
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Company
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Support
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  For Technicians
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.technicians.map((item) => (
                    <li key={item.name}>
                      <a href={item.href} className="text-base text-gray-300 hover:text-white">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter signup */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="max-w-md mx-auto lg:max-w-none lg:mx-0">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest updates on new services, technician tips, and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-2 bg-primary text-white rounded-r-md hover:bg-primary-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 text-sm">
                Cookie Policy
              </a>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2024 Here Ta Help. All rights reserved.
            </p>
          </div>
        </div>

        {/* Emergency notice */}
        <div className="mt-8 bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">!</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-red-100 text-sm">
                <strong>Emergency Services:</strong> For life-threatening emergencies, call 911 immediately. 
                Our emergency repair services are for non-life-threatening vehicle and equipment issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

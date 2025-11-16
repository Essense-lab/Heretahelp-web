'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onSignIn: () => void
  onGetStarted: () => void
}

export function Header({ onSignIn, onGetStarted }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-primary-200 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white text-2xl">
                <span role="img" aria-label="Here Ta Help logo">🔧</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Here Ta Help</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="ml-10 hidden space-x-4 lg:block">
            <button
              onClick={onSignIn}
              className="inline-block rounded-md border border-transparent py-2 px-4 text-base font-medium text-primary hover:bg-primary-50 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="inline-block rounded-md border border-transparent bg-primary py-2 px-4 text-base font-medium text-white hover:bg-primary-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <span aria-hidden="true" className="text-lg leading-none">
                {mobileMenuOpen ? '✖️' : '☰'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden',
          mobileMenuOpen ? 'block' : 'hidden'
        )}>
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  onSignIn()
                  setMobileMenuOpen(false)
                }}
                className="block w-full rounded-md px-3 py-2 text-base font-medium text-primary hover:bg-primary-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onGetStarted()
                  setMobileMenuOpen(false)
                }}
                className="block w-full rounded-md bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

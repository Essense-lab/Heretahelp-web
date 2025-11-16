'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { UserProfile } from '@/types'
import { useAuth } from '@/contexts/auth-context'
import {
  Menu,
  X,
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Wrench,
  MessageSquare,
  CreditCard,
  HelpCircle,
  CalendarClock,
  PhoneCall,
  ClipboardList
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type NavigationMatch =
  | { type: 'equals'; value: string }
  | { type: 'startsWith'; value: string }

export type NavigationItem = {
  name: string
  href: string
  icon: LucideIcon
  emoji?: string
  match?: NavigationMatch
}

interface DashboardLayoutProps {
  children: React.ReactNode
  profile: UserProfile
  userType: 'customer' | 'technician' | 'locksmith' | 'towing' | 'admin'
}

export const navigationItems: Record<string, NavigationItem[]> = {
  customer: [
    {
      name: 'My Requests',
      href: '/tracking',
      icon: ClipboardList,
      emoji: '📋',
      match: { type: 'startsWith', value: '/tracking' },
    },
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home,
      emoji: '🏠',
      match: { type: 'equals', value: '/dashboard' },
    },
    {
      name: 'Schedule',
      href: '/dashboard/schedule',
      icon: CalendarClock,
      emoji: '📅',
      match: { type: 'startsWith', value: '/dashboard/schedule' },
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: PhoneCall,
      emoji: '📞',
      match: { type: 'startsWith', value: '/contact' },
    },
    {
      name: 'Notifications',
      href: '/notification-history',
      icon: Bell,
      emoji: '🔔',
      match: { type: 'startsWith', value: '/notification-history' },
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
      emoji: '👤',
      match: { type: 'startsWith', value: '/dashboard/profile' },
    },
  ],
  technician: [
    { name: 'Dashboard', href: '#', icon: Home },
    { name: 'Available Jobs', href: '#', icon: Search },
    { name: 'My Bids', href: '#', icon: Wrench },
    { name: 'Messages', href: '#', icon: MessageSquare },
    { name: 'Earnings', href: '#', icon: CreditCard },
    { name: 'Profile', href: '#', icon: User },
  ],
  locksmith: [
    { name: 'Dashboard', href: '#', icon: Home },
    { name: 'Available Jobs', href: '#', icon: Search },
    { name: 'My Bids', href: '#', icon: Wrench },
    { name: 'Messages', href: '#', icon: MessageSquare },
    { name: 'Earnings', href: '#', icon: CreditCard },
    { name: 'Profile', href: '#', icon: User },
  ],
  towing: [
    { name: 'Dashboard', href: '#', icon: Home },
    { name: 'Available Jobs', href: '#', icon: Search },
    { name: 'My Bids', href: '#', icon: Wrench },
    { name: 'Messages', href: '#', icon: MessageSquare },
    { name: 'Earnings', href: '#', icon: CreditCard },
    { name: 'Profile', href: '#', icon: User },
  ],
  admin: [
    { name: 'Dashboard', href: '#', icon: Home },
    { name: 'Users', href: '#', icon: User },
    { name: 'Services', href: '#', icon: Wrench },
    { name: 'Messages', href: '#', icon: MessageSquare },
    { name: 'Analytics', href: '#', icon: Search },
    { name: 'Settings', href: '#', icon: Settings },
  ],
}

export const resolveNavItemActive = (pathname: string | null, item: NavigationItem): boolean => {
  if (!pathname) return false

  const match = item.match
  if (!match) {
    return pathname === item.href
  }

  if (match.type === 'equals') {
    return pathname === match.value
  }

  return pathname.startsWith(match.value)
}

export function DashboardLayout({ children, profile, userType }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useAuth()

  const navigation = navigationItems[userType] || navigationItems.customer
  const pathname = usePathname()
  const router = useRouter()
  const navLinks = navigation.map((item) => ({
    ...item,
    active: resolveNavItemActive(pathname, item),
  }))

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">Here Ta Help</span>
            </div>
            <button
              type="button"
              className="rounded-md text-gray-400 hover:text-gray-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-base font-medium',
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                <span className="flex items-center gap-2">
                  {item.emoji && <span aria-hidden>{item.emoji}</span>}
                  {item.name}
                </span>
              </a>
            ))}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-4 h-6 w-6 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">Here Ta Help</span>
            </div>
          </div>
          
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                  item.active
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="flex items-center gap-2">
                  {item.emoji && <span aria-hidden>{item.emoji}</span>}
                  {item.name}
                </span>
              </a>
            ))}
          </nav>
          
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {profile.firstName[0]}{profile.lastName[0]}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {profile.userType.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="lg:hidden rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>

              <nav className="flex items-center gap-2 overflow-x-auto pr-2 text-sm font-medium text-gray-700">
                {navLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'rounded-full border border-gray-200 px-3 py-1 transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                      item.active && 'border-primary text-primary'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {item.emoji && <span aria-hidden>{item.emoji}</span>}
                      {item.name}
                    </span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => router.push('/notification-history')}
                >
                  <Bell className="h-6 w-6" />
                </button>
              </div>
              
              <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <HelpCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

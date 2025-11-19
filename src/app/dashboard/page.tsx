'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import { navigationItems } from '@/components/dashboard/dashboard-layout'
import { cn } from '@/lib/utils'

interface Profile {
  id: string
  firstName: string
  lastName: string
  userType: string
  onboardingCompleted: boolean
  membershipLevel?: string | null
}

interface ServiceCategory {
  emoji: string
  title: string
  subtitle: string
  description: string
}

const NAVY = '#0D1B2A'

const serviceCategories: ServiceCategory[] = [
  {
    emoji: '🚗',
    title: 'Car Repair',
    subtitle: 'Mobile auto repair',
    description: 'Diagnostics, brakes, batteries, fluid checks, and more.',
  },
  {
    emoji: '🚚',
    title: 'Towing',
    subtitle: '24/7 emergency towing',
    description: 'Accident recovery, flatbed transport, and roadside support.',
  },
  {
    emoji: '🔑',
    title: 'Locksmith',
    subtitle: 'Lock & key specialists',
    description: 'Vehicle lockouts, key programming, and ignition repair.',
  },
  {
    emoji: '🛞',
    title: 'Tire Repairs',
    subtitle: 'Flat tire & wheel services',
    description: 'Mobile tire repair, replacement, balancing, and rotations.',
  },
  {
    emoji: '⛵',
    title: 'Boat Repairs',
    subtitle: 'Marine service pros',
    description: 'Engine diagnostics, electrical work, detailing, and hull care.',
  },
  {
    emoji: '🚛',
    title: 'Diesel Truck Repairs',
    subtitle: 'Heavy-duty technicians',
    description: 'Fleet maintenance, diagnostics, and roadside diesel support.',
  },
  {
    emoji: '🧼',
    title: 'Mobile Wash',
    subtitle: 'Detailing at your location',
    description: 'Interior & exterior detailing, ceramic coating, fleet care.',
  },
  {
    emoji: '🏍️',
    title: 'Motorcycle Repair',
    subtitle: 'Two-wheel specialists',
    description: 'Tune-ups, electrical diagnostics, performance upgrades, and more.',
  },
  {
    emoji: '📋',
    title: 'My Requests',
    subtitle: 'Track your jobs',
    description: 'Review active bids, approvals, invoices, and past service history.',
  },
]

export default function CustomerDashboardPage() {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [points, setPoints] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          throw userError
        }

        if (!user) {
          router.replace('/auth/sign-in')
          return
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select(
            `id,
             email,
             first_name,
             last_name,
             user_type,
             onboarding_completed,
             membership_level`
          )
          .eq('id', user.id)
          .maybeSingle()

        if (profileError && (profileError as any).code !== 'PGRST116') {
          // Real error (not "no rows") – surface it
          throw profileError
        }

        let profileRow = data

        // If no profile exists yet, create a default one so the rest of the app can rely on it
        if (!profileRow) {
          const defaultProfile = {
            id: user.id,
            email: user.email,
            first_name: null,
            last_name: null,
            user_type: 'customer',
            onboarding_completed: false,
            membership_level: null,
          }

          const { data: inserted, error: insertError } = await supabase
            .from('profiles')
            .insert(defaultProfile as never)
            .select(
              `id,
               email,
               first_name,
               last_name,
               user_type,
               onboarding_completed,
               membership_level`
            )
            .single()

          if (insertError) {
            // If another request created the profile at the same time, recover by re-loading it
            if ((insertError as any).code === '23505') {
              const { data: existing, error: reselectError } = await supabase
                .from('profiles')
                .select(
                  `id,
                   email,
                   first_name,
                   last_name,
                   user_type,
                   onboarding_completed,
                   membership_level`
                )
                .eq('id', user.id)
                .maybeSingle()

              if (reselectError || !existing) {
                throw reselectError ?? new Error('Unable to load profile after conflict')
              }

              profileRow = existing
            } else {
              throw insertError
            }
          } else if (!inserted) {
            throw new Error('Unable to create profile')
          } else {
            profileRow = inserted
          }
        }

        if (!isMounted) return

        const profilePayload: Profile = {
          id: profileRow.id,
          firstName: profileRow.first_name ?? 'Customer',
          lastName: profileRow.last_name ?? '',
          userType: profileRow.user_type ?? 'CUSTOMER',
          onboardingCompleted: Boolean(profileRow.onboarding_completed),
          membershipLevel: profileRow.membership_level,
        }

        if (isMounted) {
          setProfile(profilePayload)
          if (!profilePayload.onboardingCompleted) {
            router.replace('/onboarding')
            return
          }
        }

        try {
          const { data: pointsData, error: pointsError } = await supabase
            .from('customer_points')
            .select('total_points')
            .eq('customer_id', user.id)
            .maybeSingle()

          if (pointsError) {
            console.warn('Unable to load reward points:', pointsError.message)
          } else if (isMounted && pointsData?.total_points != null) {
            setPoints(pointsData.total_points)
          }
        } catch (pointsException) {
          console.warn('Skipping customer points fetch:', pointsException)
        }
      } catch (loadError: any) {
        console.error('Failed to load dashboard profile:', loadError)
        if (isMounted) {
          setError('Unable to load your dashboard right now. Please try again shortly.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const handleServiceClick = (service: ServiceCategory) => {
    switch (service.title) {
      case 'Car Repair':
        router.push('/dashboard/car-repair?type=car')
        break
      case 'Towing':
        router.push('/towing/onboarding')
        break
      case 'Tire Repairs':
        router.push('/dashboard/car-repair?type=tire')
        break
      case 'Mobile Wash':
        router.push('/dashboard/car-repair?type=wash')
        break
      case 'My Requests':
        router.push('/tracking')
        break
      default:
        router.push(`/services?category=${encodeURIComponent(service.title.toLowerCase())}`)
        break
    }
  }

  const handleViewRewards = () => {
    router.push('/rewards')
  }

  const handleViewNotifications = () => {
    router.push('/notifications')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-lg text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900">We ran into a snag</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.replace('/auth/sign-in')}
            className="w-full rounded-xl bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const normalizedUserType = (profile.userType || 'customer').toLowerCase() as keyof typeof navigationItems
  const navigation = navigationItems[normalizedUserType] ?? navigationItems.customer

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-[#0D1B2A] text-white shadow-md">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-6 py-6 text-center">
          <h1 className="text-2xl font-bold">Here Ta Help</h1>
          <p className="text-sm text-[#C0C0C0]">Mobile Repair Services • Anywhere you need us</p>
        </div>
      </header>

      <div className="sticky top-[96px] z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm font-medium text-gray-700 sm:px-6">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                'rounded-full border border-gray-200 px-3 py-1 transition-colors hover:border-[#0D1B2A] hover:text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A] focus:ring-offset-2'
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

      <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center text-center space-y-3">
            <p className="text-3xl" aria-hidden>
              🔧
            </p>
            <h2 className="text-2xl font-semibold text-[#0D1B2A]">Welcome, {profile.firstName || 'Customer'}!</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Select a service category to request help, view bids, or track your appointments.
            </p>
            {profile.membershipLevel && (
              <span className="rounded-full bg-[#0D1B2A]/5 px-3 py-1 text-xs font-medium text-[#0D1B2A]">
                Membership: {profile.membershipLevel}
              </span>
            )}
          </div>

          {points != null && (
            <div className="mt-6 flex items-center justify-center rounded-2xl bg-[#FFF8DC] px-4 py-3 text-[#B8860B] font-semibold">
              <span className="mr-2 text-xl" aria-hidden>
                ⭐
              </span>
              {points} Reward Points Available
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-[#0D1B2A] p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Rewards Center</h3>
                <p className="mt-1 text-sm text-[#C0C0C0]">
                  Earn points on every completed job and unlock exclusive upgrades.
                </p>
              </div>
              <span className="text-3xl" aria-hidden>
                🎁
              </span>
            </div>
            <button
              onClick={handleViewRewards}
              className="mt-6 w-full rounded-2xl bg-white/15 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              View Rewards & Upgrades
            </button>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#0D1B2A]">Notifications</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Stay on top of new bids, technician messages, and job updates in real time.
                </p>
              </div>
              <span className="text-3xl" aria-hidden>
                🔔
              </span>
            </div>
            <button
              onClick={handleViewNotifications}
              className="mt-6 w-full rounded-2xl border border-[#0D1B2A] py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
            >
              Review Notification History
            </button>
          </article>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#0D1B2A]">Our Services</h3>
            <span className="text-sm text-gray-500">Tap a category to get started</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviceCategories.map((service) => (
              <button
                key={service.title}
                onClick={() => handleServiceClick(service)}
                className="group flex h-full flex-col justify-between rounded-2xl bg-white p-5 text-left shadow hover:-translate-y-1 hover:shadow-lg transition"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" aria-hidden>
                      {service.emoji}
                    </span>
                    <div>
                      <p className="text-base font-semibold text-[#0D1B2A]">{service.title}</p>
                      <p className="text-xs text-gray-500">{service.subtitle}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-[#0D1B2A] group-hover:underline">
                  Explore {service.title}
                  <span className="ml-1" aria-hidden>
                    ➜
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[#0D1B2A]/10 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0D1B2A]">Need help fast?</h3>
          <p className="mt-2 text-sm text-gray-600">
            For urgent roadside assistance or emergency repairs, submit a quick request and our nearest technician will respond immediately.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/services/emergency')}
              className="rounded-xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
            >
              Request Emergency Service
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="rounded-xl border border-[#0D1B2A] px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
            >
              Contact Support
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

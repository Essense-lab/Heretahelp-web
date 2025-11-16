'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Loader2, Eye, EyeOff } from 'lucide-react'

type UserTypeValue =
  | 'CUSTOMER'
  | 'TECHNICIAN'
  | 'LOCKSMITH'
  | 'TOW_TRUCK_DRIVER'
  | 'BOAT_TECHNICIAN'
  | 'DIESEL_TECHNICIAN'
  | 'TIRE_TECHNICIAN'
  | 'MOBILE_WASH_TECHNICIAN'
  | 'MOTORCYCLE_TECHNICIAN'

const BRAND_BACKGROUND = 'bg-[#0D1B2A]'
const BRAND_CARD = 'bg-white'
const BRAND_PRIMARY = '#0D1B2A'
const MAN_ICON_SRC = '/branding/manicon.png'

const technicianSpecialties = [
  { emoji: '🚗', label: 'Car Repair' },
  { emoji: '⛵', label: 'Boat Repair' },
  { emoji: '🚛', label: 'Diesel Truck' },
  { emoji: '🛞', label: 'Tire Services' },
  { emoji: '🔑', label: 'Locksmith Services' },
  { emoji: '🚚', label: 'Towing Services' },
  { emoji: '🧼', label: 'Mobile Wash' },
  { emoji: '🏍️', label: 'Motorcycle Repair' },
]

const userTypeOptions: Array<{
  value: UserTypeValue
  title: string
  description: string
  emoji: string
}> = [
  { value: 'CUSTOMER', title: 'Customer', description: 'Need services', emoji: '🚗' },
  { value: 'TECHNICIAN', title: 'Technician', description: 'Provide services', emoji: '🔧' },
  { value: 'LOCKSMITH', title: 'Locksmith', description: 'Lock & key expert', emoji: '🔑' },
  { value: 'TOW_TRUCK_DRIVER', title: 'Tow Operator', description: '24/7 towing', emoji: '🚚' },
  { value: 'BOAT_TECHNICIAN', title: 'Boat Tech', description: 'Marine specialist', emoji: '⛵' },
  { value: 'DIESEL_TECHNICIAN', title: 'Diesel Tech', description: 'Heavy duty', emoji: '🚛' },
  { value: 'TIRE_TECHNICIAN', title: 'Tire Tech', description: 'Tire services', emoji: '🛞' },
  { value: 'MOBILE_WASH_TECHNICIAN', title: 'Mobile Wash', description: 'Detailing & wash pros', emoji: '🧼' },
  { value: 'MOTORCYCLE_TECHNICIAN', title: 'Motorcycle Repair', description: 'Two-wheel specialists', emoji: '🏍️' },
]

const userTypeLabelMap: Record<UserTypeValue, string> = {
  CUSTOMER: 'customer',
  TECHNICIAN: 'technician',
  LOCKSMITH: 'locksmith',
  TOW_TRUCK_DRIVER: 'tow truck driver',
  BOAT_TECHNICIAN: 'boat technician',
  DIESEL_TECHNICIAN: 'diesel technician',
  TIRE_TECHNICIAN: 'tire technician',
  MOBILE_WASH_TECHNICIAN: 'mobile wash technician',
  MOTORCYCLE_TECHNICIAN: 'motorcycle technician',
}

export default function SignUpPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])

  const [userType, setUserType] = useState<UserTypeValue>('CUSTOMER')
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set())

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [referralCode, setReferralCode] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLocating, setIsLocating] = useState(false)

  const toggleSpecialty = (label: string) => {
    setSelectedSpecialties((previous) => {
      const next = new Set(previous)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  const mapUserTypeForProfile = useCallback(
    (value: UserTypeValue) => userTypeLabelMap[value] ?? 'customer',
    []
  )

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Location services are not supported in this browser')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { 'User-Agent': 'HereTaHelp-Web/1.0' } }
          )
          if (!response.ok) throw new Error('Failed to fetch address details')
          const data = await response.json()

          const addressLine = data.address
          setAddress(
            addressLine?.road
              ? [addressLine.house_number, addressLine.road].filter(Boolean).join(' ')
              : data.display_name?.split(',').slice(0, 2).join(', ') ?? ''
          )
          setCity(addressLine?.city || addressLine?.town || addressLine?.village || '')
          setState(addressLine?.state || '')
          setZipCode(addressLine?.postcode || '')
          toast.success('Location filled in for you!')
        } catch (error: any) {
          console.error(error)
          toast.error(error?.message ?? 'Unable to fetch location details')
        } finally {
          setIsLocating(false)
        }
      },
      (error) => {
        console.error(error)
        toast.error('Unable to access your location')
        setIsLocating(false)
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    switch (true) {
      case !firstName || !lastName || !email || !password || !confirmPassword || !address || !city || !state || !zipCode: {
        setErrorMessage('Please complete all required fields')
        return
      }
      case userType === 'TECHNICIAN' && selectedSpecialties.size === 0: {
        setErrorMessage('Please select at least one service you provide')
        return
      }
      case password.length < 6: {
        setErrorMessage('Password must be at least 6 characters long')
        return
      }
      case password !== confirmPassword: {
        setErrorMessage('Passwords do not match')
        return
      }
      default:
        setErrorMessage('')
    }

    setIsLoading(true)

    try {
      const userMetadata = {
        firstName,
        lastName,
        phoneNumber,
        userType,
        userTypeLabel: mapUserTypeForProfile(userType),
        specialties: Array.from(selectedSpecialties),
        referralCode: referralCode.trim() || null,
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userMetadata,
        },
      })

      if (error) {
        setErrorMessage(error.message ?? 'Failed to create account')
        return
      }

      const userId = data.user?.id
      if (!userId) {
        toast('Account created. Please check your email to confirm your account.', { icon: '📬' })
        router.push('/auth/sign-in')
        return
      }

      const profilePayload = {
        id: userId,
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`,
        email,
        user_type: mapUserTypeForProfile(userType),
        phone_number: phoneNumber || null,
        address,
        city,
        state,
        zip_code: zipCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: profileError } = await supabase.from('profiles').insert(profilePayload)
      if (profileError) {
        console.error(profileError)
        toast.error('Profile creation failed, but account was created. Please contact support.')
      }

      toast.success('Account created successfully! Please sign in to continue.')
      router.push('/auth/sign-in')
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error?.message ?? 'Sign-up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const isTechnician = userType === 'TECHNICIAN'
  const showReferralCode = userType === 'CUSTOMER'

  return (
    <div className={`min-h-screen ${BRAND_BACKGROUND} flex flex-col items-center justify-center px-4 py-10 text-white`}>
      <div className="w-full max-w-3xl space-y-6">
        <header className="flex flex-col items-center space-y-4">
          <div className="relative h-16 w-44">
            <Image src={MAN_ICON_SRC} alt="HereTaHelp" fill className="object-contain" priority />
          </div>

          <div className="flex items-center text-sm font-semibold text-white">
            <button
              className="rounded-full px-4 py-1 hover:bg-white/10 transition"
              onClick={() => router.push('/auth/sign-in')}
            >
              Sign In
            </button>
            <span className="px-3 text-[#B3D4FC]">|</span>
            <button className="rounded-full bg-white/15 px-4 py-1" onClick={() => router.replace('/auth/sign-up')}>
              Sign Up
            </button>
          </div>
        </header>

        <main>
          <div className={`rounded-3xl ${BRAND_CARD} text-gray-900 shadow-2xl`}>
            <form onSubmit={handleSubmit} className="space-y-6 px-8 py-10">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[#0D1B2A]">Create Account</h1>
                <p className="text-sm text-gray-600">
                  Join thousands of customers and technicians using HereTaHelp to solve automotive needs.
                </p>
              </div>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {userTypeOptions.map((option) => {
                  const isActive = userType === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setUserType(option.value)
                        if (option.value !== 'TECHNICIAN') {
                          setSelectedSpecialties(new Set())
                        }
                      }}
                      className={`flex h-full w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        isActive
                          ? 'border-transparent bg-[#0D1B2A] text-white shadow-lg'
                          : 'border-gray-200 bg-white text-gray-900 hover:border-[#0D1B2A]/40'
                      }`}
                    >
                      <span className="text-2xl" aria-hidden>{option.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold">{option.title}</p>
                        <p className="text-xs text-white/80 sm:text-[13px]">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </section>

              {isTechnician && (
                <section className="rounded-2xl border border-[#0D1B2A]/20 bg-[#0D1B2A]/5 p-4">
                  <p className="text-sm font-semibold text-[#0D1B2A]">
                    Select the services you provide
                  </p>
                  <p className="text-xs text-[#0D1B2A]/70">
                    You can choose one or multiple specialties.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {technicianSpecialties.map(({ emoji, label }) => {
                      const isActive = selectedSpecialties.has(label)
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleSpecialty(label)}
                          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                            isActive
                              ? 'border-transparent bg-[#0D1B2A] text-white shadow'
                              : 'border-[#0D1B2A]/30 text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                          }`}
                        >
                          <span className="text-lg" aria-hidden>{emoji}</span>
                          {label}
                        </button>
                      )
                    })}
                  </div>
                  {selectedSpecialties.size === 0 && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      Please select at least one specialty.
                    </p>
                  )}
                </section>
              )}

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-medium">
                  <span>First Name</span>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  />
                </label>
                <label className="space-y-1 text-sm font-medium">
                  <span>Last Name</span>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  />
                </label>
              </section>

              <label className="space-y-1 text-sm font-medium">
                <span>Email</span>
                <input
                  value={email}
                  type="email"
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                />
              </label>

              <label className="space-y-1 text-sm font-medium">
                <span>Phone Number (optional)</span>
                <input
                  value={phoneNumber}
                  type="tel"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  placeholder="(555) 123-4567"
                />
              </label>

              {showReferralCode && (
                <label className="space-y-1 text-sm font-medium">
                  <span>Referral Code (optional)</span>
                  <input
                    value={referralCode}
                    onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                    placeholder="Enter friend's code"
                  />
                  {referralCode && (
                    <p className="text-xs text-[#0D1B2A]">
                      🎁 Referral rewards include points on signup and first job completion.
                    </p>
                  )}
                </label>
              )}

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#0D1B2A]">Location</p>
                    <p className="text-xs text-[#0D1B2A]/70">
                      Enter your address or we can fill it in automatically.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
                  >
                    {isLocating ? 'Locating…' : '📍 Use current location'}
                  </button>
                </div>

                <label className="space-y-1 text-sm font-medium">
                  <span>Street Address</span>
                  <input
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    required
                    placeholder="123 Main Street"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  />
                </label>

                <label className="space-y-1 text-sm font-medium">
                  <span>City</span>
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                  />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="space-y-1 text-sm font-medium">
                    <span>State</span>
                    <input
                      value={state}
                      onChange={(event) => setState(event.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                      placeholder="CA"
                    />
                  </label>
                  <label className="space-y-1 text-sm font-medium">
                    <span>ZIP Code</span>
                    <input
                      value={zipCode}
                      onChange={(event) => setZipCode(event.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                      placeholder="94105"
                    />
                  </label>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm font-medium">
                  <span>Password</span>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      type={passwordVisible ? 'text' : 'password'}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                    >
                      {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>

                <label className="space-y-1 text-sm font-medium">
                  <span>Confirm Password</span>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/20"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      aria-label={confirmPasswordVisible ? 'Hide password' : 'Show password'}
                    >
                      {confirmPasswordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </label>
              </section>

              {errorMessage && (
                <p className="text-sm font-semibold text-red-600">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-[#0D1B2A] py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-sm text-white">
            Already have an account?{' '}
            <Link href="/auth/sign-in" className="font-semibold text-[#B3D4FC] hover:underline">
              Sign in instead
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

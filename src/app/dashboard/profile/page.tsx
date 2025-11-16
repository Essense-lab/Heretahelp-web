"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import Link from "next/link"
import { navigationItems, resolveNavItemActive } from "@/components/dashboard/dashboard-layout"

interface ProfileSummary {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
  membershipLevel?: string | null
  customerTier?: string | null
  totalJobsCompleted?: number | null
  membershipStartDate?: string | null
  membershipEndDate?: string | null
  profilePictureUrl?: string | null
  onboardingCompleted?: boolean
}

const NAVY = "#0D1B2A"

export default function CustomerProfilePage() {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = typeof window !== "undefined" ? window.location.pathname : null

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError
        if (!user) {
          router.replace("/auth/sign-in")
          return
        }

        const { data, error: profileError } = await supabase
          .from("profiles")
          .select(
            `id,
             email,
             first_name,
             last_name,
             phone_number,
             membership_level,
             customer_tier,
             total_jobs_completed,
             membership_start_date,
             membership_end_date,
             profile_picture_url,
             onboarding_completed`
          )
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) throw profileError
        if (!data) throw new Error("Profile not found")

        if (!isMounted) return

        setProfile({
          id: data.id,
          firstName: data.first_name ?? "Customer",
          lastName: data.last_name ?? "",
          email: data.email ?? user.email ?? "",
          phoneNumber: data.phone_number,
          membershipLevel: data.membership_level,
          customerTier: data.customer_tier,
          totalJobsCompleted: data.total_jobs_completed,
          membershipStartDate: data.membership_start_date,
          membershipEndDate: data.membership_end_date,
          profilePictureUrl: data.profile_picture_url,
          onboardingCompleted: Boolean(data.onboarding_completed),
        })
      } catch (loadError: any) {
        console.error("Failed to load profile page:", loadError)
        if (isMounted) setError(loadError?.message ?? "Unable to load your profile right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()
    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.replace("/auth/sign-in")
    } catch (signOutError) {
      console.error("Error signing out:", signOutError)
    }
  }

  const formatDate = (value?: string | null) => {
    if (!value) return "Not set"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-lg text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900">We ran into a snag</h1>
          <p className="text-gray-600">{error ?? "Profile data is unavailable."}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-xl bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const initials = `${profile.firstName.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`.trim() || "HTH"
  const navLinks = (navigationItems.customer || []).map((item) => ({
    ...item,
    active: resolveNavItemActive(pathname, item),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-[#0D1B2A] text-white shadow-md">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-6 text-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-[#C0C0C0]">Manage your account details and membership</p>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm font-medium text-gray-700">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-full border px-3 py-1 transition-colors hover:border-[#0D1B2A] hover:text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A] focus:ring-offset-2 ${
                item.active ? "border-[#0D1B2A] text-[#0D1B2A]" : "border-gray-200"
              }`}
            >
              <span className="flex items-center gap-2">
                {item.emoji && <span aria-hidden>{item.emoji}</span>}
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
        <section className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#0D1B2A]/10 bg-[#0D1B2A]/5">
              {profile.profilePictureUrl ? (
                <Image
                  src={profile.profilePictureUrl}
                  alt="Profile picture"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-[#0D1B2A]">
                  {initials}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-[#0D1B2A]">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
              {profile.phoneNumber && <p className="text-sm text-gray-600">📞 {profile.phoneNumber}</p>}
              <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.membershipLevel && (
                  <span className="rounded-full bg-[#0D1B2A]/10 px-3 py-1 text-xs font-semibold text-[#0D1B2A]">
                    Membership: {profile.membershipLevel}
                  </span>
                )}
                {profile.customerTier && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                    Tier: {profile.customerTier}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border[#0D1B2A]/10 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0D1B2A]">
              <span aria-hidden>📅</span> Membership details
            </h3>
            <dl className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <dt>Level</dt>
                <dd>{profile.membershipLevel ?? "Basic"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Start date</dt>
                <dd>{formatDate(profile.membershipStartDate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Renewal</dt>
                <dd>{formatDate(profile.membershipEndDate)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Jobs completed</dt>
                <dd>{profile.totalJobsCompleted ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Onboarding</dt>
                <dd>{profile.onboardingCompleted ? "Complete" : "In progress"}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-3xl border border[#0D1B2A]/10 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-[#0D1B2A]">
              <span aria-hidden>🔐</span> Account actions
            </h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>Update your contact details, manage notifications, or sign out securely.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => router.push("/contact")}
                  className="flex-1 rounded-xl border border-[#0D1B2A]/30 px-4 py-2 font-semibold text-[#0D1B2A] transition hover:border-[#0D1B2A]/60"
                >
                  Contact support
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex-1 rounded-xl bg-[#0D1B2A] px-4 py-2 font-semibold text-white transition hover:bg-[#0A1625]"
                >
                  Sign out
                </button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

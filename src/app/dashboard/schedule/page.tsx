"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { navigationItems, resolveNavItemActive } from "@/components/dashboard/dashboard-layout"
import { createSupabaseClient } from "@/lib/supabase"

const NAVY = "#0D1B2A"

const STATUS_STYLES: Record<string, { icon: string; label: string; text: string; bg: string }> = {
  SCHEDULED: {
    icon: "📅",
    label: "Scheduled",
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
  CONFIRMED: {
    icon: "✅",
    label: "Confirmed",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  REASSIGNING: {
    icon: "🔄",
    label: "Re-assigning",
    text: "text-red-700",
    bg: "bg-red-50",
  },
  EN_ROUTE: {
    icon: "🚗",
    label: "Technician en route",
    text: "text-orange-700",
    bg: "bg-orange-50",
  },
  ARRIVED: {
    icon: "📍",
    label: "Technician arrived",
    text: "text-purple-700",
    bg: "bg-purple-50",
  },
  IN_PROGRESS: {
    icon: "🔧",
    label: "In progress",
    text: "text-sky-700",
    bg: "bg-sky-50",
  },
  COMPLETED: {
    icon: "✔️",
    label: "Completed",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  CANCELLED: {
    icon: "❌",
    label: "Cancelled",
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
}

interface ScheduleAppointment {
  id: string
  serviceName: string
  appointmentDate: string
  timeSlot: string
  status: string
  technicianName: string | null
  technicianPhotoUrl: string | null
  serviceAddress: string | null
  serviceCity: string | null
  serviceState: string | null
  serviceZipCode: string | null
  estimatedPrice: number | null
  finalPrice: number | null
}

export default function SchedulePage() {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = (navigationItems.customer || []).map((item) => ({
    ...item,
    active: resolveNavItemActive(pathname, item),
  }))

  const [upcoming, setUpcoming] = useState<ScheduleAppointment | null>(null)
  const [completed, setCompleted] = useState<ScheduleAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSchedule = async () => {
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

        const { data, error: appointmentsError } = await supabase
          .from("service_appointments")
          .select(
            `id,
             service_name,
             appointment_date,
             time_slot,
             status,
             technician_name,
             technician_photo_url,
             service_address,
             service_city,
             service_state,
             service_zip_code,
             estimated_price,
             final_price`
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (appointmentsError) throw appointmentsError

        if (!isMounted) return

        const mapped = (data || []).map((apt) => ({
          id: apt.id,
          serviceName: apt.service_name ?? "Service",
          appointmentDate: apt.appointment_date ?? "",
          timeSlot: apt.time_slot ?? "",
          status: apt.status ?? "SCHEDULED",
          technicianName: apt.technician_name,
          technicianPhotoUrl: apt.technician_photo_url,
          serviceAddress: apt.service_address,
          serviceCity: apt.service_city,
          serviceState: apt.service_state,
          serviceZipCode: apt.service_zip_code,
          estimatedPrice: apt.estimated_price,
          finalPrice: apt.final_price,
        }))

        const activeStatuses = [
          "SCHEDULED",
          "CONFIRMED",
          "REASSIGNING",
          "EN_ROUTE",
          "ARRIVED",
          "IN_PROGRESS",
        ]

        const upcomingAppointment = mapped.find((apt) => activeStatuses.includes(apt.status)) ?? null
        const completedAppointments = mapped.filter((apt) => apt.status === "COMPLETED")

        setUpcoming(upcomingAppointment)
        setCompleted(completedAppointments)
      } catch (loadError: any) {
        console.error("Failed to load schedule page:", loadError)
        if (isMounted) setError(loadError?.message ?? "Unable to load your schedule right now.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadSchedule()
    return () => {
      isMounted = false
    }
  }, [router, supabase])

  const formatDisplayDate = (date: string) => {
    if (!date) return "Date pending"
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return date
    return parsed.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
  }

  const formatPrice = (value: number | null) => {
    if (value == null) return "—"
    return `$${value.toFixed(2)}`
  }

  const formatTimeWindow = (slot: string) => {
    if (!slot) return "Pending"
    return slot
  }

  const renderStatusBanner = (status: string) => {
    const meta = STATUS_STYLES[status] ?? STATUS_STYLES.SCHEDULED
    return (
      <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${meta.bg} ${meta.text}`}>
        <span aria-hidden>{meta.icon}</span>
        {meta.label}
      </div>
    )
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
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-xl bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-[#0D1B2A] text-white shadow-md">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-6 text-center">
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-sm text-[#C0C0C0]">Track upcoming appointments and view your completed services</p>
        </div>
      </header>

      <div className="border-b border-gray-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm font-medium text-gray-700">
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

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        {upcoming ? (
          <section className="space-y-4 rounded-3xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-[#0D1B2A]">Upcoming appointment</h2>
              {renderStatusBanner(upcoming.status)}
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Service</p>
                  <p className="text-lg font-semibold text-[#0D1B2A]">{upcoming.serviceName}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-800">{formatDisplayDate(upcoming.appointmentDate)}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Time</p>
                    <p className="mt-1 text-sm text-gray-800">{upcoming.timeSlot || "Pending"}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Estimated price</p>
                    <p className="mt-1 text-sm text-gray-800">{formatPrice(upcoming.estimatedPrice)}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Final price</p>
                    <p className="mt-1 text-sm text-gray-800">{formatPrice(upcoming.finalPrice)}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Service location</p>
                  <p className="mt-1 text-sm text-gray-800 whitespace-pre-line">
                    {upcoming.serviceAddress ? `${upcoming.serviceAddress}\n` : ""}
                    {[upcoming.serviceCity, upcoming.serviceState, upcoming.serviceZipCode]
                      .filter(Boolean)
                      .join(", ") || "Provided after booking"}
                  </p>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-4">
                <div className="rounded-3xl border border-[#0D1B2A]/10 bg-[#0D1B2A]/5 p-5 text-center">
                  <p className="text-sm font-semibold text-[#0D1B2A]">Your technician</p>
                  <div className="mt-4 flex flex-col items-center gap-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow">
                      {upcoming.technicianPhotoUrl ? (
                        <Image
                          src={upcoming.technicianPhotoUrl}
                          alt={upcoming.technicianName ?? "Technician"}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl" aria-hidden>
                          🔧
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#0D1B2A]">
                        {upcoming.technicianName ?? "Assigned soon"}
                      </p>
                      <p className="text-xs text-gray-600">
                        We’ll notify you if anything changes before the appointment.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 p-5 text-sm text-gray-600">
                  <p className="font-semibold text-[#0D1B2A]">Need to adjust anything?</p>
                  <p className="mt-2">
                    Contact support to reschedule or update your appointment details. Short-notice changes may affect
                    technician availability.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 inline-flex items-center justify-center rounded-xl border border-[#0D1B2A] px-4 py-2 font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
                  >
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-[#0D1B2A]/30 bg-white p-10 text-center text-gray-600">
            <div className="text-5xl" aria-hidden>
              📅
            </div>
            <h2 className="mt-3 text-xl font-semibold text-[#0D1B2A]">No scheduled services</h2>
            <p className="mt-2 text-sm">
              When you book a service, it will appear here with live status updates and technician details.
            </p>
            <Link
              href="/dashboard/car-repair?type=car"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
            >
              Book a service
            </Link>
          </section>
        )}

        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0D1B2A]">Completed services</h2>
            <span className="text-sm text-gray-500">
              {completed.length > 0 ? `${completed.length} total` : "None yet"}
            </span>
          </div>

          {completed.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              You haven’t completed any appointments yet. Finished jobs will appear here with full receipts.
            </div>
          ) : (
            <div className="space-y-4">
              {completed.map((apt) => (
                <article
                  key={apt.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-500">{formatDisplayDate(apt.appointmentDate)}</p>
                      <h3 className="text-lg font-semibold text-[#0D1B2A]">{apt.serviceName}</h3>
                      <p className="text-sm text-gray-600">Technician: {apt.technicianName ?? "Not listed"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <p>Paid: {formatPrice(apt.finalPrice ?? apt.estimatedPrice)}</p>
                        <p>Scheduled for: {formatTimeWindow(apt.timeSlot)}</p>
                      </div>
                      <div className="hidden sm:block">
                        <span className="text-2xl" aria-hidden>
                          ✔️
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

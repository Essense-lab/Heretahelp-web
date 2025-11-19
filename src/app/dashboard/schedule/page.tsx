"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { navigationItems, resolveNavItemActive } from "@/components/dashboard/dashboard-layout"
import { createSupabaseClient } from "@/lib/supabase"
import { geocodeAddress } from "@/lib/geocode"
import { AppointmentRepository } from "@/lib/repositories/appointment-repository"
import { LiveTrackingStatus } from "./live-tracking-status"
import { LiveTrackingMap } from "./live-tracking-map"

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

const ACTIVE_APPOINTMENT_STATUSES = ["SCHEDULED", "CONFIRMED", "REASSIGNING", "EN_ROUTE", "ARRIVED", "IN_PROGRESS"]

const APPOINTMENT_SELECT = `
  id,
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
  final_price,
  service_latitude,
  service_longitude,
  technician_latitude,
  technician_longitude
`

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
  serviceLatitude: number | null
  serviceLongitude: number | null
  technicianLatitude: number | null
  technicianLongitude: number | null
}

const mapAppointments = (rows: any[]): ScheduleAppointment[] => {
  return (rows || []).map((apt) => ({
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
    serviceLatitude: typeof apt.service_latitude === "number" ? apt.service_latitude : null,
    serviceLongitude: typeof apt.service_longitude === "number" ? apt.service_longitude : null,
    technicianLatitude: typeof apt.technician_latitude === "number" ? apt.technician_latitude : null,
    technicianLongitude: typeof apt.technician_longitude === "number" ? apt.technician_longitude : null,
  }))
}

const formatDisplayDate = (date: string) => {
  if (!date) return "Date pending"
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
}

const formatPrice = (value: number | null | undefined) => {
  if (value == null) return "—"
  return `$${value.toFixed(2)}`
}

const formatTimeWindow = (slot: string) => {
  if (!slot) return "Pending"
  return slot
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
  const [derivedServiceCoords, setDerivedServiceCoords] = useState<Record<string, { latitude: number; longitude: number }>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const applyScheduleState = useCallback(
    ({ userId, rows }: { userId: string; rows: any[] }) => {
      setCurrentUserId(userId)
      const mapped = mapAppointments(rows)
      const upcomingAppointment =
        mapped.find((apt) => ACTIVE_APPOINTMENT_STATUSES.includes(apt.status)) ?? null
      const completedAppointments = mapped.filter((apt) => apt.status === "COMPLETED")
      setUpcoming(upcomingAppointment)
      setCompleted(completedAppointments)
      setDerivedServiceCoords((previous) => {
        if (!Object.keys(previous).length) return previous
        const retained: Record<string, { latitude: number; longitude: number }> = {}
        mapped.forEach((apt) => {
          if (previous[apt.id]) {
            retained[apt.id] = previous[apt.id]
          }
        })
        return retained
      })
    },
    []
  )

  const loadSchedule = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) {
      router.replace("/auth/sign-in")
      return null
    }

    const { data, error: appointmentsError } = await supabase
      .from("service_appointments")
      .select(APPOINTMENT_SELECT)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (appointmentsError) throw appointmentsError

    return { userId: user.id, rows: data ?? [] }
  }, [router, supabase])

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    loadSchedule()
      .then((result) => {
        if (!isMounted || !result) return
        applyScheduleState(result)
        setError(null)
      })
      .catch((loadError: any) => {
        console.error("Failed to load schedule page:", loadError)
        if (isMounted) {
          setError(loadError?.message ?? "Unable to load your schedule right now.")
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [applyScheduleState, loadSchedule])

  const refreshAppointments = useCallback(async () => {
    try {
      const result = await loadSchedule()
      if (result) {
        applyScheduleState(result)
        setError(null)
      }
    } catch (refreshError: any) {
      console.error("Failed to refresh schedule:", refreshError)
      setError(refreshError?.message ?? "Unable to refresh your schedule right now.")
    }
  }, [applyScheduleState, loadSchedule])

  const handleCancelAppointment = async () => {
    if (!upcoming || !currentUserId) return
    setActionLoading(true)
    setActionError(null)
    setActionMessage(null)

    try {
      const repository = new AppointmentRepository(supabase)
      await repository.cancelAppointment({
        appointmentId: upcoming.id,
        cancelledBy: currentUserId,
        reason: "Cancelled by customer",
        cancellationFee: 25,
      })
      setActionMessage("Your appointment was cancelled. A $25 fee was applied to cover technician travel.")
      setShowCancelDialog(false)
      await refreshAppointments()
    } catch (cancelError: any) {
      console.error("Failed to cancel appointment:", cancelError)
      setActionError(cancelError?.message ?? "Failed to cancel appointment. Please try again.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleRescheduleAppointment = async () => {
    if (!upcoming || !currentUserId) return
    setActionLoading(true)
    setActionError(null)
    setActionMessage(null)

    try {
      const repository = new AppointmentRepository(supabase)
      const { creditAmount } = await repository.rescheduleAppointment({
        appointmentId: upcoming.id,
        userId: currentUserId,
        rescheduleFee: 25,
      })
      const formattedCredit = creditAmount > 0 ? creditAmount.toFixed(2) : "0.00"
      setActionMessage(
        `We cancelled your appointment and added $${formattedCredit} in credit after the $25 reschedule fee. You can apply it to your next booking.`
      )
      setShowRescheduleDialog(false)
      await refreshAppointments()
      router.push("/dashboard/car-repair?type=car")
    } catch (rescheduleError: any) {
      console.error("Failed to reschedule appointment:", rescheduleError)
      setActionError(rescheduleError?.message ?? "Failed to reschedule appointment. Please try again.")
    } finally {
      setActionLoading(false)
    }
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

  useEffect(() => {
    if (!upcoming) return
    if (upcoming.serviceLatitude != null && upcoming.serviceLongitude != null) return
    if (!upcoming.serviceAddress || !upcoming.serviceCity || !upcoming.serviceState || !upcoming.serviceZipCode) return

    let cancelled = false

    const geocode = async () => {
      const coords = await geocodeAddress({
        street: upcoming.serviceAddress!,
        city: upcoming.serviceCity!,
        state: upcoming.serviceState!,
        zipCode: upcoming.serviceZipCode!,
      })

      if (!coords || cancelled) return

      setDerivedServiceCoords((previous) => ({
        ...previous,
        [upcoming.id]: coords,
      }))

      try {
        await supabase
          .from("service_appointments")
          .update({
            service_latitude: coords.latitude,
            service_longitude: coords.longitude,
          } as never)
          .eq("id", upcoming.id)
      } catch (updateError) {
        console.warn("Unable to persist service coordinates:", updateError)
      }
    }

    geocode()

    return () => {
      cancelled = true
    }
  }, [supabase, upcoming])

  const renderLiveTracking = (appointment: ScheduleAppointment) => {
    if (appointment.status !== "EN_ROUTE") return null

    const serviceCoords =
      appointment.serviceLatitude != null && appointment.serviceLongitude != null
        ? { latitude: appointment.serviceLatitude, longitude: appointment.serviceLongitude }
        : derivedServiceCoords[appointment.id]

    const hasServiceLocation = Boolean(serviceCoords)
    const hasTechLocation =
      appointment.technicianLatitude != null && appointment.technicianLongitude != null

    return (
      <div className="mt-6 space-y-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
        <p className="text-sm font-semibold text-sky-800 flex items-center gap-2">
          <span aria-hidden>🚗</span>
          Live technician tracking
        </p>
        <p className="text-xs text-sky-900/80">
          {hasServiceLocation
            ? "Technician location is updated every few seconds while they are en route."
            : "Technician location is updated every few seconds while they are en route. Service coordinates are still being determined, so the map is centered on the technician until we finish geocoding your address."}
        </p>
        {hasTechLocation && (
          <LiveTrackingMap
            serviceLatitude={serviceCoords?.latitude}
            serviceLongitude={serviceCoords?.longitude}
            technicianLatitude={appointment.technicianLatitude!}
            technicianLongitude={appointment.technicianLongitude!}
          />
        )}
        <LiveTrackingStatus appointmentId={appointment.id} />
      </div>
    )
  }

  const canModifyAppointment = Boolean(
    upcoming && !["CANCELLED", "COMPLETED", "NO_SHOW"].includes(upcoming.status)
  )

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
        {(actionMessage || actionError) && (
          <div className="space-y-3">
            {actionMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {actionMessage}
              </div>
            )}
            {actionError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {actionError}
              </div>
            )}
          </div>
        )}
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

              {canModifyAppointment && (
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActionMessage(null)
                      setActionError(null)
                      setShowRescheduleDialog(true)
                    }}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#0D1B2A] px-6 py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reschedule
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActionMessage(null)
                      setActionError(null)
                      setShowCancelDialog(true)
                    }}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-semibold text-rose-600 transition hover:border-rose-500 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel service
                  </button>
                </div>
              )}

              {renderLiveTracking(upcoming)}
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

      {showCancelDialog && upcoming && (
        <CancelAppointmentDialog
          appointment={upcoming}
          loading={actionLoading}
          onConfirm={handleCancelAppointment}
          onCancel={() => {
            if (!actionLoading) setShowCancelDialog(false)
          }}
        />
      )}

      {showRescheduleDialog && upcoming && (
        <RescheduleAppointmentDialog
          appointment={upcoming}
          loading={actionLoading}
          onConfirm={handleRescheduleAppointment}
          onCancel={() => {
            if (!actionLoading) setShowRescheduleDialog(false)
          }}
        />
      )}
    </div>
  )
}

function CancelAppointmentDialog({
  appointment,
  loading,
  onConfirm,
  onCancel,
}: {
  appointment: ScheduleAppointment
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  const cancellationFee = 25
  const originalAmount = appointment.finalPrice ?? appointment.estimatedPrice ?? 0
  const refundAmount = Math.max(originalAmount - cancellationFee, 0)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-left shadow-2xl space-y-4">
        <div className="text-center text-4xl" aria-hidden>
          ⚠️
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold text-[#0D1B2A]">Cancel appointment?</h3>
          <p className="text-sm text-gray-600">
            Cancelling less than 24 hours before your scheduled time incurs a $25 fee to cover technician travel.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold text-amber-700">Cancellation policy</p>
          <p className="mt-2">A $25 cancellation fee will be deducted from your original payment.</p>
        </div>

        {originalAmount > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span>Original amount</span>
              <span className="font-semibold">${originalAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cancellation fee</span>
              <span className="font-semibold text-rose-600">- $25.00</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2">
              <span>Refund to your payment method</span>
              <span className="font-semibold">${refundAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Keep appointment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Cancel service"}
          </button>
        </div>
      </div>
    </div>
  )
}

function RescheduleAppointmentDialog({
  appointment,
  loading,
  onConfirm,
  onCancel,
}: {
  appointment: ScheduleAppointment
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-left shadow-2xl space-y-4">
        <div className="text-center text-4xl" aria-hidden>
          📅
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-bold text-[#0D1B2A]">Reschedule appointment?</h3>
          <p className="text-sm text-gray-600">
            We’ll cancel your current slot, apply a $25 rescheduling fee, and add the remaining balance as credit you can
            use when you book again.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-2">
          <p className="font-semibold text-amber-700">Rescheduling policy</p>
          <p>A $25 rescheduling fee will be charged.</p>
          <p>You’ll go through the full booking flow again to select a new time.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-gray-800">{appointment.serviceName}</p>
          <p className="mt-1 text-xs text-gray-500">
            Current: {formatDisplayDate(appointment.appointmentDate)} · {formatTimeWindow(appointment.timeSlot)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Keep appointment
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Reschedule appointment"}
          </button>
        </div>
      </div>
    </div>
  )
}

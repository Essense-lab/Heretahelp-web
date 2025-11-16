"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { navigationItems, resolveNavItemActive } from "@/components/dashboard/dashboard-layout"

const STATUS_META: Record<string, { icon: string; label: string; bg: string; text: string }> = {
  ACTIVE: {
    icon: "📋",
    label: "Active",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  OPEN: {
    icon: "📋",
    label: "Active",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  REQUESTED: {
    icon: "📋",
    label: "Active",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  IN_PROGRESS: {
    icon: "🔧",
    label: "In progress",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  ASSIGNED: {
    icon: "🤝",
    label: "Technician assigned",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  ACCEPTED: {
    icon: "🤝",
    label: "Bid accepted",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  CONFIRMED: {
    icon: "✅",
    label: "Confirmed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  EN_ROUTE: {
    icon: "🚗",
    label: "Technician en route",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },
  ARRIVED: {
    icon: "📍",
    label: "Technician arrived",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
  },
  SCHEDULED: {
    icon: "🗓️",
    label: "Scheduled",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  REVIEW_PENDING: {
    icon: "⭐",
    label: "Awaiting review",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  COMPLETED: {
    icon: "✔️",
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  FULFILLED: {
    icon: "✔️",
    label: "Completed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  CLOSED: {
    icon: "✔️",
    label: "Closed",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  CANCELLED: {
    icon: "❌",
    label: "Cancelled",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
}

type TabKey = "active" | "progress" | "completed"

interface BidStats {
  total: number
  pending: number
  accepted?: {
    technicianName: string
    amount: number
  }
}

interface CombinedRequest {
  id: string
  source: "repair" | "towing"
  customerId: string
  serviceCategory: string
  serviceSubcategory: string
  serviceSpecification?: string
  vehicleSummary: string
  locationCity: string
  locationState: string
  dropoffCity?: string
  dropoffState?: string
  distanceMiles?: number | null
  urgencyLevel?: string | null
  pricingType: string
  userBudget?: number | null
  totalCost?: number | null
  status: string
  createdAt: string
  problemDescription: string
  dateTimePreference: string
  preferredDateTime?: string | null
  photoUrls: string[]
  bidStats: BidStats
}

interface RequestCardProps {
  request: CombinedRequest
  onAnswerQuestions: (request: CombinedRequest) => void
  onCancelRequest: (request: CombinedRequest) => Promise<void>
  onCancelled: () => Promise<void>
  focusRef?: React.RefObject<HTMLDivElement>
  isFocused?: boolean
}

const ACTIVE_STATUSES = new Set(["ACTIVE", "OPEN", "REQUESTED"])
const PROGRESS_STATUSES = new Set([
  "IN_PROGRESS",
  "ASSIGNED",
  "ACCEPTED",
  "CONFIRMED",
  "EN_ROUTE",
  "ARRIVED",
  "SCHEDULED",
  "REVIEW_PENDING",
])
const COMPLETED_STATUSES = new Set(["COMPLETED", "CANCELLED", "FULFILLED", "CLOSED"])

const formatCurrency = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—"
  return `$${value.toFixed(2)}`
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Unknown date"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

const formatTimePreference = (preference: string | null | undefined, specific?: string | null) => {
  if (!preference) return "Not specified"
  const normalized = preference.toUpperCase()

  if (normalized === "ASAP") return "As soon as possible"
  if (normalized === "FLEXIBLE") return "Flexible scheduling"
  if (normalized.includes("SPECIFIC") || normalized === "SCHEDULED") {
    const formatted = formatDateTime(specific)
    return formatted ?? "Specific time requested"
  }

  return preference
}

const getStatusMeta = (status: string | null | undefined) => {
  const key = status ? status.toUpperCase() : "ACTIVE"
  return STATUS_META[key] ?? STATUS_META.ACTIVE
}

const resolveTabForStatus = (status: string | null | undefined): TabKey => {
  const key = status ? status.toUpperCase() : "ACTIVE"
  if (COMPLETED_STATUSES.has(key)) return "completed"
  if (PROGRESS_STATUSES.has(key)) return "progress"
  return "active"
}

function RequestCard({ request, onAnswerQuestions, onCancelRequest, onCancelled, focusRef, isFocused }: RequestCardProps) {
  const statusMeta = getStatusMeta(request.status)
  const timingDescription = formatTimePreference(request.dateTimePreference, request.preferredDateTime)
  const acceptedBid = request.bidStats.accepted
  const hasBids = request.bidStats.total > 0
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  const handleCancel = useCallback(async () => {
    try {
      setCancelError(null)
      setIsCancelling(true)
      await onCancelRequest(request)
      setShowCancelDialog(false)
      await onCancelled()
    } catch (error: any) {
      setCancelError(error?.message ?? "Unable to cancel this request right now.")
    } finally {
      setIsCancelling(false)
    }
  }, [onCancelRequest, onCancelled, request])

  const refundAmount = Math.max(0, (request.userBudget ?? request.totalCost ?? 0) - 5)

  return (
    <article
      ref={focusRef}
      className={`rounded-3xl border bg-white p-6 shadow-sm transition hover:shadow-md ${
        isFocused ? "border-[#0D1B2A] shadow-lg" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span className="rounded-full bg-[#0D1B2A]/10 px-2 py-1 text-[#0D1B2A]">
              {request.source === "towing" ? "Towing Request" : "Repair Request"}
            </span>
            <span>{formatDate(request.createdAt)}</span>
          </div>
          <h3 className="text-xl font-semibold text-[#0D1B2A]">{request.serviceSubcategory}</h3>
          {request.serviceSpecification ? (
            <p className="text-sm text-gray-600">{request.serviceSpecification}</p>
          ) : null}
          <p className="text-sm text-gray-500">Vehicle: {request.vehicleSummary || "Vehicle details pending"}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
          <span aria-hidden>{statusMeta.icon}</span>
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Location</p>
          <p className="mt-1 text-sm text-gray-800">
            {request.locationCity}, {request.locationState || "State TBD"}
          </p>
          {request.source === "towing" && (request.dropoffCity || request.dropoffState) ? (
            <p className="mt-2 text-xs text-gray-500">
              Dropoff: {request.dropoffCity ?? "TBD"}
              {request.dropoffState ? `, ${request.dropoffState}` : ""}
            </p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Timing</p>
          <p className="mt-1 text-sm text-gray-800">{timingDescription}</p>
          {request.preferredDateTime ? (
            <p className="mt-2 text-xs text-gray-500">Preferred: {formatDateTime(request.preferredDateTime)}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Budget</p>
          <p className="mt-1 text-sm text-gray-800">{formatCurrency(request.userBudget ?? request.totalCost ?? null)}</p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
            {request.pricingType}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Details</p>
          <p className="mt-1 text-sm text-gray-800 line-clamp-3">{request.problemDescription}</p>
          {request.source === "towing" && (request.urgencyLevel || request.distanceMiles != null) ? (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
              {request.urgencyLevel ? (
                <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-700">{request.urgencyLevel}</span>
              ) : null}
              {request.distanceMiles != null ? <span>{request.distanceMiles.toFixed(1)} mi route</span> : null}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {hasBids ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-[#0D1B2A]/15 bg-[#0D1B2A]/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#0D1B2A]">
              {acceptedBid ? (
                <span className="font-semibold">
                  Accepted bid from {acceptedBid.technicianName} for {formatCurrency(acceptedBid.amount)}
                </span>
              ) : (
                <span className="font-semibold">{request.bidStats.total} bid{request.bidStats.total === 1 ? "" : "s"} received</span>
              )}
              {request.bidStats.pending > 0 ? (
                <span className="block text-xs text-[#0D1B2A]/70">
                  {request.bidStats.pending} pending bid{request.bidStats.pending === 1 ? "" : "s"} awaiting your review.
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0D1B2A] shadow">
                Total bids: {request.bidStats.total}
              </span>
              {request.bidStats.pending > 0 ? (
                <span className="rounded-full bg-[#0D1B2A] px-3 py-1 text-xs font-semibold text-white">
                  {request.bidStats.pending} pending
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            No bids yet. Technicians will be notified of your request shortly.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            {request.photoUrls.length > 0
              ? `${request.photoUrls.length} photo${request.photoUrls.length === 1 ? "" : "s"} attached`
              : "No photos attached"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {request.status === "ACTIVE" ? (
              <>
                <button
                  onClick={() => onAnswerQuestions(request)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
                >
                  Answer questions
                </button>
                <button
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCancelling}
                  className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#0D1B2A] focus:ring-offset-2 ${
                    isCancelling
                      ? "cursor-not-allowed border-gray-300 text-gray-400"
                      : "border-[#D32F2F] text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white"
                  }`}
                >
                  {isCancelling ? "Cancelling…" : "Cancel request"}
                </button>
              </>
            ) : (
              <Link
                href="/dashboard/car-repair?type=car"
                className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
              >
                Post another request
              </Link>
            )}
          </div>
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-2xl">
            <div className="text-5xl text-amber-500" aria-hidden>
              ⚠️
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-bold text-[#0D1B2A]">Cancel service request?</h2>
              <p className="text-sm text-gray-600">
                A $5 cancellation fee applies. You’ll be refunded the remaining balance of your posting budget.
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Original budget</span>
                <span>{formatCurrency(request.userBudget ?? request.totalCost ?? 0)}</span>
              </div>
              <div className="mt-2 flex justify-between text-[#D32F2F]">
                <span>Cancellation fee</span>
                <span>−$5.00</span>
              </div>
              <div className="mt-3 flex justify-between text-[#0D1B2A]">
                <span className="font-semibold">Refund amount</span>
                <span className="font-semibold">{formatCurrency(refundAmount)}</span>
              </div>
            </div>
            {cancelError ? (
              <div className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{cancelError}</div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                  isCancelling ? "bg-[#D32F2F]/60" : "bg-[#D32F2F] hover:bg-[#A32727]"
                }`}
              >
                {isCancelling ? "Cancelling…" : "Confirm cancellation"}
              </button>
              <button
                onClick={() => {
                  setCancelError(null)
                  setShowCancelDialog(false)
                }}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Keep request
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default function TrackingPage() {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navLinks = (navigationItems.customer || []).map((item) => ({
    ...item,
    active: resolveNavItemActive(pathname, item),
  }))

  const [requests, setRequests] = useState<CombinedRequest[]>([])
  const [activeTab, setActiveTab] = useState<TabKey>("active")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const focusId = searchParams?.get("focus") ?? null
  const focusRef = useRef<HTMLDivElement | null>(null)
  const focusHandledRef = useRef(false)

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError(null)

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

      const [repairResult, towingResult] = await Promise.all([
        supabase
          .from("repair_board_posts")
          .select(
            `id,
             user_id,
             service_category,
             service_subcategory,
             service_specification,
             vehicle_year,
             vehicle_make,
             vehicle_model,
             location_city,
             location_state,
             pricing_type,
             user_budget,
             total_cost,
             status,
             created_at,
             problem_description,
             date_time_preference,
             preferred_date_time,
             photo_urls`
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("towing_board_posts")
          .select(
            `id,
             user_id,
             towing_service_type,
             vehicle_year,
             vehicle_make,
             vehicle_model,
             pickup_city,
             pickup_state,
             dropoff_city,
             dropoff_state,
             pricing_type,
             maximum_bid,
             total_cost,
             status,
             created_at,
             problem_description,
             date_time_preference,
             preferred_date_time,
             urgency_level,
             distance,
             photo_urls`
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ])

      if (repairResult.error) throw repairResult.error
      if (towingResult.error) console.warn("Failed to load towing requests:", towingResult.error)

      const repairRows = repairResult.data ?? []
      const towingRows = towingResult.data ?? []

      const baseRequests: CombinedRequest[] = [
        ...repairRows.map((post: any) => ({
          id: post.id,
          source: "repair" as const,
          customerId: post.user_id,
          serviceCategory: post.service_category ?? "General Repair",
          serviceSubcategory: post.service_subcategory ?? "Service Request",
          serviceSpecification: post.service_specification ?? undefined,
          vehicleSummary: `${post.vehicle_year ?? ""} ${post.vehicle_make ?? ""} ${post.vehicle_model ?? ""}`.trim(),
          locationCity: post.location_city ?? "Unknown city",
          locationState: post.location_state ?? "",
          pricingType: post.pricing_type ?? "Fixed",
          userBudget: typeof post.user_budget === "number" ? post.user_budget : null,
          totalCost: typeof post.total_cost === "number" ? post.total_cost : null,
          status: post.status ?? "ACTIVE",
          createdAt: post.created_at ?? "",
          problemDescription: post.problem_description ?? "No additional details provided.",
          dateTimePreference: post.date_time_preference ?? "ASAP",
          preferredDateTime: post.preferred_date_time ?? null,
          photoUrls: Array.isArray(post.photo_urls) ? post.photo_urls : [],
          bidStats: { total: 0, pending: 0 },
        })),
        ...towingRows.map((post: any) => ({
          id: post.id,
          source: "towing" as const,
          customerId: post.user_id,
          serviceCategory: "Towing",
          serviceSubcategory: post.towing_service_type ?? "Tow Service",
          serviceSpecification:
            post.pickup_city && post.dropoff_city
              ? `Pickup: ${post.pickup_city}, ${post.pickup_state ?? ""} → Dropoff: ${post.dropoff_city}, ${post.dropoff_state ?? ""}`
              : undefined,
          vehicleSummary: `${post.vehicle_year ?? ""} ${post.vehicle_make ?? ""} ${post.vehicle_model ?? ""}`.trim(),
          locationCity: post.pickup_city ?? "Unknown city",
          locationState: post.pickup_state ?? "",
          dropoffCity: post.dropoff_city ?? undefined,
          dropoffState: post.dropoff_state ?? undefined,
          distanceMiles: typeof post.distance === "number" ? post.distance : null,
          urgencyLevel: post.urgency_level ?? null,
          pricingType: post.pricing_type ?? "Quote",
          userBudget:
            typeof post.maximum_bid === "number"
              ? post.maximum_bid
              : typeof post.total_cost === "number"
              ? post.total_cost
              : null,
          totalCost: typeof post.total_cost === "number" ? post.total_cost : null,
          status: post.status ?? "ACTIVE",
          createdAt: post.created_at ?? "",
          problemDescription: post.problem_description ?? "No additional details provided.",
          dateTimePreference: post.date_time_preference ?? "ASAP",
          preferredDateTime: post.preferred_date_time ?? null,
          photoUrls: Array.isArray(post.photo_urls) ? post.photo_urls : [],
          bidStats: { total: 0, pending: 0 },
        })),
      ]

      const bidsByPost = new Map<string, BidStats>()

      const repairIds = repairRows.map((row: any) => row.id).filter(Boolean)
      if (repairIds.length > 0) {
        const { data: repairBids, error: repairBidsError } = await supabase
          .from("technician_bids")
          .select(`id, post_id, technician_name, bid_amount, status`)
          .in("post_id", repairIds)

        if (repairBidsError) {
          console.warn("Failed to load technician bids:", repairBidsError)
        } else {
          repairBids?.forEach((bid: any) => {
            if (!bid.post_id) return
            const entry = bidsByPost.get(bid.post_id) ?? { total: 0, pending: 0 }
            entry.total += 1
            const statusKey = bid.status ? bid.status.toUpperCase() : "PENDING"
            if (statusKey === "PENDING") entry.pending += 1
            if (statusKey === "ACCEPTED") {
              entry.accepted = {
                technicianName: bid.technician_name ?? "Technician",
                amount: typeof bid.bid_amount === "number" ? bid.bid_amount : 0,
              }
            }
            bidsByPost.set(bid.post_id, entry)
          })
        }
      }

      const towingIds = towingRows.map((row: any) => row.id).filter(Boolean)
      if (towingIds.length > 0) {
        const { data: towingBids, error: towingBidsError } = await supabase
          .from("towing_bids")
          .select(`id, post_id, technician_name, bid_amount, status`)
          .in("post_id", towingIds)

        if (towingBidsError) {
          console.warn("Failed to load towing bids:", towingBidsError)
        } else {
          towingBids?.forEach((bid: any) => {
            if (!bid.post_id) return
            const entry = bidsByPost.get(bid.post_id) ?? { total: 0, pending: 0 }
            entry.total += 1
            const statusKey = bid.status ? bid.status.toUpperCase() : "PENDING"
            if (statusKey === "PENDING") entry.pending += 1
            if (statusKey === "ACCEPTED") {
              entry.accepted = {
                technicianName: bid.technician_name ?? "Technician",
                amount: typeof bid.bid_amount === "number" ? bid.bid_amount : 0,
              }
            }
            bidsByPost.set(bid.post_id, entry)
          })
        }
      }

      const enriched = baseRequests
        .map((request) => ({
          ...request,
          bidStats: bidsByPost.get(request.id) ?? request.bidStats,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setRequests(enriched)
    } catch (fetchError: any) {
      console.error("Failed to load tracking page:", fetchError)
      setError(fetchError?.message ?? "Unable to load your requests right now.")
    } finally {
      setLoading(false)
    }
  }, [router, supabase])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  useEffect(() => {
    if (!focusId || requests.length === 0 || focusHandledRef.current) return
    const match = requests.find((request) => request.id === focusId)
    if (!match) return
    const targetTab = resolveTabForStatus(match.status)
    setActiveTab(targetTab)
    focusHandledRef.current = true
  }, [focusId, requests])

  useEffect(() => {
    if (!focusId || !focusRef.current) return
    focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [focusId, activeTab])

  const refreshRequests = useCallback(async () => {
    await loadRequests()
  }, [loadRequests])

  const handleAnswerQuestions = useCallback(
    (request: CombinedRequest) => {
      router.push(`/messages?type=${request.source}&postId=${request.id}`)
    },
    [router]
  )

  const handleCancelRequest = useCallback(
    async (request: CombinedRequest) => {
      const fee = 5
      const budget = request.userBudget ?? request.totalCost ?? 0
      const refundAmount = Math.max(0, budget - fee)

      const table = request.source === "towing" ? "towing_board_posts" : "repair_board_posts"
      const updates = {
        status: "CANCELLED",
        cancellation_fee: fee,
        cancelled_by: request.customerId,
        cancelled_at: new Date().toISOString(),
        refund_amount: refundAmount,
        updated_at: new Date().toISOString(),
      }

      const { error: cancelError } = await supabase
        .from(table)
        .update(updates as never)
        .eq("id", request.id)

      if (cancelError) throw cancelError
    },
    [supabase]
  )

  const counts = useMemo(() => {
    const tally: Record<TabKey, number> = { active: 0, progress: 0, completed: 0 }
    requests.forEach((request) => {
      const tab = resolveTabForStatus(request.status)
      tally[tab] += 1
    })
    return tally
  }, [requests])

  const filteredRequests = useMemo(
    () => requests.filter((request) => resolveTabForStatus(request.status) === activeTab),
    [requests, activeTab]
  )

  const tabs: Array<{ key: TabKey; label: string; description: string }> = [
    { key: "active", label: "Active", description: "Requests awaiting bids" },
    { key: "progress", label: "In Progress", description: "Accepted bids & scheduled work" },
    { key: "completed", label: "Completed", description: "Finished or cancelled jobs" },
  ]

  const emptyStates: Record<TabKey, { title: string; description: string; emoji: string }> = {
    active: {
      title: "No active requests",
      description: "Post a new service request to start receiving bids from technicians.",
      emoji: "📋",
    },
    progress: {
      title: "No jobs in progress",
      description: "Once you accept a bid, the job will appear here for easy tracking.",
      emoji: "🔧",
    },
    completed: {
      title: "No completed jobs yet",
      description: "Finished jobs, along with receipts and reviews, will appear here.",
      emoji: "✅",
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#0D1B2A]">
          <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
          <p className="text-sm font-medium">Loading your service requests…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 shadow-lg text-center space-y-4">
          <div className="text-5xl" aria-hidden>
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-gray-900">We couldn’t load your requests</h1>
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
          <h1 className="text-2xl font-bold">My Service Requests</h1>
          <p className="text-sm text-[#C0C0C0]">Track bids, ongoing jobs, and completed work</p>
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
        <section className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#0D1B2A]">Your requests</h2>
              <p className="text-sm text-gray-500">Easily track every job from posting to completion.</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold">Active: {counts.active}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold">In progress: {counts.progress}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold">Completed: {counts.completed}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[#0D1B2A] focus:ring-offset-2 ${
                  activeTab === tab.key ? "border-[#0D1B2A] bg-[#0D1B2A]/5" : "border-gray-200"
                }`}
              >
                <span className="text-sm font-semibold text-[#0D1B2A]">{tab.label}</span>
                <span className="text-xs text-gray-500">{tab.description}</span>
                <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-gray-600">
                  <span className="rounded-full bg-white px-2 py-1 shadow">{counts[tab.key]}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {filteredRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#0D1B2A]/30 bg-white p-10 text-center text-gray-600">
              <div className="text-5xl" aria-hidden>
                {emptyStates[activeTab].emoji}
              </div>
              <h2 className="mt-3 text-xl font-semibold text-[#0D1B2A]">{emptyStates[activeTab].title}</h2>
              <p className="mt-2 text-sm">{emptyStates[activeTab].description}</p>
              <Link
                href="/dashboard/car-repair?type=car"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
              >
                Browse services
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAnswerQuestions={handleAnswerQuestions}
                  onCancelRequest={handleCancelRequest}
                  onCancelled={refreshRequests}
                  focusRef={focusId === request.id ? focusRef : undefined}
                  isFocused={focusId === request.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

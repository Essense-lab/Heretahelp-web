"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { RepairBoardRepository } from "@/lib/repositories/repair-board-repository"
import { TowingBoardRepository } from "@/lib/repositories/towing-board-repository"
import { NotificationRepository } from "@/lib/repositories/notification-repository"
import type {
  CustomerNotificationDto,
  RepairBoardMessageDto,
  TowingQAMessageDto,
} from "@/types"
import { NotificationType } from "@/types"

type ConversationType = "repair" | "towing"

interface PostSummary {
  id: string
  ownerId: string
  type: ConversationType
  title: string
  subtitle?: string | null
  createdAt: string
  fields: Array<{ label: string; value: string }>
}

interface CurrentUserSummary {
  id: string
  firstName: string
  lastName: string
  userType: string | null
}

interface Message {
  id: string
  senderId: string
  senderName: string
  senderType: "CUSTOMER" | "TECHNICIAN" | "TOW_OPERATOR"
  body: string
  createdAt: string
}

type TabKey = "messages" | "notifications"

interface NotificationGroup {
  label: string
  notifications: CustomerNotificationDto[]
}

const formatRelativeTime = (value: string | null | undefined) => {
  if (!value) return "Recently"
  try {
    const now = Date.now()
    const timestamp = new Date(value).getTime()
    if (Number.isNaN(timestamp)) return value
    const diffMs = now - timestamp
    const minutes = Math.floor(diffMs / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    return value ?? "Recently"
  }
}

const formatCurrency = (value: number | null | undefined) => {
  if (value == null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value)
}

const formatDateLong = (value: string | null | undefined) => {
  if (!value) return "Unknown date"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

const formatTimestampShort = (value: string | null | undefined) => {
  if (!value) return "Just now"
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

const MessageBubble = ({ message, isCurrentUser }: { message: Message; isCurrentUser: boolean }) => (
  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm transition ${
        isCurrentUser
          ? "bg-[#0D1B2A] text-white"
          : "bg-white text-gray-900 border border-gray-200"
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
        {!isCurrentUser && (
          <span>{message.senderType === "TECHNICIAN" || message.senderType === "TOW_OPERATOR" ? "🔧" : "🙂"}</span>
        )}
        <span className="font-semibold text-gray-500">{isCurrentUser ? "You" : message.senderName}</span>
        <span className="text-gray-400">•</span>
        <span>{formatTimestampShort(message.createdAt)}</span>
        {isCurrentUser && (
          <span>{message.senderType === "TECHNICIAN" || message.senderType === "TOW_OPERATOR" ? "🔧" : "🙂"}</span>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
    </div>
  </div>
)

export default function MessagesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const conversationType = (searchParams.get("type") ?? "") as ConversationType
  const postId = searchParams.get("postId") ?? ""

  const supabase = useMemo(() => createSupabaseClient(), [])
  const repairRepo = useMemo(() => new RepairBoardRepository(), [])
  const towingRepo = useMemo(() => new TowingBoardRepository(), [])
  const notificationRepo = useMemo(() => new NotificationRepository(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [post, setPost] = useState<PostSummary | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUser, setCurrentUser] = useState<CurrentUserSummary | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>("messages")
  const [notifications, setNotifications] = useState<CustomerNotificationDto[]>([])
  const [notificationsLoading, setNotificationsLoading] = useState(true)
  const [notificationsError, setNotificationsError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const isConversationTypeValid = conversationType === "repair" || conversationType === "towing"

  const mapRepairMessages = useCallback((items: RepairBoardMessageDto[]) => {
    return items
      .map<Message>((item) => ({
        id: item.id,
        senderId: item.user_id,
        senderName: item.user_name,
        senderType: item.user_type as Message["senderType"],
        body: item.message,
        createdAt: item.created_at ?? new Date().toISOString(),
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [])

  const mapTowingMessages = useCallback((items: TowingQAMessageDto[]) => {
    return items
      .map<Message>((item) => ({
        id: item.id,
        senderId: item.sender_id,
        senderName: item.sender_name,
        senderType: item.sender_type as Message["senderType"],
        body: item.message,
        createdAt: item.created_at ?? new Date().toISOString(),
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [])

  const fetchMessages = useCallback(async () => {
    if (!postId || !isConversationTypeValid) return
    try {
      setMessageError(null)

      if (conversationType === "towing") {
        const data = await towingRepo.getQAMessages(postId)
        setMessages(mapTowingMessages(data))
      } else {
        const data = await repairRepo.getMessages(postId)
        setMessages(mapRepairMessages(data))
      }
    } catch (fetchError: any) {
      setMessageError(fetchError?.message ?? "Unable to load messages.")
    }
  }, [conversationType, isConversationTypeValid, mapRepairMessages, mapTowingMessages, postId, repairRepo, towingRepo])

  const refreshNotifications = useCallback(
    async (userId: string) => {
      try {
        setNotificationsLoading(true)
        setNotificationsError(null)
        const [items, unread] = await Promise.all([
          notificationRepo.getUserNotifications(userId),
          notificationRepo.getUnreadCount(userId),
        ])
        setNotifications(items)
        setUnreadCount(unread)
      } catch (err: any) {
        console.error("Failed to load notifications:", err)
        setNotificationsError(err?.message ?? "Unable to load notifications.")
      } finally {
        setNotificationsLoading(false)
      }
    },
    [notificationRepo]
  )

  const handleNotificationClick = useCallback(
    async (notification: CustomerNotificationDto) => {
      if (!currentUser) return

      if (!notification.is_read) {
        try {
          await notificationRepo.markAsRead(notification.id)
          setNotifications((prev) =>
            prev.map((item) =>
              item.id === notification.id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item
            )
          )
          setUnreadCount((prev) => Math.max(0, prev - 1))
        } catch (err) {
          console.warn("Failed to mark notification as read", err)
        }
      }

      if (notification.type === NotificationType.REVIEW_REQUEST) {
        const data = (notification.data as Record<string, unknown>) || {}
        const jobId =
          (typeof data.job_id === "string" && data.job_id) ||
          (typeof data.post_id === "string" && data.post_id) ||
          (typeof notification.post_id === "string" ? notification.post_id : null)

        if (jobId) {
          router.push(`/tracking?focus=${jobId}`)
        } else {
          router.push("/tracking")
        }
        return
      }

      if (notification.post_id && typeof notification.post_id === "string") {
        const targetType = notification.data && typeof notification.data === "object" ? (notification.data as any).source : null
        const search = new URLSearchParams()
        search.set("postId", notification.post_id)
        if (targetType === "towing") {
          search.set("type", "towing")
        } else {
          search.set("type", "repair")
        }
        router.push(`/messages?${search.toString()}`)
      }
    },
    [currentUser, notificationRepo, router]
  )

  const handleMarkAllRead = useCallback(
    async (userId: string) => {
      try {
        await notificationRepo.markAllAsRead(userId)
        setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true, read_at: new Date().toISOString() })))
        setUnreadCount(0)
      } catch (err) {
        console.warn("Failed to mark all notifications as read", err)
      }
    },
    [notificationRepo]
  )

  const groupedNotifications = useMemo<NotificationGroup[]>(() => {
    if (notifications.length === 0) return []
    const unread = notifications.filter((item) => !item.is_read)
    const read = notifications.filter((item) => item.is_read)
    const groups: NotificationGroup[] = []
    if (unread.length > 0) {
      groups.push({ label: `New (${unread.length})`, notifications: unread })
    }
    if (read.length > 0) {
      groups.push({ label: "Earlier", notifications: read })
    }
    return groups
  }, [notifications])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  useEffect(() => {
    let isMounted = true

    if (!postId || !isConversationTypeValid) {
      setError("Missing or invalid conversation details.")
      setLoading(false)
      return
    }

    const loadConversation = async () => {
      try {
        setLoading(true)
        setError(null)

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) throw userError

        if (!user) {
          router.replace("/auth/sign-in")
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, user_type")
          .eq("id", user.id)
          .single()

        if (profileError) throw profileError

        const userSummary: CurrentUserSummary = {
          id: user.id,
          firstName: profileData?.first_name ?? "",
          lastName: profileData?.last_name ?? "",
          userType: profileData?.user_type ?? null,
        }

        if (!isMounted) return
        setCurrentUser(userSummary)
        await refreshNotifications(user.id)

        if (conversationType === "repair") {
          const { data, error: postError } = await supabase
            .from("repair_board_posts")
            .select(
              `id, user_id, service_category, service_subcategory, service_specification,
               location_city, location_state,
               vehicle_year, vehicle_make, vehicle_model,
               user_budget, pricing_type, created_at`
            )
            .eq("id", postId)
            .single()

          if (postError || !data) throw postError ?? new Error("Service request not found.")

          const vehicleSummary = [data.vehicle_year, data.vehicle_make, data.vehicle_model].filter(Boolean).join(" ") || "Vehicle details pending"
          const locationSummary = [data.location_city, data.location_state].filter(Boolean).join(", ") || "Location TBD"

          const summary: PostSummary = {
            id: data.id,
            ownerId: data.user_id,
            type: "repair",
            title: data.service_subcategory ?? "Repair Request",
            subtitle: data.service_specification,
            createdAt: data.created_at ?? new Date().toISOString(),
            fields: [
              { label: "Service Category", value: data.service_category ?? "General Repair" },
              { label: "Vehicle", value: vehicleSummary },
              { label: "Location", value: locationSummary },
              {
                label: data.pricing_type === "BID" ? "Max Budget" : "Budget",
                value: formatCurrency(typeof data.user_budget === "number" ? data.user_budget : null),
              },
            ],
          }

          if (isMounted) {
            setPost(summary)
          }
        } else {
          const { data, error: postError } = await supabase
            .from("towing_board_posts")
            .select(
              `id, user_id, towing_service_type,
               pickup_city, pickup_state,
               dropoff_city, dropoff_state,
               vehicle_year, vehicle_make, vehicle_model,
               maximum_bid, total_cost,
               created_at`
            )
            .eq("id", postId)
            .single()

          if (postError || !data) throw postError ?? new Error("Service request not found.")

          const vehicleSummary = [data.vehicle_year, data.vehicle_make, data.vehicle_model].filter(Boolean).join(" ") || "Vehicle details pending"
          const pickupSummary = [data.pickup_city, data.pickup_state].filter(Boolean).join(", ") || "Pickup TBD"
          const dropoffSummary = [data.dropoff_city, data.dropoff_state].filter(Boolean).join(", ") || "Dropoff TBD"

          const summary: PostSummary = {
            id: data.id,
            ownerId: data.user_id,
            type: "towing",
            title: data.towing_service_type ?? "Towing Request",
            subtitle: vehicleSummary,
            createdAt: data.created_at ?? new Date().toISOString(),
            fields: [
              { label: "Pickup", value: pickupSummary },
              { label: "Dropoff", value: dropoffSummary },
              {
                label: "Budget",
                value: formatCurrency(
                  typeof data.maximum_bid === "number"
                    ? data.maximum_bid
                    : typeof data.total_cost === "number"
                    ? data.total_cost
                    : null
                ),
              },
            ],
          }

          if (isMounted) {
            setPost(summary)
          }
        }

        if (!isMounted) return
        await fetchMessages()
        if (!isMounted) return
        setLoading(false)
      } catch (loadError: any) {
        if (!isMounted) return
        console.error("Failed to load messaging page:", loadError)
        setError(loadError?.message ?? "Unable to load this conversation.")
        setLoading(false)
      }
    }

    loadConversation()

    return () => {
      isMounted = false
    }
  }, [conversationType, fetchMessages, isConversationTypeValid, postId, router, supabase])

  useEffect(() => {
    if (!postId || !isConversationTypeValid) return

    const interval = setInterval(() => {
      fetchMessages()
    }, 10000)

    return () => clearInterval(interval)
  }, [fetchMessages, isConversationTypeValid, postId])

  useEffect(() => {
    if (!currentUser) return
    const interval = setInterval(() => {
      refreshNotifications(currentUser.id)
    }, 15000)

    return () => clearInterval(interval)
  }, [currentUser, refreshNotifications])

  const handleSendMessage = async () => {
    if (!currentUser || !post || !newMessage.trim()) return

    try {
      setIsSending(true)
      setMessageError(null)

      const trimmedMessage = newMessage.trim()
      const senderName = `${currentUser.firstName} ${currentUser.lastName}`.trim() || "Customer"
      const userType = currentUser.userType?.toUpperCase() ?? "CUSTOMER"

      if (conversationType === "towing") {
        await towingRepo.sendQAMessage({
          post_id: post.id,
          sender_id: currentUser.id,
          sender_name: senderName,
          sender_type: userType === "TECHNICIAN" ? "TOW_OPERATOR" : "CUSTOMER",
          message: trimmedMessage,
          is_read: false,
        })
      } else {
        await repairRepo.sendMessage({
          post_id: post.id,
          user_id: currentUser.id,
          user_name: senderName,
          user_type: userType === "TECHNICIAN" ? "TECHNICIAN" : "CUSTOMER",
          message: trimmedMessage,
          is_read: false,
        })
      }

      setNewMessage("")
      await fetchMessages()
    } catch (sendError: any) {
      console.error("Failed to send message:", sendError)
      setMessageError(sendError?.message ?? "Unable to send your message right now.")
    } finally {
      setIsSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#0D1B2A]">
          <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
          <p className="text-sm font-medium">Loading conversation…</p>
        </div>
      </div>
    )
  }

  if (error || !post || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 rounded-3xl bg-white p-8 shadow-lg text-center">
          <div className="text-5xl" aria-hidden>
            ⚠️
          </div>
          <h1 className="text-xl font-semibold text-[#0D1B2A]">We couldn’t open this conversation</h1>
          <p className="text-sm text-gray-600">{error ?? "Something went wrong while loading your messages."}</p>
          <Link
            href="/tracking"
            className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to My Requests
          </Link>
        </div>
      </div>
    )
  }

  const isCustomer = (currentUser.userType?.toUpperCase() ?? "CUSTOMER") === "CUSTOMER"
  const sendButtonDisabled = newMessage.trim().length === 0 || isSending

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0D1B2A]/70">
              {post.type === "towing" ? "Towing Request" : "Repair Request"}
            </p>
            <h1 className="text-2xl font-semibold text-[#0D1B2A]">
              {post.title}
              {post.subtitle ? <span className="text-gray-500"> · {post.subtitle}</span> : null}
            </h1>
            <p className="text-xs text-gray-500">Opened {formatDateLong(post.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tracking"
              className="inline-flex items-center gap-1 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
            >
              ← Requests
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-2">
            <button
              type="button"
              onClick={() => setActiveTab("messages")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "messages"
                  ? "bg-[#0D1B2A] text-white"
                  : "text-[#0D1B2A] hover:bg-[#0D1B2A]/10"
              }`}
            >
              <span aria-hidden>💬</span>
              Messages
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("notifications")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "notifications"
                  ? "bg-[#0D1B2A] text-white"
                  : "text-[#0D1B2A] hover:bg-[#0D1B2A]/10"
              }`}
            >
              <span aria-hidden>🔔</span>
              Notifications
              {unreadCount > 0 ? (
                <span className="ml-1 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              ) : null}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6">
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#0D1B2A]/70">Request details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {post.fields.map((field) => (
              <div key={field.label} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-400">{field.label}</p>
                <p className="mt-1 text-sm font-semibold text-[#0D1B2A]">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        {activeTab === "messages" ? (
          <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0D1B2A]">Conversation</h2>
              {messageError ? <span className="text-xs text-rose-600">{messageError}</span> : null}
            </div>
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex max-h-[520px] flex-col gap-4 overflow-y-auto pr-2">
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser.id
                  return <MessageBubble key={message.id} message={message} isCurrentUser={isCurrentUser} />
                })}
                <div ref={bottomRef} />
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <textarea
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder={isCustomer ? "Send a message to your technician" : "Reply to your customer"}
                className="min-h-[120px] resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-[#0D1B2A] focus:outline-none"
                disabled={isSending}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  {isCustomer ? "Technicians" : "Customers"} will be notified of your message.
                </p>
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sendButtonDisabled}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    sendButtonDisabled
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-[#0D1B2A] text-white hover:bg-[#0A1625]"
                  }`}
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                      Sending…
                    </span>
                  ) : (
                    <>
                      <span>Send message</span>
                      <span aria-hidden>➡️</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Notifications</h2>
                <p className="text-xs text-gray-500">
                  Stay updated on bids, messages, job status, and review requests.
                </p>
              </div>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={() => currentUser && handleMarkAllRead(currentUser.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
                >
                  Mark all read
                </button>
              ) : null}
            </div>

            {notificationsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-[#0D1B2A]">
                  <div className="h-10 w-10 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
                  <p className="text-xs font-medium">Loading notifications…</p>
                </div>
              </div>
            ) : notificationsError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {notificationsError}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-gray-500">
                <span className="text-5xl" aria-hidden>
                  🔔
                </span>
                <p className="text-sm font-medium text-[#0D1B2A]">No notifications yet</p>
                <p className="text-xs">You'll see bids, messages, and review reminders here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {groupedNotifications.map((group) => (
                  <div key={group.label} className="flex flex-col gap-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {group.label}
                    </div>
                    <div className="flex flex-col gap-3">
                      {group.notifications.map((notification) => {
                        const { emoji, label } = notificationRepo.getTypeDisplay(
                          notification.type as NotificationType
                        )
                        return (
                          <button
                            key={notification.id}
                            type="button"
                            onClick={() => handleNotificationClick(notification)}
                            className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                              notification.is_read
                                ? "border-gray-200 bg-white hover:border-[#0D1B2A]/30"
                                : "border-[#0D1B2A]/30 bg-[#0D1B2A]/5 hover:border-[#0D1B2A]/50"
                            }`}
                          >
                            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-lg">
                              <span aria-hidden>{emoji}</span>
                            </div>
                            <div className="flex flex-1 flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-[#0D1B2A]">{notification.title}</p>
                                <span className="text-[10px] uppercase tracking-wide text-gray-400">{label}</span>
                                {!notification.is_read ? (
                                  <span className="inline-flex items-center rounded-full bg-[#0D1B2A] px-2 py-0.5 text-[10px] font-semibold text-white">
                                    New
                                  </span>
                                ) : null}
                              </div>
                              <p className="text-xs text-gray-600">{notification.message}</p>
                              <p className="text-[11px] text-gray-400">
                                {formatRelativeTime(notification.created_at ?? notification.updated_at ?? null)}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
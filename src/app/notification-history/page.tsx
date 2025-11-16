"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { NotificationRepository } from "@/lib/repositories/notification-repository"
import { NotificationType } from "@/types"
import type { CustomerNotificationDto } from "@/types"

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

interface NotificationGroup {
  label: string
  notifications: CustomerNotificationDto[]
}

export default function NotificationHistoryPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])
  const repo = useMemo(() => new NotificationRepository(), [])

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<CustomerNotificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const loadNotifications = useCallback(async (userId: string) => {
    try {
      setLoading(true)
      setError(null)
      const [items, unread] = await Promise.all([
        repo.getUserNotifications(userId),
        repo.getUnreadCount(userId),
      ])
      setNotifications(items)
      setUnreadCount(unread)
    } catch (err: any) {
      console.error("Failed to load notification history:", err)
      setError(err?.message ?? "Unable to load notifications.")
    } finally {
      setLoading(false)
    }
  }, [repo])

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!user) {
          router.replace("/auth/sign-in")
          return
        }

        if (!mounted) return
        setCurrentUserId(user.id)
        await loadNotifications(user.id)
      } catch (err: any) {
        console.error("Failed to boot notification history:", err)
        if (mounted) {
          setError(err?.message ?? "Unable to load notifications.")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    bootstrap()

    return () => {
      mounted = false
    }
  }, [loadNotifications, router, supabase])

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

  const handleNotificationAction = useCallback(async (notification: CustomerNotificationDto) => {
    if (!currentUserId) return

    if (!notification.is_read) {
      try {
        await repo.markAsRead(notification.id)
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
  }, [currentUserId, repo, router])

  const handleMarkAllRead = useCallback(async () => {
    if (!currentUserId) return
    try {
      await repo.markAllAsRead(currentUserId)
      setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (err) {
      console.warn("Failed to mark all notifications as read", err)
    }
  }, [currentUserId, repo])

  const handleDelete = useCallback(async (notificationId: string) => {
    try {
      await repo.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((item) => item.id !== notificationId))
      setUnreadCount((prev) => prev - 1)
    } catch (err) {
      console.warn("Failed to delete notification", err)
    }
  }, [repo])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#0D1B2A]">
          <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
          <p className="text-sm font-medium">Loading your notifications…</p>
        </div>
      </div>
    )
  }

  if (error || !currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md space-y-6 rounded-3xl bg-white p-8 shadow-lg text-center">
          <div className="text-5xl" aria-hidden>
            ⚠️
          </div>
          <h1 className="text-xl font-semibold text-[#0D1B2A]">We couldn’t open notifications</h1>
          <p className="text-sm text-gray-600">{error ?? "Something went wrong while loading your notifications."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0D1B2A]/70">Here Ta Help</p>
            <h1 className="text-2xl font-semibold text-[#0D1B2A]">Notifications</h1>
            <p className="text-xs text-gray-500">Bids, messages, job updates, and review reminders</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
            >
              ← Dashboard
            </Link>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-2 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
              >
                Mark all read
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6">
        {notifications.length === 0 ? (
          <section className="flex h-80 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#0D1B2A]/30 bg-white p-8 text-center">
            <span className="text-5xl" aria-hidden>
              🔔
            </span>
            <p className="text-lg font-semibold text-[#0D1B2A]">No notifications yet</p>
            <p className="text-sm text-gray-500">We’ll alert you here when there’s new activity on your service requests.</p>
            <Link
              href="/tracking"
              className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
            >
              View my requests
            </Link>
          </section>
        ) : (
          <section className="flex flex-col gap-6">
            {groupedNotifications.map((group) => (
              <div key={group.label} className="flex flex-col gap-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {group.label}
                </div>
                <div className="flex flex-col gap-3">
                  {group.notifications.map((notification) => {
                    const { emoji, label } = repo.getTypeDisplay(notification.type as NotificationType)
                    return (
                      <div
                        key={notification.id}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm transition ${
                          notification.is_read
                            ? "border-gray-200 bg-white"
                            : "border-[#0D1B2A]/30 bg-[#0D1B2A]/5"
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
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleNotificationAction(notification)}
                              className="inline-flex items-center gap-2 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
                            >
                              View details
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(notification.id)}
                              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500 transition hover:bg-gray-100"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

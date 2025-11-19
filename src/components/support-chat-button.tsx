"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

interface SupportChatButtonProps {
  href?: string
  label?: string
  className?: string
}

export function SupportChatButton({
  href = "/contact",
  label = "Chat with Support",
  className,
}: SupportChatButtonProps) {
  return (
    <Link
      href={href}
      className={`
        support-chat-button group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-primary/40 transition hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
        sm:bottom-8 sm:right-8
        ${className ?? ""}
      `}
      aria-label="Chat with support"
    >
      <MessageCircle className="h-5 w-5 transition group-hover:rotate-2" />
      <span>{label}</span>
    </Link>
  )
}

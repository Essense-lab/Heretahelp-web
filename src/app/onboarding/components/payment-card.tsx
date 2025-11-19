"use client"

import { CreditCard } from "lucide-react"

interface PaymentCardProps {
  children: React.ReactNode
}

export function PaymentCard({ children }: PaymentCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 transition-all sm:p-10">
      <header className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0D1B2A]/70 sm:justify-start">
          <CreditCard className="h-5 w-5 text-[#0D1B2A]" />
          Payment Setup
        </div>
        <h2 className="text-2xl font-bold text-[#0D1B2A]">Secure your payment details</h2>
        <p className="text-sm text-slate-600">
          Add a card so we can confirm bookings instantly. You can adjust or remove cards at any time.
        </p>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  )
}

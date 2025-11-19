"use client"

import { Shield } from "lucide-react"

interface MembershipCardProps {
  children: React.ReactNode
}

export function MembershipCard({ children }: MembershipCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 transition-all sm:p-10">
      <header className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0D1B2A]/70 sm:justify-start">
          <Shield className="h-5 w-5 text-[#0D1B2A]" />
          Membership Plans
        </div>
        <h2 className="text-2xl font-bold text-[#0D1B2A]">Choose the coverage that suits you</h2>
        <p className="text-sm text-slate-600">
          Pick from the same plans offered inside the Here Ta Help app. Pricing and perks pull directly from Supabase.
        </p>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  )
}

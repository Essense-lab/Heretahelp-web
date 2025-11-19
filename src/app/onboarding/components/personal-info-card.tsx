"use client"

import { Shield, UserCircle } from "lucide-react"

interface PersonalInfoCardProps {
  children: React.ReactNode
}

export function PersonalInfoCard({ children }: PersonalInfoCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 transition-all sm:p-10">
      <header className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0D1B2A]/70 sm:justify-start">
          <UserCircle className="h-5 w-5 text-[#0D1B2A]" />
          Profile Information
        </div>
        <h2 className="text-2xl font-bold text-[#0D1B2A]">Tell us about yourself</h2>
        <p className="text-sm text-slate-600">
          Update your personal details so technicians arrive prepared with the right context.
        </p>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  )
}

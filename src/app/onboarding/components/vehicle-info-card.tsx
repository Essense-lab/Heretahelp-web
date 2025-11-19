"use client"

import { Car } from "lucide-react"

interface VehicleInfoCardProps {
  children: React.ReactNode
}

export function VehicleInfoCard({ children }: VehicleInfoCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 transition-all sm:p-10">
      <header className="space-y-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-[#0D1B2A]/70 sm:justify-start">
          <Car className="h-5 w-5 text-[#0D1B2A]" />
          Vehicle Setup
        </div>
        <h2 className="text-2xl font-bold text-[#0D1B2A]">Add your primary vehicle</h2>
        <p className="text-sm text-slate-600">
          We use this information to match technicians with the right parts, diagnostics, and experience.
        </p>
      </header>
      <div className="mt-6">{children}</div>
    </div>
  )
}

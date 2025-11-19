"use client"

import Image from "next/image"

interface WelcomeHeroProps {
  onBegin: () => void
}

export function WelcomeHero({ onBegin }: WelcomeHeroProps) {
  const tiers = [
    { title: "Starter", description: "Begin with your first vehicle", emoji: "🚗" },
    { title: "Driver", description: "Book pros whenever you need them", emoji: "⚙️" },
    { title: "Road Hero", description: "Unlock rewards & premium support", emoji: "🏆" },
  ]

  return (
    <section className="grid gap-8 rounded-3xl border border-[#0D1B2A]/10 bg-white/95 p-8 shadow-xl shadow-[#0D1B2A]/10 lg:grid-cols-2">
      <div className="space-y-6 text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start">
          <Image src="/logo.svg" alt="Here Ta Help" width={160} height={80} className="h-20 w-auto" priority />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#0D1B2A]/70">Here Ta Help</p>
          <h1 className="text-3xl font-bold text-[#0D1B2A] sm:text-4xl">Welcome to your repair journey</h1>
          <p className="text-base text-slate-600">
            Follow six simple steps to set up your profile, add your vehicle, choose a membership, and secure your
            preferred payment method. Everything mirrors the experience inside the Here Ta Help app.
          </p>
        </div>
        <button
          onClick={onBegin}
          className="w-full rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] lg:w-auto"
        >
          Begin onboarding
        </button>
      </div>

      <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
        <p className="text-sm font-semibold text-[#0D1B2A]">Your milestones</p>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {tiers.map((tier) => (
            <div
              key={tier.title}
              className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white/80 p-4 text-left shadow-sm"
            >
              <span className="text-3xl" aria-hidden>
                {tier.emoji}
              </span>
              <p className="text-base font-semibold text-[#0D1B2A]">{tier.title}</p>
              <p className="text-sm text-slate-600">{tier.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

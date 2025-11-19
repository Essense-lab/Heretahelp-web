"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"

const services = [
  { emoji: "🚗", title: "Emergency Towing", description: "Fast response for breakdowns and accidents" },
  { emoji: "🔋", title: "Jump Start", description: "Dead battery? We'll get you running again" },
  { emoji: "⛽", title: "Fuel Delivery", description: "Ran out of gas? We'll bring fuel to you" },
  { emoji: "🛞", title: "Flat Tire Change", description: "We'll change your flat tire on the spot" },
  { emoji: "🔓", title: "Lockout Service", description: "Locked out? We can help you get back in" },
  { emoji: "🚙", title: "Long Distance Towing", description: "Need to go far? We've got you covered" },
]

const benefits = [
  { emoji: "⚡", title: "Fast Response", description: "Average arrival time: 25-35 minutes" },
  { emoji: "🎓", title: "Professional Drivers", description: "Experienced and certified tow operators" },
  { emoji: "💰", title: "Fair Pricing", description: "Competitive rates with no hidden charges" },
  { emoji: "🌙", title: "24/7 Availability", description: "Emergency service anytime, day or night" },
  { emoji: "🛡️", title: "Fully Insured", description: "Your vehicle is protected during transport" },
]

export default function TowingOnboardingPage() {
  const router = useRouter()
  const [showAgreement, setShowAgreement] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center gap-3 text-[#0D1B2A]">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-full p-2 text-lg hover:bg-[#0D1B2A]/10"
            aria-label="Back to dashboard"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">🚚 Towing Services</h1>
        </header>

        <section className="mt-8 rounded-3xl bg-[#0D1B2A]/10 p-8 text-center text-[#0D1B2A]">
          <div className="text-6xl" aria-hidden>
            🚚
          </div>
          <h2 className="mt-4 text-2xl font-semibold">24/7 Emergency Towing</h2>
          <p className="mt-3 text-base text-gray-700">Reliable towing and roadside assistance whenever you need it</p>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-[#0D1B2A]">Our Services</h3>
          <div className="mt-4 space-y-4">
            {services.map((service) => (
              <article
                key={service.title}
                className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="text-3xl" aria-hidden>
                  {service.emoji}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#0D1B2A]">{service.title}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold text-[#0D1B2A]">Why Choose Us?</h3>
          <div className="mt-4 space-y-4">
            {benefits.map((item) => (
              <article key={item.title} className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4">
                <div className="text-3xl" aria-hidden>
                  {item.emoji}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#0D1B2A]">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={() => setShowAgreement(true)}
          className="mt-12 w-full rounded-2xl bg-[#0D1B2A] py-4 text-base font-semibold text-white"
        >
          Request Towing Service
        </button>
      </main>

      {showAgreement && <TowingAgreementModal onAgree={() => { setShowAgreement(false); router.push("/towing") }} onCancel={() => setShowAgreement(false)} />}
    </div>
  )
}

interface AgreementProps {
  onAgree: () => void
  onCancel: () => void
}

function TowingAgreementModal({ onAgree, onCancel }: AgreementProps) {
  const [isAgreed, setIsAgreed] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const target = event.currentTarget
    const reachedBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10
    if (reachedBottom) setHasScrolledToBottom(true)
  }

  const sections = [
    {
      title: "1. Service Authorization",
      body:
        "By proceeding, you authorize Here Ta Help and its certified technicians to inspect, diagnose, and perform the agreed-upon repairs or services on your vehicle.",
    },
    {
      title: "2. Estimate and Additional Work",
      body:
        "An initial estimate will be provided before any work begins.\nIf additional issues are discovered, you will be notified and no extra work will be performed without your approval.",
    },
    {
      title: "3. Vehicle Location and Accessibility",
      body:
        "You agree to ensure your vehicle is in a safe, accessible, and legal location where service can be performed.\n\nThis includes:\n• A flat, stable surface (driveway or parking lot)\n• Adequate space around the vehicle for tools and technician access\n• Proper permission to work at that location\n\nIf conditions are unsafe or inaccessible, the technician may decline service and cancellation/reschedule fees may apply.",
    },
    {
      title: "4. Cancellation and Rescheduling Policy",
      body:
        "Once service is scheduled, time and travel are reserved for your appointment.\n\n• Cancellations >24 hrs before: No fee\n• Cancellations within 24 hrs: 25% of service fee\n• Cancellations after technician is en route/on-site: 50%\n• Reschedules within 24 hrs may incur a $25 fee (based on availability)\n• If service cannot be performed due to unsafe or inaccessible conditions, the same fees apply\n\nFees are deducted automatically from escrowed funds.",
    },
    {
      title: "5. Customer-Supplied Parts Policy",
      body:
        "Customers may provide their own parts.\n\n• No warranty is offered on customer-supplied parts\n• If parts are incorrect or incompatible, a $35 fee applies for the technician’s time and travel\n• Only parts supplied through Here Ta Help or authorized partners carry warranty coverage\n• You are responsible for confirming compatibility of all parts you provide",
    },
    {
      title: "6. Liability and Limitations",
      body:
        "Here Ta Help is not responsible for:\n• Pre-existing mechanical or electrical issues\n• Hidden defects not visible during inspection\n• Loss, theft, or damage of personal items left in the vehicle\n• Failures or damages unrelated to the services performed\n• Agreements or transactions made outside the app\n\nAll official communication, quotes, and payments must stay in the app.",
    },
    {
      title: "7. Parts and Warranties",
      body:
        "Parts used by Here Ta Help may be new, remanufactured, or OEM-equivalent depending on availability and service selection.\nWarranties apply only to parts and labor provided through Here Ta Help.",
    },
    {
      title: "8. Payment and Escrow Policy",
      body:
        "Full payment is required before a technician is dispatched.\nPayments are securely held in escrow until:\n• You confirm satisfactory completion, or\n• Five (5) days have passed since completion, whichever comes first\n\nFunds are released to the technician once those conditions are met. If a dispute is filed, funds remain in escrow until it’s resolved.",
    },
    {
      title: "9. Dispute Policy",
      body:
        "If there is a disagreement about quality, completion, or scope of service:\n\n• File a dispute within 48 hours of completion via the app\n• Funds stay in escrow during the investigation\n• Here Ta Help may request photos, messages, and service notes\n• Outcomes may include releasing funds, issuing partial refunds, or splitting amounts\n• All dispute decisions by Here Ta Help are final\n\nIf no dispute is filed within 48 hours, escrowed funds are released automatically.",
    },
    {
      title: "10. Acceptance",
      body:
        "By tapping “I Agree,” you confirm that:\n• You own the vehicle or are an authorized representative\n• You have read, understood, and agree to these terms\n• All transactions, cancellations, and disputes will occur through the Here Ta Help app",
    },
  ]

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Agreement</p>
            <h2 className="text-xl font-semibold text-[#0D1B2A]">Towing Service Agreement</h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </header>

        <div className="px-6 py-3 text-sm text-gray-600">
          Before requesting service, please review and accept the towing terms below.
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mx-6 mb-4 h-[50vh] overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50 p-5"
        >
          <div className="space-y-4">
            {sections.map((section) => (
              <AgreementSection key={section.title} title={section.title} body={section.body} />
            ))}
          </div>
        </div>

        <div className="px-6 pb-3 text-center text-xs font-semibold text-[#0D1B2A]">
          {hasScrolledToBottom ? "✅ All sections viewed" : "⬇️ Please scroll to the bottom to unlock the agreement"}
        </div>

        <footer className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-3 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={isAgreed}
              onChange={(event) => setIsAgreed(event.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#0D1B2A] focus:ring-[#0D1B2A]"
            />
            I have read and agree to the towing service terms.
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-2xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onAgree}
              disabled={!isAgreed || !hasScrolledToBottom}
              className="w-full rounded-2xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              I agree &amp; continue
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

function AgreementSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="space-y-1">
      <p className="text-sm font-semibold text-[#0D1B2A]">{title}</p>
      <p className="text-xs text-gray-700 whitespace-pre-line">{body}</p>
    </section>
  )
}

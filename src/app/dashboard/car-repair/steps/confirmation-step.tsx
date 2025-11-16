'use client'

import { useCarRepair } from '../car-repair-context'

type Props = {
  onClose: () => void
}

export function ConfirmationStep({ onClose }: Props) {
  const { confirmation, service, schedule, location } = useCarRepair()

  return (
    <div className="space-y-6 text-center">
      <div className="text-5xl" aria-hidden>
        🎉
      </div>
      <p className="mx-auto max-w-md text-sm text-gray-600">
        Your {service?.title?.toLowerCase() ?? 'service'} request is scheduled. You will receive a confirmation email and SMS shortly.
      </p>

      <section className="space-y-4 text-left">
        <ConfirmationCard title="Service details" emoji="🛠️">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>{service?.title}</li>
            <li>
              {schedule?.date ? new Date(schedule.date).toLocaleDateString() : 'Pending'}, {schedule?.timeSlot}
            </li>
            <li>{schedule?.technicianName ?? 'Any available technician'} assigned</li>
          </ul>
        </ConfirmationCard>

        <ConfirmationCard title="Location" emoji="📍">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>{location?.streetAddress}</li>
            <li>
              {location?.city}, {location?.state} {location?.zipCode}
            </li>
          </ul>
        </ConfirmationCard>

        <ConfirmationCard title="Receipt" emoji="💳">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Subtotal: ${confirmation?.subtotal.toFixed(2) ?? '0.00'}</li>
            <li>Tax: ${confirmation?.tax.toFixed(2) ?? '0.00'}</li>
            <li>Total charged: ${confirmation?.total.toFixed(2) ?? '0.00'}</li>
            <li>Payment method: {confirmation?.paymentMethod === 'wallet' ? 'Here Ta Help Wallet' : 'Credit / Debit Card'}</li>
          </ul>
        </ConfirmationCard>
      </section>

      <button
        type="button"
        onClick={onClose}
        className="rounded-xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
      >
        Done
      </button>
    </div>
  )
}

type CardProps = {
  title: string
  emoji: string
  children: React.ReactNode
}

function ConfirmationCard({ title, emoji, children }: CardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-2xl" aria-hidden>
          {emoji}
        </span>
        <h3 className="text-lg font-semibold text-[#0D1B2A]">{title}</h3>
      </div>
      {children}
    </article>
  )
}

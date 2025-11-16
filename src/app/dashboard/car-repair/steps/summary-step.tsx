
'use client'

import { useCarRepair } from '../car-repair-context'

type Props = {
  onBack: () => void
  onNext: () => void
  serviceType: 'car' | 'tire' | 'wash'
}

const HEADLINE_MAP = {
  car: 'Car Repair Request',
  tire: 'Tire Service Request',
  wash: 'Mobile Wash Request',
}

export function SummaryStep({ onBack, onNext, serviceType }: Props) {
  const { location, vehicle, service } = useCarRepair()

  if (!location || !vehicle || !service) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        Missing request details. Please go back and complete each step.
      </div>
    )
  }

  const isCarFlow = serviceType === 'car'
  const isRepairBoardFlow = isCarFlow && service.action === 'repair-board'
  const continueLabel = isRepairBoardFlow ? 'Continue to Repair Board' : 'Continue to scheduling'

  const subtotal = service.laborCost + service.partsCost
  const tax = subtotal * 0.07
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between bg-[#0D1B2A] text-white px-4 py-3 rounded-t-2xl">
        <button
          type="button"
          onClick={onBack}
          className="text-white hover:text-gray-300"
        >
          ← Back
        </button>
        <span className="text-lg font-semibold">Review and Confirm</span>
        <div></div> {/* Spacer */}
      </header>

      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
        <div className="text-center mb-4">
          <p className="text-4xl mb-2">✅</p>
          <h2 className="text-xl font-semibold text-[#0D1B2A]">Booking Summary</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Labor</span>
            <span>${service.laborCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Parts</span>
            <span>${service.partsCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax (7%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-blue-300 pt-3 text-base font-semibold text-[#0D1B2A]">
            <span>Amount Due</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <SummaryCard title="Customer Information" emoji="👤">
          <div className="space-y-1 text-sm text-gray-700">
            <p>Name: John Doe</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: john.doe@example.com</p>
          </div>
        </SummaryCard>

        <SummaryCard title="Vehicle Information" emoji="🚗">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>Make: {vehicle.make}</li>
            <li>Model: {vehicle.model}</li>
            <li>Year: {vehicle.year}</li>
            <li>License: {vehicle.licensePlate}</li>
            <li>Color: {vehicle.color}</li>
          </ul>
        </SummaryCard>

        <SummaryCard title="Service Location" emoji="📍">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>{location.streetAddress}</li>
            <li>
              {location.city}, {location.state} {location.zipCode}
            </li>
            {location.crossStreet && <li>Cross street: {location.crossStreet}</li>}
          </ul>
        </SummaryCard>

        <SummaryCard title="Service Details" emoji="🔧">
          <ul className="space-y-1 text-sm text-gray-700">
            <li>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </li>
            {vehicle.trim && <li>Trim: {vehicle.trim}</li>}
            {vehicle.engineSize && <li>Engine: {vehicle.engineSize}</li>}
            {vehicle.fuelType && <li>Fuel: {vehicle.fuelType}</li>}
            {vehicle.transmission && <li>Transmission: {vehicle.transmission}</li>}
            {vehicle.driveType && <li>Drive type: {vehicle.driveType}</li>}
            {vehicle.mileage && <li>Mileage: {vehicle.mileage}</li>}
            {vehicle.vin && <li>VIN: {vehicle.vin}</li>}
            {vehicle.tireSize && <li>Tire size: {vehicle.tireSize}</li>}
          </ul>
        </SummaryCard>

        <SummaryCard title="Selected service" emoji={service.emoji ?? '🛠️'}>
          <div className="space-y-3">
            {/* Service Details */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-[#0D1B2A] text-lg">{service.title}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>

              {/* Hierarchical Service Info */}
              {isCarFlow && service.category && service.subcategory && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="rounded-full bg-gray-100 px-2 py-1">{service.category}</span>
                  <span>›</span>
                  <span className="rounded-full bg-gray-100 px-2 py-1">{service.subcategory}</span>
                  {service.specification && (
                    <>
                      <span>›</span>
                      <span className="rounded-full bg-gray-100 px-2 py-1">{service.specification}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Type */}
            {isCarFlow && service.action && (
              <div className="rounded-xl bg-[#0D1B2A]/5 px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#0D1B2A]">
                    {service.action === 'schedule' ? 'Schedule service now' : 'Post to Repair Board'}
                  </span>
                  <span className="text-xs text-gray-600">
                    {service.action === 'schedule' ? 'Immediate scheduling' : 'Collect technician bids'}
                  </span>
                </div>
              </div>
            )}

            {/* Parts Information */}
            {isCarFlow && (
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#0D1B2A]">Parts</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.hasOwnParts
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {service.hasOwnParts ? 'Customer supplied' : 'Technician sourced'}
                  </span>
                </div>

                {!service.hasOwnParts && service.selectedParts && service.selectedParts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {service.selectedParts.map((part, index) => (
                      <div key={index} className="flex items-center justify-between text-sm text-gray-600">
                        <span>{part.partName} × {part.quantity}</span>
                        <span>${(part.unitPrice * part.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {service.hasOwnParts && (
                  <p className="mt-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">
                    Customer-supplied parts are not covered under warranty
                  </p>
                )}
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="border-t border-gray-200 pt-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Estimated price</span>
                  <span className="font-medium">{service.priceRange}</span>
                </div>
                {isCarFlow && service.selectedParts && service.selectedParts.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <p>Price includes selected parts and labor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SummaryCard>
      </section>

      <div className="rounded-2xl border border-[#0D1B2A]/15 bg-white px-4 py-3 text-sm text-gray-600">
        {isRepairBoardFlow ? (
          <>
            <strong>{HEADLINE_MAP[serviceType]}</strong> — After you continue, complete the Repair Board posting details and finish secure checkout to share your request with technicians.
          </>
        ) : (
          <>
            <strong>{HEADLINE_MAP[serviceType]}</strong> — After you continue, choose a time, review the service agreement, and confirm payment to dispatch a verified technician.
          </>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}

type CardProps = {
  title: string
  emoji: string
  children: React.ReactNode
}

function SummaryCard({ title, emoji, children }: CardProps) {
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

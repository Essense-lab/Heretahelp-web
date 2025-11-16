'use client'

import { CAR_ONBOARDING_BENEFITS, CAR_ONBOARDING_SERVICES, SERVICE_LABEL_MAP } from '../data'

type Props = {
  serviceType: keyof typeof SERVICE_LABEL_MAP
  onBack: () => void
  onGetStarted: () => void
}

export function CarRepairIntro({ serviceType, onBack, onGetStarted }: Props) {
  const serviceLabel = SERVICE_LABEL_MAP[serviceType]

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0D1B2A] text-lg text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
        >
          ←
        </button>
        <div>
          <p className="text-sm font-medium text-[#0D1B2A]/70">Mobile Services</p>
          <h1 className="text-2xl font-semibold text-[#0D1B2A]">{serviceLabel}</h1>
        </div>
      </header>

      <section className="rounded-3xl bg-[#0D1B2A]/10 p-8 text-center">
        <div className="flex justify-center text-6xl" aria-hidden>
          {serviceType === 'wash' ? '🧼' : serviceType === 'tire' ? '🛞' : '🚗'}
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-[#0D1B2A]">
          Professional {serviceLabel}
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          Expert technicians come to your location for diagnostics, repairs, and preventative maintenance without the shop wait.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0D1B2A]">Our Services</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {CAR_ONBOARDING_SERVICES.map((service) => (
            <article key={service.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>
                  {service.emoji}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[#0D1B2A]">{service.title}</h4>
                  <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#0D1B2A]">Why choose us?</h3>
        <div className="space-y-4">
          {CAR_ONBOARDING_BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden>
                {benefit.emoji}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-[#0D1B2A]">{benefit.title}</h4>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onGetStarted}
        className="w-full rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
      >
        Request {serviceLabel}
      </button>
    </div>
  )
}

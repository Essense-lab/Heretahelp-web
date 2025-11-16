'use client'

import { useEffect, useState } from 'react'
import { useCarRepair } from '../car-repair-context'

type Props = {
  onNext: () => void
  onBack: () => void
  onCancel: () => void
  serviceLabel: string
  stepIndex: number
  totalSteps: number
}

type LocationForm = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  crossStreet: string
}

const INITIAL_FORM: LocationForm = {
  streetAddress: '',
  city: '',
  state: '',
  zipCode: '',
  crossStreet: '',
}

export function LocationStep({ onNext, onBack, onCancel, serviceLabel, stepIndex, totalSteps }: Props) {
  const { location, setLocation } = useCarRepair()
  const [form, setForm] = useState<LocationForm>(INITIAL_FORM)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (location) {
      setForm({
        streetAddress: location.streetAddress,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        crossStreet: location.crossStreet ?? '',
      })
    }
  }, [location])

  const handleChange = (field: keyof LocationForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleAutoFill = () => {
    if (!('geolocation' in navigator)) {
      setError('Location services are not supported on this device.')
      return
    }

    setIsAutoFilling(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            { headers: { 'User-Agent': 'HereTaHelp-Web/1.0' } }
          )

          if (!response.ok) {
            throw new Error('Unable to fetch address details.')
          }

          const data = await response.json()
          const address = data.address ?? {}

          setForm({
            streetAddress: [address.house_number, address.road].filter(Boolean).join(' '),
            city: address.city || address.town || address.village || '',
            state: address.state || '',
            zipCode: address.postcode || '',
            crossStreet: '',
          })
        } catch (autoError: any) {
          setError(autoError?.message ?? 'Unable to determine your location right now.')
        } finally {
          setIsAutoFilling(false)
        }
      },
      (geoError) => {
        setIsAutoFilling(false)
        setError(
          geoError.code === geoError.PERMISSION_DENIED
            ? 'Location permission was denied. Please enter your address manually.'
            : 'Unable to access your location right now.'
        )
      },
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.streetAddress || !form.city || !form.state || !form.zipCode) {
      setError('Please complete all required address fields before continuing.')
      return
    }

    setLocation({
      streetAddress: form.streetAddress,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      crossStreet: form.crossStreet || undefined,
    })

    onNext()
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0D1B2A] text-lg text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
          aria-label="Back"
        >
          ←
        </button>
        <div className="text-right text-sm font-semibold text-[#0D1B2A]">
          Step {stepIndex + 1} of {totalSteps}
        </div>
      </header>

      <div className="space-y-2 text-center">
        <p className="text-4xl" aria-hidden>
          📍
        </p>
        <h2 className="text-2xl font-semibold text-[#0D1B2A]">Service location</h2>
        <p className="text-sm text-gray-600">
          Tell us where to send your {serviceLabel.toLowerCase()} technician. We’ll confirm this address before dispatching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <label className="block space-y-1 text-sm font-medium">
            <span>Street address *</span>
            <input
              value={form.streetAddress}
              onChange={(event) => handleChange('streetAddress', event.target.value)}
              placeholder="123 Main Street"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              <span>City *</span>
              <input
                value={form.city}
                onChange={(event) => handleChange('city', event.target.value)}
                placeholder="San Francisco"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              <span>State *</span>
              <input
                value={form.state}
                onChange={(event) => handleChange('state', event.target.value)}
                placeholder="CA"
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
                maxLength={2}
              />
            </label>
          </div>

          <label className="space-y-1 text-sm font-medium">
            <span>ZIP code *</span>
            <input
              value={form.zipCode}
              onChange={(event) => handleChange('zipCode', event.target.value)}
              placeholder="94105"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>

          <label className="space-y-1 text-sm font-medium">
            <span>Nearest cross street (optional)</span>
            <input
              value={form.crossStreet}
              onChange={(event) => handleChange('crossStreet', event.target.value)}
              placeholder="Near Oak Avenue"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={isAutoFilling}
            className="inline-flex items-center rounded-xl border border-[#0D1B2A] px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAutoFilling ? 'Locating…' : 'Use My Current Location'}
          </button>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PricingConfigRepository, type BidBasedPricingConfig, type FixedPriceConfig } from '@/lib/repositories/pricing-config-repository'
import { ServicePricingOptionsRepository } from '@/lib/repositories/service-pricing-options-repository'
import { DiscountService } from '@/lib/repositories/discount-service'
import { createSupabaseClient } from '@/lib/supabase'

const formatCurrency = (value: number) => `$${Number.isFinite(value) ? value.toFixed(2) : '0.00'}`

type VehicleSummary = {
  year?: string
  make?: string
  model?: string
  engineSize?: string
}

type LocationSummary = {
  streetAddress?: string
  city?: string
  state?: string
  zipCode?: string
}

export type RepairBoardPostDraft = {
  pricingType: 'BID' | 'FIXED_PRICE'
  problemDescription: string
  dateTimePreference: 'ASAP' | 'FLEXIBLE' | 'SPECIFIC_DATETIME'
  preferredDateTime?: string
  maxBidBudget?: number
  fixedBudget?: number
  taxAmount: number
  postingFee: number
  serviceFee: number
  platformFee: number
  totalCost: number
  serviceEstimate: number
  minBidBudget: number
  minFixedBudget: number
  photoFiles: File[]
  locationLatitude?: number | null
  locationLongitude?: number | null
  discountAmount?: number
  discountId?: string | null
}

export type RepairBoardCheckoutPayload = {
  discountAmount: number
  discountId: string | null
}

export type RepairBoardConfirmationSummary = {
  postId: string
  totalPaid: number
  pricingType: 'BID' | 'FIXED_PRICE'
  problemDescription: string
  photoUrls: string[]
  serviceName: string
  discountId?: string | null
}

type RepairBoardPostDialogProps = {
  open: boolean
  onClose: () => void
  categoryName: string
  categoryEmoji?: string
  subcategoryName: string
  specificationName?: string | null
  vehicle?: VehicleSummary | null
  location?: LocationSummary | null
  serviceEstimate: number
  initialDraft?: RepairBoardPostDraft | null
  onSubmit: (draft: RepairBoardPostDraft) => void
}

type PricingState = {
  bidConfig: BidBasedPricingConfig
  fixedConfig: FixedPriceConfig
  minBidPercentage: number
  fixedPricePercentage: number
}

const DEFAULT_PRICING_STATE: PricingState = {
  bidConfig: {
    id: 'default',
    taxRate: 0,
    postingFee: 0,
    serviceFee: 0,
    platformFeeRate: 0,
  },
  fixedConfig: {
    id: 'default',
    taxRate: 0,
    postingFee: 0,
    serviceFee: 0,
    platformFeeRate: 0,
  },
  minBidPercentage: 10,
  fixedPricePercentage: 100,
}

type SelectedPhoto = {
  file: File
  preview: string
}

const computeBidBreakdown = (amount: number, config: BidBasedPricingConfig) => {
  const taxAmount = amount * config.taxRate
  const platformFee = amount * config.platformFeeRate
  const totalCost = amount + taxAmount + config.postingFee + config.serviceFee + platformFee
  return {
    taxAmount,
    postingFee: config.postingFee,
    serviceFee: config.serviceFee,
    platformFee,
    totalCost,
  }
}

const computeFixedBreakdown = (amount: number, config: FixedPriceConfig) => {
  const taxAmount = amount * config.taxRate
  const platformFee = amount * config.platformFeeRate
  const totalCost = amount + taxAmount + config.postingFee + config.serviceFee + platformFee
  return {
    taxAmount,
    postingFee: config.postingFee,
    serviceFee: config.serviceFee,
    platformFee,
    totalCost,
  }
}

export function RepairBoardPostDialog({
  open,
  onClose,
  categoryName,
  categoryEmoji,
  subcategoryName,
  specificationName,
  vehicle,
  location,
  serviceEstimate,
  initialDraft,
  onSubmit,
}: RepairBoardPostDialogProps) {
  const [pricingState, setPricingState] = useState<PricingState>(DEFAULT_PRICING_STATE)
  const [isLoadingPricing, setIsLoadingPricing] = useState(false)
  const [pricingError, setPricingError] = useState<string | null>(null)

  const [pricingType, setPricingType] = useState<'BID' | 'FIXED_PRICE'>('BID')
  const [problemDescription, setProblemDescription] = useState('')
  const [datePreference, setDatePreference] = useState<'ASAP' | 'FLEXIBLE' | 'SPECIFIC_DATETIME'>('ASAP')
  const [specificDate, setSpecificDate] = useState('')
  const [specificTime, setSpecificTime] = useState('')
  const [maxBidBudget, setMaxBidBudget] = useState('')
  const [fixedBudget, setFixedBudget] = useState('')
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [locationStatus, setLocationStatus] = useState<string>('Fetching location…')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return

    setIsLoadingPricing(true)
    setPricingError(null)

    const pricingRepo = new PricingConfigRepository()
    const optionsRepo = new ServicePricingOptionsRepository()

    Promise.all([
      pricingRepo.fetchActiveBidBasedConfig(),
      pricingRepo.fetchActiveFixedConfig(),
      optionsRepo.fetchAcceptBidsMinimumPercentage(),
      optionsRepo.fetchFixedPricePercentage(),
    ])
      .then(([bidConfig, fixedConfig, minBidPct, fixedPct]) => {
        setPricingState({
          bidConfig,
          fixedConfig,
          minBidPercentage: minBidPct,
          fixedPricePercentage: fixedPct,
        })
      })
      .catch((error) => {
        console.error('Failed to load pricing configuration', error)
        setPricingError('Unable to load pricing configuration. Using defaults.')
        setPricingState(DEFAULT_PRICING_STATE)
      })
      .finally(() => setIsLoadingPricing(false))
  }, [open])

  useEffect(() => {
    if (!open) return
    let cancelled = false

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (cancelled) return
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude })
          setLocationStatus('Location captured')
        },
        () => {
          if (cancelled) return
          setLocationStatus('Location not available. You can still continue.')
        },
        { timeout: 5000 }
      )
    } else {
      setLocationStatus('Location not supported in this browser. Continue manually.')
    }

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview))
      setPhotos([])
      setProblemDescription('')
      setMaxBidBudget('')
      setFixedBudget('')
      setSpecificDate('')
      setSpecificTime('')
      setDatePreference('ASAP')
      setPricingType('BID')
      setCoords(null)
      setLocationStatus('Fetching location…')
    }
  }, [open])

  useEffect(() => {
    if (!open || !initialDraft) return

    setPricingType(initialDraft.pricingType)
    setProblemDescription(initialDraft.problemDescription)
    setDatePreference(initialDraft.dateTimePreference)

    if (initialDraft.dateTimePreference === 'SPECIFIC_DATETIME' && initialDraft.preferredDateTime) {
      const preferred = new Date(initialDraft.preferredDateTime)
      if (!Number.isNaN(preferred.valueOf())) {
        const year = preferred.getFullYear()
        const month = String(preferred.getMonth() + 1).padStart(2, '0')
        const day = String(preferred.getDate()).padStart(2, '0')
        const hours = String(preferred.getHours()).padStart(2, '0')
        const minutes = String(preferred.getMinutes()).padStart(2, '0')
        setSpecificDate(`${year}-${month}-${day}`)
        setSpecificTime(`${hours}:${minutes}`)
      }
    } else {
      setSpecificDate('')
      setSpecificTime('')
    }

    setMaxBidBudget(
      initialDraft.pricingType === 'BID' && initialDraft.maxBidBudget
        ? String(initialDraft.maxBidBudget)
        : ''
    )
    setFixedBudget(
      initialDraft.pricingType === 'FIXED_PRICE' && initialDraft.fixedBudget
        ? String(initialDraft.fixedBudget)
        : ''
    )

    setCoords(() => {
      if (initialDraft.locationLatitude != null && initialDraft.locationLongitude != null) {
        setLocationStatus('Location captured')
        return { lat: initialDraft.locationLatitude, lng: initialDraft.locationLongitude }
      }

      setLocationStatus('Location not available. You can still continue.')
      return null
    })

    setPhotos((previous) => {
      previous.forEach((photo) => URL.revokeObjectURL(photo.preview))
      if (!initialDraft.photoFiles?.length) return []
      return initialDraft.photoFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    })
  }, [initialDraft, open])

  const minBidBudget = useMemo(
    () => (serviceEstimate * pricingState.minBidPercentage) / 100,
    [serviceEstimate, pricingState.minBidPercentage]
  )

  const minFixedBudget = useMemo(
    () => (serviceEstimate * pricingState.fixedPricePercentage) / 100,
    [serviceEstimate, pricingState.fixedPricePercentage]
  )

  const currentBudgetValue = pricingType === 'BID' ? Number(maxBidBudget) : Number(fixedBudget)
  const isBudgetValid = pricingType === 'BID'
    ? Number.isFinite(currentBudgetValue) && currentBudgetValue >= minBidBudget
    : Number.isFinite(currentBudgetValue) && currentBudgetValue >= minFixedBudget

  const isDescriptionValid = problemDescription.trim().length >= 10

  const breakdown = useMemo(() => {
    if (!isBudgetValid) {
      return {
        taxAmount: 0,
        postingFee: 0,
        serviceFee: 0,
        platformFee: 0,
        totalCost: 0,
      }
    }

    return pricingType === 'BID'
      ? computeBidBreakdown(currentBudgetValue, pricingState.bidConfig)
      : computeFixedBreakdown(currentBudgetValue, pricingState.fixedConfig)
  }, [currentBudgetValue, isBudgetValid, pricingType, pricingState])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (!files.length) return
    const remainingSlots = 5 - photos.length
    const limited = files.slice(0, remainingSlots)
    const next = limited.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setPhotos((prev) => [...prev, ...next])
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev]
      const [removed] = next.splice(index, 1)
      if (removed) URL.revokeObjectURL(removed.preview)
      return next
    })
  }

  const preferredDateTime = useMemo(() => {
    if (datePreference !== 'SPECIFIC_DATETIME') return undefined
    if (!specificDate || !specificTime) return undefined
    try {
      return new Date(`${specificDate}T${specificTime}`)?.toISOString()
    } catch (error) {
      console.warn('Failed to parse preferred date/time', error)
      return undefined
    }
  }, [datePreference, specificDate, specificTime])

  const canSubmit =
    isDescriptionValid &&
    isBudgetValid &&
    (!isLoadingPricing || pricingError !== null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Repair Board • {categoryEmoji ? `${categoryEmoji} ` : ''}{categoryName}
            </p>
            <h2 className="text-2xl font-semibold text-[#0D1B2A]">Post to Repair Board</h2>
            <p className="text-sm text-gray-600">
              Share details about your {subcategoryName.toLowerCase()} so technicians can provide accurate bids.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="space-y-6 px-6 py-5">
          {pricingError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {pricingError}
            </div>
          ) : null}

          <section className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-[#0D1B2A]">Service</p>
              <p className="text-sm text-gray-600">{subcategoryName}</p>
              {specificationName ? (
                <p className="text-xs text-gray-500">{specificationName}</p>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D1B2A]">Vehicle</p>
              <p className="text-sm text-gray-600">
                {vehicle?.year && vehicle?.make && vehicle?.model ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle details required'}
              </p>
              {vehicle?.engineSize ? (
                <p className="text-xs text-gray-500">Engine: {vehicle.engineSize}</p>
              ) : null}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D1B2A]">Location</p>
              <p className="text-sm text-gray-600">
                {location?.streetAddress && location?.city && location?.state && location?.zipCode
                  ? `${location.streetAddress}, ${location.city}, ${location.state} ${location.zipCode}`
                  : 'Location required'}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D1B2A]">Estimate</p>
              <p className="text-sm text-gray-600">{formatCurrency(serviceEstimate)}</p>
              <p className="text-xs text-gray-500">Used to calculate minimum budgets and fees</p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="problem-description" className="flex items-center gap-2 text-sm font-semibold text-[#0D1B2A]">
                Describe the issue
                <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-600">
                  Required
                </span>
              </label>
              <textarea
                id="problem-description"
                rows={4}
                value={problemDescription}
                onChange={(event) => setProblemDescription(event.target.value)}
                className={`w-full rounded-2xl border px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#0D1B2A] focus:outline-none ${
                  isDescriptionValid ? 'border-gray-300' : 'border-rose-400'
                }`}
                placeholder="Provide as much detail as possible so technicians can offer accurate bids."
              />
              <p className={`text-xs ${isDescriptionValid ? 'text-gray-500' : 'text-rose-600'}`}>
                Minimum 10 characters required to continue.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#0D1B2A]">Pricing</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPricingType('BID')}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    pricingType === 'BID'
                      ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white shadow'
                      : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                  }`}
                >
                  <span className="block font-semibold">Accept bids</span>
                  <span className="block text-xs opacity-80">
                    Technicians submit offers (minimum {formatCurrency(minBidBudget)}).
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPricingType('FIXED_PRICE')}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                    pricingType === 'FIXED_PRICE'
                      ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white shadow'
                      : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                  }`}
                >
                  <span className="block font-semibold">Set a fixed price</span>
                  <span className="block text-xs opacity-80">
                    Name your price (minimum {formatCurrency(minFixedBudget)}).
                  </span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                  {pricingType === 'BID' ? 'Maximum price you will pay' : 'Your fixed price'}
                  <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-rose-600">
                    Required
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={pricingType === 'BID' ? maxBidBudget : fixedBudget}
                  onChange={(event) =>
                    pricingType === 'BID' ? setMaxBidBudget(event.target.value) : setFixedBudget(event.target.value)
                  }
                  className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none ${
                    isBudgetValid || (!maxBidBudget && !fixedBudget) ? 'border-gray-300' : 'border-amber-500'
                  }`}
                  placeholder={pricingType === 'BID' ? formatCurrency(minBidBudget) : formatCurrency(minFixedBudget)}
                />
                {!isBudgetValid && (maxBidBudget || fixedBudget) ? (
                  <p className="text-xs text-amber-600">
                    {pricingType === 'BID'
                      ? `Minimum allowed is ${formatCurrency(minBidBudget)}.`
                      : `Minimum allowed is ${formatCurrency(minFixedBudget)}.`}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                <p className="font-semibold text-[#0D1B2A]">Payment breakdown</p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>{pricingType === 'BID' ? 'Maximum bid' : 'Your price'}</span>
                    <span>{formatCurrency(isBudgetValid ? currentBudgetValue : 0)}</span>
                  </div>
                  {breakdown.taxAmount > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>Tax</span>
                      <span>{formatCurrency(breakdown.taxAmount)}</span>
                    </div>
                  ) : null}
                  {breakdown.postingFee > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>Posting fee</span>
                      <span>{formatCurrency(breakdown.postingFee)}</span>
                    </div>
                  ) : null}
                  {breakdown.serviceFee > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>Service fee</span>
                      <span>{formatCurrency(breakdown.serviceFee)}</span>
                    </div>
                  ) : null}
                  {breakdown.platformFee > 0 ? (
                    <div className="flex items-center justify-between">
                      <span>Platform fee</span>
                      <span>{formatCurrency(breakdown.platformFee)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-2 text-base font-semibold text-[#0D1B2A]">
                    <span>Total payment</span>
                    <span>{formatCurrency(breakdown.totalCost)}</span>
                  </div>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
              <header className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0D1B2A]">Photos</h3>
                <span className="text-xs font-medium text-gray-500">{photos.length}/5</span>
              </header>
              <p className="mt-2 text-xs text-gray-500">
                Add clear photos of the problem area so technicians can provide accurate bids.
              </p>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photos.length >= 5}
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    photos.length >= 5
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      : 'border-[#0D1B2A] text-[#0D1B2A] hover:bg-[#0D1B2A]/5'
                  }`}
                >
                  <span aria-hidden>📷</span>
                  <span>{photos.length >= 5 ? 'Photo limit reached' : 'Add photo'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {photos.length ? (
                  <div className="space-y-3">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.preview}
                        className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200">
                            <img src={photo.preview} alt={`Selected ${index + 1}`} className="h-full w-full object-cover" />
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <p className="font-semibold text-[#0D1B2A]">Photo {index + 1}</p>
                            <p>Ready to upload</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
              <header className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-[#0D1B2A]">📅 When do you need this service?</h3>
                <p className="text-xs text-gray-500">Pick what works best. Technicians see this when sending offers.</p>
              </header>

              <div className="mt-4 space-y-3">
                <button
                  type="button"
                  onClick={() => setDatePreference('ASAP')}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    datePreference === 'ASAP'
                      ? 'border-[#0D1B2A] bg-[#0D1B2A]/5 text-[#0D1B2A] shadow'
                      : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                  }`}
                >
                  <span aria-hidden>⚡</span>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">ASAP</p>
                    <p className="text-xs text-gray-600">As soon as possible</p>
                  </div>
                  <span className="text-xs font-semibold">{datePreference === 'ASAP' ? 'Selected' : ''}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDatePreference('SPECIFIC_DATETIME')
                  }}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    datePreference === 'SPECIFIC_DATETIME'
                      ? 'border-[#0D1B2A] bg-[#0D1B2A]/5 text-[#0D1B2A] shadow'
                      : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                  }`}
                >
                  <span aria-hidden>🗓️</span>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">Specific date & time</p>
                    <p className="text-xs text-gray-600">
                      {preferredDateTime
                        ? new Date(preferredDateTime).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                        : 'Choose what works best for you'}
                    </p>
                  </div>
                  <span className="text-xs font-semibold">{datePreference === 'SPECIFIC_DATETIME' ? 'Selected' : ''}</span>
                </button>

                {datePreference === 'SPECIFIC_DATETIME' ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Date</label>
                      <input
                        type="date"
                        value={specificDate}
                        onChange={(event) => setSpecificDate(event.target.value)}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-gray-600">Time</label>
                      <input
                        type="time"
                        value={specificTime}
                        onChange={(event) => setSpecificTime(event.target.value)}
                        className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
                      />
                    </div>
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => setDatePreference('FLEXIBLE')}
                  className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    datePreference === 'FLEXIBLE'
                      ? 'border-[#0D1B2A] bg-[#0D1B2A]/5 text-[#0D1B2A] shadow'
                      : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                  }`}
                >
                  <span aria-hidden>🌤️</span>
                  <div className="flex-1 text-sm">
                    <p className="font-semibold">Flexible</p>
                    <p className="text-xs text-gray-600">Anytime within the next week</p>
                  </div>
                  <span className="text-xs font-semibold">{datePreference === 'FLEXIBLE' ? 'Selected' : ''}</span>
                </button>
              </div>
            </section>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              <p className="font-semibold text-[#0D1B2A]">Location</p>
              <p className="mt-1 text-xs text-gray-500">{locationStatus}</p>
            </div>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            Payment is held in escrow. You can edit or cancel your post anytime from My Requests.
          </div>
          <button
            type="button"
            disabled={!canSubmit || isLoadingPricing}
            onClick={() => {
              if (!canSubmit) return

              const draft: RepairBoardPostDraft = {
                pricingType,
                problemDescription: problemDescription.trim(),
                dateTimePreference: datePreference,
                preferredDateTime,
                maxBidBudget: pricingType === 'BID' ? currentBudgetValue : undefined,
                fixedBudget: pricingType === 'FIXED_PRICE' ? currentBudgetValue : undefined,
                taxAmount: breakdown.taxAmount,
                postingFee: breakdown.postingFee,
                serviceFee: breakdown.serviceFee,
                platformFee: breakdown.platformFee,
                totalCost: breakdown.totalCost,
                serviceEstimate,
                minBidBudget,
                minFixedBudget,
                photoFiles: photos.map((photo) => photo.file),
                locationLatitude: coords?.lat ?? null,
                locationLongitude: coords?.lng ?? null,
              }

              onSubmit(draft)
            }}
            className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue to payment
          </button>
        </footer>
      </div>
    </div>
  )
}

type RepairBoardCheckoutDialogProps = {
  open: boolean
  draft: RepairBoardPostDraft
  categoryName: string
  subcategoryName: string
  specificationName?: string | null
  onBack: () => void
  onConfirm: (payload: RepairBoardCheckoutPayload) => Promise<void>
  onApplyDiscount: (code: string, orderTotal: number) => Promise<{ success: boolean; amount: number; id: string | null; message?: string }>
  isSubmitting: boolean
  errorMessage?: string | null
}

export function RepairBoardCheckoutDialog({
  open,
  draft,
  categoryName,
  subcategoryName,
  specificationName,
  onBack,
  onConfirm,
  onApplyDiscount,
  isSubmitting,
  errorMessage,
}: RepairBoardCheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card')
  const [discountCode, setDiscountCode] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [appliedDiscountId, setAppliedDiscountId] = useState<string | null>(null)
  const [discountError, setDiscountError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setPaymentMethod('card')
      setDiscountCode('')
      setDiscountAmount(0)
      setAppliedDiscountId(null)
      setDiscountError(null)
    }
  }, [open])

  if (!open) return null

  const totalAfterDiscount = Math.max(draft.totalCost - discountAmount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-sm font-medium text-gray-500">Repair Board • Checkout</p>
            <h2 className="text-2xl font-semibold text-[#0D1B2A]">Secure payment</h2>
            <p className="text-sm text-gray-600">
              Funds are held in escrow until you approve the technician's work.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
            aria-label="Back"
          >
            ←
          </button>
        </header>

        <div className="space-y-6 px-6 py-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Summary</h3>
            <dl className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Service</dt>
                <dd>{subcategoryName}</dd>
              </div>
              {specificationName ? (
                <div className="flex items-center justify-between">
                  <dt>Specification</dt>
                  <dd>{specificationName}</dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <dt>Pricing type</dt>
                <dd>{draft.pricingType === 'BID' ? 'Accept bids' : 'Fixed price'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>{draft.pricingType === 'BID' ? 'Maximum bid' : 'Fixed price'}</dt>
                <dd>{formatCurrency(draft.pricingType === 'BID' ? draft.maxBidBudget ?? 0 : draft.fixedBudget ?? 0)}</dd>
              </div>
              {draft.taxAmount > 0 ? (
                <div className="flex items-center justify-between">
                  <dt>Estimated tax</dt>
                  <dd>{formatCurrency(draft.taxAmount)}</dd>
                </div>
              ) : null}
              {draft.postingFee > 0 ? (
                <div className="flex items-center justify-between">
                  <dt>Posting fee</dt>
                  <dd>{formatCurrency(draft.postingFee)}</dd>
                </div>
              ) : null}
              {draft.serviceFee > 0 ? (
                <div className="flex items-center justify_between">
                  <dt>Service fee</dt>
                  <dd>{formatCurrency(draft.serviceFee)}</dd>
                </div>
              ) : null}
              {draft.platformFee > 0 ? (
                <div className="flex items-center justify-between">
                  <dt>Platform fee</dt>
                  <dd>{formatCurrency(draft.platformFee)}</dd>
                </div>
              ) : null}
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-base font-semibold text-[#0D1B2A]">
              <span>Total due</span>
              <span>{formatCurrency(draft.totalCost)}</span>
            </div>
            {discountAmount > 0 ? (
              <div className="flex items-center justify-between text-sm text-green-600">
                <span>Discount applied</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            ) : null}
            <div className="mt-1 flex items-center justify-between text-lg font-semibold text-[#0D1B2A]">
              <span>Amount to pay</span>
              <span>{formatCurrency(totalAfterDiscount)}</span>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Payment method</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  paymentMethod === 'card'
                    ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white shadow'
                    : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                }`}
              >
                <span className="block font-semibold">Credit / Debit card</span>
                <span className="block text-xs opacity-80">Funds held securely in escrow.</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  paymentMethod === 'wallet'
                    ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white shadow'
                    : 'border-gray-200 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                }`}
              >
                <span className="block font-semibold">Here Ta Help wallet</span>
                <span className="block text-xs opacity-80">Use existing balance if available.</span>
              </button>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Discount code</h3>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={discountCode}
                onChange={(event) => setDiscountCode(event.target.value.toUpperCase())}
                disabled={isApplyingDiscount || discountAmount > 0}
                placeholder="Enter code"
                className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none disabled:opacity-60"
              />
              <button
                type="button"
                disabled={!discountCode || isApplyingDiscount || discountAmount > 0}
                onClick={async () => {
                  if (!discountCode) return
                  setIsApplyingDiscount(true)
                  setDiscountError(null)
                  try {
                    const result = await onApplyDiscount(discountCode, draft.totalCost)
                    if (result.success && result.amount > 0) {
                      setDiscountAmount(result.amount)
                      setAppliedDiscountId(result.id ?? null)
                    } else {
                      setDiscountError(result.message ?? 'Discount code could not be applied.')
                    }
                  } catch (error) {
                    console.error('Discount error', error)
                    setDiscountError('Unable to validate code right now. Please try again later.')
                  } finally {
                    setIsApplyingDiscount(false)
                  }
                }}
                className="rounded-xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplyingDiscount ? 'Checking…' : discountAmount > 0 ? 'Applied' : 'Apply'}
              </button>
            </div>
            {discountError ? <p className="text-xs text-amber-600">{discountError}</p> : null}
          </section>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onConfirm({ discountAmount, discountId: appliedDiscountId })}
            className="rounded-xl bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Posting…' : `Pay ${formatCurrency(totalAfterDiscount)}`}
          </button>
        </footer>
      </div>
    </div>
  )
}

type RepairBoardConfirmationDialogProps = {
  open: boolean
  summary: RepairBoardConfirmationSummary
  onClose: () => void
}

export function RepairBoardConfirmationDialog({ open, summary, onClose }: RepairBoardConfirmationDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="px-6 py-8 text-center">
          <div className="text-4xl" aria-hidden>
            🎉
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-[#0D1B2A]">Job posted to the Repair Board</h2>
          <p className="mt-2 text-sm text-gray-600">
            Technicians are reviewing your request. We'll notify you when bids arrive.
          </p>

          <section className="mt-6 space-y-3 text-left text-sm text-gray-600">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#0D1B2A]">Summary</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Post ID</span>
                  <span className="font-mono text-xs">{summary.postId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service</span>
                  <span>{summary.serviceName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pricing</span>
                  <span>{summary.pricingType === 'BID' ? 'Accept bids' : 'Fixed price'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total paid</span>
                  <span className="font-semibold text-[#0D1B2A]">{formatCurrency(summary.totalPaid)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-[#0D1B2A]">Problem description</p>
              <p className="mt-1 text-sm text-gray-600">{summary.problemDescription}</p>
            </div>
          </section>

          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export async function applyDiscountCode(code: string, orderAmount: number) {
  const supabase = createSupabaseClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      amount: 0,
      id: null,
      message: 'You must be signed in to use discount codes.',
    }
  }

  const discountService = new DiscountService()
  const result = await discountService.validateDiscount(code, user.id, orderAmount)

  if (!result.isValid || !result.discountId) {
    return {
      success: false,
      amount: 0,
      id: null,
      message: result.message ?? 'Discount code not valid.',
    }
  }

  return {
    success: true,
    amount: result.discountAmount,
    id: result.discountId,
    message: result.message ?? undefined,
  }
}

'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { useCarRepair } from '../car-repair-context'
import {
  AvailabilityRepository,
  TechnicianRecord,
  TimeSlotRecord,
} from '@/lib/repositories/availability-repository'

type TechnicianOption = {
  id: string
  name: string
  rating: number
  reviewCount: number
  specialty: string
  photoUrl?: string
  availabilityLabel?: string
}

type Props = {
  onBack: () => void
  onNext: () => void
  stepIndex: number
  totalSteps: number
}

const ANY_TECHNICIAN: TechnicianOption = {
  id: '',
  name: 'Any Available Technician',
  rating: 4.8,
  reviewCount: 0,
  specialty: 'All Services',
}

const FALLBACK_TIME_SLOTS: TimeSlotRecord[] = [
  { value: '08:00 AM - 09:00 AM', label: '8:00 AM – 9:00 AM', available: true },
  { value: '09:00 AM - 10:00 AM', label: '9:00 AM – 10:00 AM', available: true },
  { value: '10:00 AM - 11:00 AM', label: '10:00 AM – 11:00 AM', available: true },
  { value: '11:00 AM - 12:00 PM', label: '11:00 AM – 12:00 PM', available: true },
  { value: '12:00 PM - 01:00 PM', label: '12:00 PM – 1:00 PM', available: true },
  { value: '01:00 PM - 02:00 PM', label: '1:00 PM – 2:00 PM', available: true },
  { value: '02:00 PM - 03:00 PM', label: '2:00 PM – 3:00 PM', available: true },
  { value: '03:00 PM - 04:00 PM', label: '3:00 PM – 4:00 PM', available: true },
  { value: '04:00 PM - 05:00 PM', label: '4:00 PM – 5:00 PM', available: true },
  { value: '06:00 PM - 07:00 PM', label: '6:00 PM – 7:00 PM', available: true },
]

const REWARD_OPTIONS = [
  { id: 'none', label: 'Keep my points', description: 'No rewards applied', amount: 0 },
  { id: 'save-5', label: 'Use 500 pts • Save $5', description: 'Redeem 500 points for $5 off checkout', amount: 5 },
  { id: 'save-10', label: 'Use 1,000 pts • Save $10', description: 'Redeem 1,000 points for $10 off checkout', amount: 10 },
]

function formatDate(date: Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

function formatIso(date: Date) {
  return date.toISOString().split('T')[0]
}

function toLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map((part) => Number(part))
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

function formatDateInputValue(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().split('T')[0]
}

function isSunday(dateString: string) {
  return toLocalDate(dateString).getDay() === 0
}

export function SchedulingStep({ onBack, onNext, stepIndex, totalSteps }: Props) {
  const { service, location, vehicle, setSchedule } = useCarRepair()
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [selectedTechId, setSelectedTechId] = useState<string>('')
  const [selectedRewardId, setSelectedRewardId] = useState<string>('none')
  const [notes, setNotes] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateDraft, setDateDraft] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [datesError, setDatesError] = useState<string | null>(null)
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [timeSlots, setTimeSlots] = useState<TimeSlotRecord[]>(FALLBACK_TIME_SLOTS)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [technicians, setTechnicians] = useState<TechnicianOption[]>([])
  const [isLoadingTechnicians, setIsLoadingTechnicians] = useState(false)
  const [technicianError, setTechnicianError] = useState<string | null>(null)

  const availabilityRepository = useMemo(() => new AvailabilityRepository(), [])

  useEffect(() => {
    let isActive = true
    setIsLoadingDates(true)
    setDatesError(null)

    availabilityRepository
      .fetchAvailableDates()
      .then((dates) => {
        if (!isActive) return
        const filtered = dates.filter((date) => !isSunday(date))
        setAvailableDates(filtered)

        if (!filtered.length) {
          setDatesError('Service unavailable on Sundays. No alternative dates found.')
          return
        }

        if (!selectedDate || isSunday(selectedDate)) {
          setSelectedDate(filtered[0])
        }
      })
      .catch((error) => {
        console.error('Failed to fetch available dates', error)
        if (!isActive) return
        setDatesError('Unable to load availability. Showing sample schedule.')
        setAvailableDates([])
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDates(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [availabilityRepository, selectedDate])

  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots(FALLBACK_TIME_SLOTS)
      return
    }

    let isActive = true
    setIsLoadingSlots(true)

    availabilityRepository
      .fetchTimeSlots(selectedDate)
      .then((slots) => {
        if (!isActive) return
        setTimeSlots(slots.length ? slots : FALLBACK_TIME_SLOTS)
        if (slots.length) {
          const firstAvailable = slots.find((slot) => slot.available)
          if (firstAvailable) {
            setSelectedSlot(firstAvailable.value.trim())
            setSelectedTechId('')
          } else {
            setSelectedSlot('')
          }
        }
      })
      .catch((error) => {
        console.error('Failed to fetch time slots', error)
        if (!isActive) return
        setTimeSlots(FALLBACK_TIME_SLOTS)
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingSlots(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [availabilityRepository, selectedDate])

  useEffect(() => {
    if (!selectedDate || !selectedSlot) {
      setTechnicians([])
      return
    }

    let isActive = true
    setIsLoadingTechnicians(true)
    setTechnicianError(null)

    availabilityRepository
      .fetchTechnicians(selectedDate, selectedSlot)
      .then((records) => {
        if (!isActive) return
        if (records.length) {
          const options: TechnicianOption[] = records.map((record) => ({
            id: record.id,
            name: record.name,
            rating: record.rating,
            reviewCount: record.reviewCount,
            specialty: record.specialty,
            photoUrl: record.photoUrl,
            availabilityLabel: record.availabilityLabel,
          }))

          const includeAny = options.some((option) => option.id === '')
          setTechnicians(includeAny ? options : [...options, ANY_TECHNICIAN])
        } else {
          setTechnicians([])
        }
      })
      .catch((error) => {
        console.error('Failed to fetch technicians', error)
        if (!isActive) return
        setTechnicianError('Unable to load technicians. Showing sample matches.')
        setTechnicians([])
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingTechnicians(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [availabilityRepository, selectedDate, selectedSlot])

  const dateOptions = useMemo(() => {
    return availableDates.length ? availableDates : []
  }, [availableDates])

  if (!service || !location || !vehicle) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        Missing request details. Please go back and complete each step.
      </div>
    )
  }

  const formattedDateLabel = selectedDate
    ? formatDate(toLocalDate(selectedDate), { weekday: 'long', month: 'long', day: 'numeric' })
    : 'Choose a date'

  const technicianOptions = technicians
  const selectedTechnician = technicianOptions.find((tech) => tech.id === selectedTechId) ?? null
  const selectedReward = REWARD_OPTIONS.find((reward) => reward.id === selectedRewardId) ?? REWARD_OPTIONS[0]
  const estimatedPrice =
    service.totalCost ??
    service.serviceEstimate ??
    Number((service.laborCost ?? 0) + (service.partsCost ?? 0))
  const showRewards = Boolean(selectedTechnician && Number.isFinite(estimatedPrice) && (estimatedPrice ?? 0) > 0)
  const canConfirm = Boolean(selectedDate && selectedSlot && selectedTechnician)

  const handleConfirm = () => {
    if (!canConfirm) return
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      setSchedule({
        date: selectedDate,
        timeSlot: selectedSlot,
        technicianId: selectedTechnician?.id || undefined,
        technicianName: selectedTechnician?.name || 'Any Available Technician',
        technicianRating: selectedTechnician?.rating,
        technicianSpecialty: selectedTechnician?.specialty,
        technicianPhotoUrl: selectedTechnician?.photoUrl,
        notes: notes.trim() || undefined,
        rewardId: selectedReward.amount > 0 ? selectedReward.id : undefined,
        rewardDiscount: selectedReward.amount,
      })
      onNext()
    } catch (error) {
      console.error('Failed to set schedule details', error)
      setSubmitError('Failed to prepare appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDatePicker = () => {
    const fallback = dateOptions[0]
    const defaultValue = selectedDate || (fallback ? fallback : formatDateInputValue(new Date()))
    setDateDraft(defaultValue)
    setShowDatePicker(true)
  }

  const handleDateConfirm = () => {
    if (!dateDraft) {
      setShowDatePicker(false)
      return
    }
    if (isSunday(dateDraft)) {
      setDatesError('Service unavailable on Sundays. Please choose another date.')
      return
    }
    setDatesError(null)
    setSelectedDate(dateDraft)
    setSelectedSlot('')
    setSelectedTechId('')
    setShowDatePicker(false)
  }

  const slotRows = useMemo(() => {
    const rows: TimeSlotRecord[][] = []
    for (let index = 0; index < timeSlots.length; index += 2) {
      rows.push(timeSlots.slice(index, index + 2))
    }
    return rows
  }, [timeSlots])

  return (
    <Fragment>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-[#0D1B2A] px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
            >
              Back
            </button>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#0D1B2A]">Schedule Service</p>
              <p className="text-xs text-gray-500">{service.title}</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D1B2A]/5 text-2xl" aria-hidden>
              🚗
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-[#0D1B2A]">{vehicle.year} {vehicle.make} {vehicle.model}</p>
              <p>{vehicle.engineSize}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <header className="flex items-center gap-3">
            <span aria-hidden className="text-xl">📅</span>
            <div>
              <h2 className="text-lg font-semibold text-[#0D1B2A]">Select Date</h2>
              <p className="text-xs text-gray-500">Service available Monday – Saturday</p>
            </div>
          </header>
          <button
            type="button"
            onClick={openDatePicker}
            disabled={isLoadingDates}
            className={`mt-4 flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
              selectedDate
                ? 'border-[#0D1B2A] bg-[#0D1B2A]/10 text-[#0D1B2A]'
                : 'border-gray-300 text-gray-500 hover:border-[#0D1B2A]/40'
            } ${isLoadingDates ? 'cursor-wait opacity-70' : ''}`}
          >
            <span>{formattedDateLabel}</span>
            <span aria-hidden>📆</span>
          </button>
          {datesError ? <p className="mt-2 text-xs text-amber-600">{datesError}</p> : null}
        </section>

        {selectedDate ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="flex items-center gap-3">
              <span aria-hidden className="text-xl">⏰</span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Select Time</h2>
                <p className="text-xs text-gray-500">Choose the arrival window that works best</p>
              </div>
            </header>
            <div className="mt-4 space-y-3">
              {slotRows.map((row, rowIndex) => (
                <div key={`slot-row-${rowIndex}`} className="flex w-full gap-3">
                  {row.map((slot) => {
                    const isSelected = selectedSlot === slot.value
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => {
                          if (!slot.available || isLoadingSlots) return
                          setSelectedSlot(slot.value.trim())
                          setSelectedTechId('')
                        }}
                        className={`flex-1 rounded-lg border px-0 py-0 transition ${
                          isSelected
                            ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white shadow'
                            : slot.available
                              ? 'border-gray-300 bg-white text-[#0D1B2A] hover:border-[#0D1B2A]/50'
                              : 'border-gray-200 bg-gray-100 text-gray-400'
                        } ${slot.available ? '' : 'cursor-not-allowed'}`}
                        disabled={!slot.available || isLoadingSlots}
                      >
                        <span
                          className={`flex h-14 items-center justify-center text-sm ${
                            isSelected
                              ? 'font-semibold text-white'
                              : slot.available
                                ? 'font-medium text-[#0D1B2A]'
                                : 'font-medium text-gray-400'
                          }`}
                        >
                          {slot.label}
                        </span>
                      </button>
                    )
                  })}
                  {row.length === 1 ? <div className="flex-1" aria-hidden /> : null}
                </div>
              ))}
              {isLoadingSlots ? (
                <p className="text-xs text-gray-500">Loading available times…</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {selectedSlot ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="flex items-center gap-3">
              <span aria-hidden className="text-xl">👩‍🔧</span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Select Technician</h2>
                <p className="text-xs text-gray-500">Top options recommended based on this service</p>
              </div>
            </header>

            <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1">
              {technicianOptions.length ? (
                technicianOptions.map((tech, index) => {
                  const isSelected = selectedTechId === tech.id
                  return (
                    <button
                      key={tech.id || `tech-${index}`}
                      type="button"
                      onClick={() => setSelectedTechId(tech.id)}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? 'border-[#0D1B2A] bg-[#0D1B2A]/10 text-[#0D1B2A] shadow'
                          : 'border-gray-200 text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-lg" aria-hidden>
                          {tech.photoUrl ? <img src={tech.photoUrl} alt={tech.name} className="h-12 w-12 object-cover" /> : '👤'}
                        </div>
                        <div className="flex-1 space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{tech.name}</p>
                            {index < 3 && tech.id ? (
                              <span className="rounded-full bg-[#0D1B2A]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0D1B2A]">
                                {index === 0 ? 'Top pick' : 'Recommended'}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-gray-500">{tech.specialty}</p>
                          <p className="text-xs text-gray-500">
                            ⭐ {tech.rating.toFixed(1)} ({tech.reviewCount || 'New'} reviews)
                          </p>
                          {tech.availabilityLabel ? (
                            <p className="text-xs text-[#0D1B2A]/70">{tech.availabilityLabel}</p>
                          ) : null}
                        </div>
                      </div>
                      {isSelected ? (
                        <p className="mt-2 text-xs font-semibold text-[#0D1B2A]">Selected for your appointment</p>
                      ) : null}
                    </button>
                  )
                })
              ) : (
                <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-xs text-gray-500">
                  No technicians are available for this time window. Please select a different time or date.
                </p>
              )}
            </div>
          </section>
        ) : null}

        {showRewards ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="flex items-center gap-3">
              <span aria-hidden className="text-xl">🎁</span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Use Hereta Rewards</h2>
                <p className="text-xs text-gray-500">Apply savings instantly before checkout</p>
              </div>
            </header>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {REWARD_OPTIONS.map((reward) => {
                const isSelected = selectedRewardId === reward.id
                return (
                  <button
                    key={reward.id}
                    type="button"
                    onClick={() => setSelectedRewardId(reward.id)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      isSelected
                        ? 'border-[#0D1B2A] bg-[#0D1B2A]/10 text-[#0D1B2A] shadow'
                        : 'border-gray-200 text-[#0D1B2A] hover:border-[#0D1B2A]/60'
                    }`}
                  >
                    <p className="font-semibold">{reward.label}</p>
                    <p className="text-xs text-gray-500">{reward.description}</p>
                  </button>
                )
              })}
            </div>
          </section>
        ) : null}

        {selectedTechnician ? (
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="flex items-center gap-3">
              <span aria-hidden className="text-xl">📝</span>
              <div>
                <h2 className="text-lg font-semibold text-[#0D1B2A]">Additional Notes (Optional)</h2>
                <p className="text-xs text-gray-500">Any requests or concerns for your technician</p>
              </div>
            </header>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="mt-4 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-700 shadow-sm focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/10"
              placeholder="Any specific requests or concerns?"
            />
          </section>
        ) : null}

        {canConfirm ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:bg-[#0D1B2A]/60"
            >
              {isSubmitting ? 'Preparing…' : 'Confirm appointment'}
            </button>
            {submitError ? (
              <p className="text-xs text-red-600">❌ {submitError}</p>
            ) : (
              <p className="text-xs text-gray-500">✅ You’ll receive a confirmation email and SMS.</p>
            )}
          </div>
        ) : null}
      </div>

      {showDatePicker ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#0D1B2A]">Choose a date</h3>
            <p className="mt-1 text-sm text-gray-600">Pick a day when you’re available. Times adjust based on your selection.</p>
            <input
              type="date"
              value={dateDraft}
              min={formatIso(new Date())}
              onChange={(event) => setDateDraft(event.target.value)}
              className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-[#0D1B2A] focus:outline-none"
            />
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDateConfirm}
                className="rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
              >
                Apply date
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  )
}

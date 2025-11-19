"use client"

import { useEffect, useMemo, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase"
import { TowingBoardRepository } from "@/lib/repositories/towing-board-repository"
import type { TowingBoardPostDto } from "@/types"
import { useRouter } from "next/navigation"

const NAVY = "#0D1B2A"

const SERVICE_TYPES = [
  { id: "FLATBED", title: "Flatbed Tow", description: "4-wheel off-ground transport", icon: "🚚" },
  { id: "WHEEL_LIFT", title: "Wheel Lift Tow", description: "Short-distance transport", icon: "🛞" },
  { id: "MOTORCYCLE", title: "Motorcycle Tow", description: "Secure cradle transport", icon: "🏍️" },
  { id: "HEAVY_DUTY", title: "Heavy-Duty Tow", description: "Box trucks & RVs", icon: "🚛" },
]

const TOWING_METHODS = [
  { id: "FLATBED", label: "Flatbed", description: "Best for AWD, low clearance, luxury vehicles" },
  { id: "WHEEL_LIFT", label: "Wheel-lift", description: "Quick hookup for short-distance jobs" },
  { id: "DOLLY", label: "Dolly", description: "Keeps non-drive wheels off the ground" },
]

const URGENCY_LEVELS = [
  { id: "EMERGENCY", label: "Emergency (ASAP)", icon: "⚠️" },
  { id: "SAME_DAY", label: "Same-day", icon: "⏱️" },
  { id: "SCHEDULED", label: "Scheduled", icon: "📅" },
]

const TOWING_REASONS = [
  { id: "BREAKDOWN", label: "Broke down / won’t start" },
  { id: "ACCIDENT", label: "Accident or collision" },
  { id: "STUCK", label: "Stuck / off-road recovery" },
  { id: "TRANSPORT", label: "Scheduled transport" },
]

const VEHICLE_STATES = [
  { id: "DRIVABLE", label: "Drivable", icon: "✅" },
  { id: "ROLLABLE", label: "Rollable but not drivable", icon: "🛞" },
  { id: "STUCK", label: "Stuck or immobile", icon: "⛔" },
]

const DAMAGE_LEVELS = [
  { id: "NONE", label: "No visible damage" },
  { id: "MODERATE", label: "Minor damage" },
  { id: "HEAVY", label: "Heavy damage" },
]

const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Electric", "Other"]
const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Dual-clutch"]
const DRIVE_TYPES = ["FWD", "RWD", "AWD", "4WD"]
const BODY_STYLES = ["Sedan", "SUV", "Truck", "Coupe", "Van", "Wagon"]
const DOOR_OPTIONS = ["2-door", "3-door", "4-door", "5-door"]

const EQUIPMENT_OPTIONS = [
  "Wheel dollies",
  "Skates",
  "Go-jacks",
  "Winch out",
  "Low-profile bed",
  "Extra chains/straps",
]

const INITIAL_FORM = {
  serviceType: SERVICE_TYPES[0].id,
  towingMethod: "FLATBED",
  capturePhotos: true,
  urgency: URGENCY_LEVELS[1].id,
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleTrim: "",
  vehicleEngine: "",
  vehicleColor: "",
  vehicleVin: "",
  vehicleMileage: "",
  vehicleFuelType: "",
  vehicleTransmission: "",
  vehicleDriveType: "",
  vehicleBodyStyle: "",
  vehicleDoors: "",
  vehicleState: VEHICLE_STATES[0].id,
  damageLevel: DAMAGE_LEVELS[0].id,
  towingReason: TOWING_REASONS[0].id,
  problemDescription: "",
  keysAvailable: true,
  doorsUnlocked: true,
  parkingBrake: false,
  inPark: true,
  specialEquipment: [] as string[],
  pickupAddress: "",
  pickupCity: "",
  pickupState: "",
  pickupZip: "",
  pickupCrossStreet: "",
  dropoffAddress: "",
  dropoffCity: "",
  dropoffState: "",
  dropoffZip: "",
  dropoffCrossStreet: "",
  distanceMiles: 0,
  preferredDate: "",
  preferredTime: "",
  photoFiles: [] as string[],
}

export default function TowingPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!form.capturePhotos && step === 5) {
      setStep(6)
    }
  }, [form.capturePhotos, step])

  const updateForm = (partial: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...partial }))

  const estimatedCost = computeCostBreakdown(form.distanceMiles, form.urgency, form.specialEquipment.length)

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(null)

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error
      if (!user) {
        router.push("/auth/sign-in")
        return
      }

      const repository = new TowingBoardRepository()
      const dto: Omit<TowingBoardPostDto, "id" | "created_at" | "updated_at"> = {
        user_id: user.id,
        user_name: user.email ?? "Customer",
        vehicle_year: form.vehicleYear,
        vehicle_make: form.vehicleMake,
        vehicle_model: form.vehicleModel,
        vehicle_engine: form.vehicleEngine || form.vehicleTrim || "N/A",
        vehicle_trim: form.vehicleTrim || undefined,
        vehicle_type: deriveVehicleType(form.vehicleMake),
        pickup_address: form.pickupAddress,
        pickup_city: form.pickupCity,
        pickup_state: form.pickupState,
        pickup_zip_code: form.pickupZip,
        pickup_cross_street: form.pickupCrossStreet || undefined,
        dropoff_address: form.dropoffAddress,
        dropoff_city: form.dropoffCity,
        dropoff_state: form.dropoffState,
        dropoff_zip_code: form.dropoffZip,
        dropoff_cross_street: form.dropoffCrossStreet || undefined,
        towing_service_type: form.serviceType,
        towing_method: form.towingMethod,
        towing_reason: form.towingReason,
        urgency_level: form.urgency,
        reason_category: undefined,
        vehicle_drivability: form.vehicleState,
        vehicle_damage_level: form.damageLevel,
        keys_available: form.keysAvailable,
        doors_unlocked: form.doorsUnlocked,
        parking_brake_engaged: form.parkingBrake,
        in_gear_or_park: form.inPark,
        special_equipment_needed: form.specialEquipment,
        distance: form.distanceMiles,
        base_fee: estimatedCost.baseFee,
        per_mile_rate: estimatedCost.perMileRate,
        distance_fee: estimatedCost.distanceFee,
        urgency_surcharge: estimatedCost.urgencyFee,
        equipment_fee: estimatedCost.equipmentFee,
        subtotal: estimatedCost.subtotal,
        tax_amount: estimatedCost.tax,
        posting_fee: estimatedCost.postingFee,
        total_cost: estimatedCost.total,
        pricing_type: "FIXED_PRICE",
        minimum_bid: undefined,
        maximum_bid: undefined,
        date_time_preference: form.preferredDate
          ? `${form.preferredDate} ${form.preferredTime || ""}`.trim()
          : "ASAP",
        preferred_date_time: form.preferredDate ? `${form.preferredDate} ${form.preferredTime}`.trim() : undefined,
        estimated_response_time: form.urgency === "EMERGENCY" ? "Under 45 minutes" : "Within 2 hours",
        photo_urls: form.photoFiles ?? [],
        problem_description: form.problemDescription || "N/A",
        status: "ACTIVE",
        is_public: true,
      }

      await repository.createPost(dto)
      setSubmitSuccess("Your towing request has been posted. We’ll notify you as soon as drivers respond.")
      setForm(INITIAL_FORM)
      setStep(0)
    } catch (err: any) {
      console.error("Failed to create towing request:", err)
      setSubmitError(err?.message ?? "Unable to submit request right now.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
        {submitSuccess && (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
            {submitSuccess}
          </div>
        )}
        {submitError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">{submitError}</div>
        )}

        {step === 0 && (
          <PickupStep
            value={form}
            onChange={updateForm}
            onBack={() => router.push("/towing/onboarding")}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <DropoffStep value={form} onChange={updateForm} onBack={() => setStep(0)} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <VehicleStep value={form} onChange={updateForm} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <ServiceTypeStep
            value={form}
            onChange={updateForm}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <ConditionStep
            value={form}
            onChange={updateForm}
            onBack={() => setStep(3)}
            onNext={() => setStep(form.capturePhotos ? 5 : 6)}
          />
        )}
        {step === 5 && form.capturePhotos && (
          <PhotoStep value={form} onChange={updateForm} onBack={() => setStep(4)} onNext={() => setStep(6)} />
        )}
        {step === 6 && (
          <UrgencyStep
            value={form}
            onChange={updateForm}
            onBack={() => setStep(form.capturePhotos ? 5 : 4)}
            onNext={() => setStep(7)}
          />
        )}
        {step === 7 && (
          <ReviewStep
            value={form}
            cost={estimatedCost}
            onEdit={(targetStep) => setStep(targetStep)}
            onBack={() => setStep(6)}
            onNext={() => setStep(8)}
          />
        )}
        {step === 8 && (
          <PaymentStep
            cost={estimatedCost}
            submitting={submitting}
            onBack={() => setStep(7)}
            onSubmit={handleSubmit}
            submitError={submitError}
          />
        )}
      </main>
    </div>
  )
}

function CardSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <header className="mb-4 space-y-1">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </header>
      {children}
    </section>
  )
}

function PickupStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  const canContinue =
    value.pickupAddress.trim() &&
    value.pickupCity.trim() &&
    value.pickupState.trim() &&
    value.pickupZip.trim()
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.")
      return
    }
    setIsLoadingLocation(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await reverseGeocode(position.coords.latitude, position.coords.longitude)
          if (result.street) onChange({ pickupAddress: result.street })
          if (result.city) onChange({ pickupCity: result.city })
          if (result.state) onChange({ pickupState: result.state })
          if (result.zip) onChange({ pickupZip: result.zip })
        } catch (error: any) {
          setLocationError(error?.message ?? "Unable to determine address from your location.")
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (geoError) => {
        setLocationError(geoError.message || "Unable to access your location.")
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-2 text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-[#0D1B2A]">🚚 Towing Service</div>
          <span className="w-8" />
        </div>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center text-[#0D1B2A]">
          <div className="text-6xl" aria-hidden>
            🚚
          </div>
          <p className="mt-3 text-2xl font-semibold">Towing Service</p>
          <p className="text-sm text-gray-600">Pickup Location</p>
        </div>

        <div className="mt-6 space-y-4">
          <LabeledInput
            label="Street Address"
            value={value.pickupAddress}
            onChange={(pickupAddress) => onChange({ pickupAddress })}
            placeholder="123 Main Street"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <LabeledInput
              label="City"
              value={value.pickupCity}
              onChange={(pickupCity) => onChange({ pickupCity })}
              placeholder="New York"
            />
            <LabeledInput
              label="State"
              value={value.pickupState}
              onChange={(pickupState) => onChange({ pickupState })}
              placeholder="NY"
            />
          </div>
          <LabeledInput
            label="Zip Code"
            value={value.pickupZip}
            onChange={(pickupZip) => onChange({ pickupZip })}
            placeholder="12345"
          />
          <LabeledInput
            label="Nearest Cross Street (optional)"
            value={value.pickupCrossStreet}
            onChange={(pickupCrossStreet) => onChange({ pickupCrossStreet })}
            placeholder="Near Oak Avenue"
          />
        </div>

        {locationError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{locationError}</div>
        )}

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className="mt-4 flex w-full items-center justify-center rounded-2xl border border-[#0D1B2A] px-4 py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoadingLocation ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#0D1B2A]/40 border-t-[#0D1B2A]" />
              Getting Location…
            </>
          ) : (
            <>
              <span className="mr-2" aria-hidden>
                📱
              </span>
              Use Current Location
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canContinue}
        className="ml-auto rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next: Drop-off Location
      </button>
    </div>
  )
}

function DropoffStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  const canContinue =
    value.dropoffAddress.trim() &&
    value.dropoffCity.trim() &&
    value.dropoffState.trim() &&
    value.dropoffZip.trim()

  const quickCards = [
    { emoji: "🏠", title: "Home", subtitle: "Use pickup address", action: () => onChange({
      dropoffAddress: value.pickupAddress,
      dropoffCity: value.pickupCity,
      dropoffState: value.pickupState,
      dropoffZip: value.pickupZip,
      dropoffCrossStreet: value.pickupCrossStreet,
    }) },
    { emoji: "🔧", title: "Preferred Shop", subtitle: "Saved destination", action: () =>
      onChange({
        dropoffAddress: "",
        dropoffCity: "",
        dropoffState: "",
        dropoffZip: "",
        dropoffCrossStreet: "Preferred shop",
      })
    },
    { emoji: "✍️", title: "Custom", subtitle: "Enter different address", action: () =>
      onChange({
        dropoffAddress: "",
        dropoffCity: "",
        dropoffState: "",
        dropoffZip: "",
        dropoffCrossStreet: "",
      })
    },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-2 text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-[#0D1B2A]">🚚 Towing Service</div>
          <span className="w-8" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center text-[#0D1B2A]">
          <div className="text-6xl" aria-hidden>
            🏁
          </div>
          <p className="mt-3 text-2xl font-semibold">Drop-off Location</p>
          <p className="text-sm text-gray-600">Where should we take your vehicle?</p>
        </div>

        <div className="mt-6 space-y-4">
          <LabeledInput
            label="Street Address"
            value={value.dropoffAddress}
            onChange={(dropoffAddress) => onChange({ dropoffAddress })}
            placeholder="Shop or destination address"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <LabeledInput
              label="City"
              value={value.dropoffCity}
              onChange={(dropoffCity) => onChange({ dropoffCity })}
              placeholder="Raleigh"
            />
            <LabeledInput
              label="State"
              value={value.dropoffState}
              onChange={(dropoffState) => onChange({ dropoffState })}
              placeholder="NC"
            />
          </div>
          <LabeledInput
            label="Zip Code"
            value={value.dropoffZip}
            onChange={(dropoffZip) => onChange({ dropoffZip })}
            placeholder="12345"
          />
          <LabeledInput
            label="Cross street / lot info (optional)"
            value={value.dropoffCrossStreet}
            onChange={(dropoffCrossStreet) => onChange({ dropoffCrossStreet })}
            placeholder="Behind Building A, space 15"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-[#0D1B2A]">Quick select</p>
        <p className="text-xs text-gray-500">Choose a saved destination or enter a new one</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {quickCards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={card.action}
              className="rounded-2xl border border-gray-200 px-4 py-3 text-left transition hover:border-[#0D1B2A]"
            >
              <p className="text-2xl" aria-hidden>
                {card.emoji}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#0D1B2A]">{card.title}</p>
              <p className="text-xs text-gray-500">{card.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Next: Vehicle
        </button>
      </div>
    </div>
  )
}

function ServiceTypeStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  const vehicleSummary = [value.vehicleYear, value.vehicleMake, value.vehicleModel].filter(Boolean).join(" ")

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-2 text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-[#0D1B2A]">🚚 Towing Service</div>
          <span className="w-8" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-center text-sm font-semibold text-[#0D1B2A]">Step 4 of 9</p>
        <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Your vehicle</p>
          <p className="text-base font-semibold text-[#0D1B2A]">
            {vehicleSummary || "Vehicle details pending"}
          </p>
          {value.vehicleTrim && (
            <p className="text-xs text-gray-500">Engine / trim: {value.vehicleTrim}</p>
          )}
        </div>

        <h3 className="mt-6 text-lg font-semibold text-[#0D1B2A]">Select towing service type</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {SERVICE_TYPES.map((service) => {
            const selected = value.serviceType === service.id
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => onChange({ serviceType: service.id })}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  selected ? "border-[#0D1B2A] bg-[#0D1B2A]/5 shadow" : "border-gray-200"
                }`}
              >
                <p className="text-2xl" aria-hidden>
                  {service.icon}
                </p>
                <p className="mt-2 text-base font-semibold text-[#0D1B2A]">{service.title}</p>
                <p className="text-xs text-gray-500">{service.description}</p>
              </button>
            )
          })}
        </div>

        <h3 className="mt-6 text-lg font-semibold text-[#0D1B2A]">Preferred towing method</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {TOWING_METHODS.map((method) => {
            const selected = value.towingMethod === method.id
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange({ towingMethod: method.id })}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selected ? "border-[#0D1B2A] bg-[#0D1B2A]/5 text-[#0D1B2A]" : "border-gray-200 text-gray-600"
                }`}
              >
                <p className="font-semibold">{method.label}</p>
                <p className="text-xs text-gray-500">{method.description}</p>
              </button>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 p-4">
          <label className="flex items-center justify-between text-sm text-[#0D1B2A]">
            <div>
              <p className="font-semibold">Take photos during intake</p>
              <p className="text-xs text-gray-500">Recommended for damage documentation</p>
            </div>
            <input
              type="checkbox"
              checked={value.capturePhotos}
              onChange={(event) => onChange({ capturePhotos: event.target.checked })}
              className="h-5 w-5 rounded border-gray-300 text-[#0D1B2A] focus:ring-[#0D1B2A]"
            />
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-gray-600">
      <span>{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#15b78f] focus:outline-none focus:ring-2 focus:ring-[#15b78f]/20"
      />
    </label>
  )
}

function LabeledDropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-gray-600">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 disabled:bg-gray-100 disabled:text-gray-400 focus:border-[#15b78f] focus:outline-none focus:ring-2 focus:ring-[#15b78f]/20"
      >
        <option value="">{placeholder ?? "Select"}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function LabeledSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-gray-600">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#15b78f] focus:outline-none focus:ring-2 focus:ring-[#15b78f]/20"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function VehicleStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-2 text-[#0D1B2A] hover:bg-[#0D1B2A]/5"
            aria-label="Back"
          >
            ←
          </button>
          <div className="flex-1 text-center text-sm font-semibold text-[#0D1B2A]">🚚 Towing Service</div>
          <span className="w-8" />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center text-[#0D1B2A]">
          <div className="text-6l" aria-hidden>
            🚗
          </div>
          <p className="mt-3 text-2xl font-semibold">Vehicle Information</p>
          <p className="text-sm text-gray-600">Tell us about the vehicle that needs towing</p>
        </div>

        <div className="mt-6 space-y-4">
          <LabeledDropdown
            label="Year"
            value={value.vehicleYear}
            onChange={(vehicleYear) => onChange({ vehicleYear })}
            options={Array.from({ length: 35 }, (_, index) => `${2024 - index}`)}
            placeholder="Select year"
          />
          <LabeledDropdown
            label="Make"
            value={value.vehicleMake}
            onChange={(vehicleMake) => onChange({ vehicleMake })}
            options={[
              "Acura",
              "Audi",
              "BMW",
              "Buick",
              "Cadillac",
              "Chevrolet",
              "Chrysler",
              "Dodge",
              "Ford",
              "GMC",
              "Honda",
              "Hyundai",
              "Infiniti",
              "Jeep",
              "Kia",
              "Lexus",
              "Lincoln",
              "Mazda",
              "Mercedes-Benz",
              "Mitsubishi",
              "Nissan",
              "Subaru",
              "Tesla",
              "Toyota",
              "Volkswagen",
              "Volvo",
            ]}
            placeholder="Select make"
          />
          <LabeledDropdown
            label="Model"
            value={value.vehicleModel}
            onChange={(vehicleModel) => onChange({ vehicleModel })}
            options={
              value.vehicleMake === "Ford"
                ? ["F-150", "F-250", "F-350", "Explorer", "Expedition", "Escape", "Bronco", "Mustang"]
                : value.vehicleMake === "Toyota"
                ? ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "4Runner"]
                : value.vehicleMake === "Chevrolet"
                ? ["Silverado 1500", "Tahoe", "Suburban", "Equinox"]
                : value.vehicleMake === "Honda"
                ? ["Accord", "Civic", "CR-V", "Pilot", "Ridgeline"]
                : value.vehicleMake === "Jeep"
                ? ["Wrangler", "Grand Cherokee", "Cherokee", "Gladiator"]
                : value.vehicleMake === "Tesla"
                ? ["Model S", "Model 3", "Model X", "Model Y"]
                : []
            }
            placeholder={value.vehicleMake ? "Select model" : "Select make first"}
            disabled={!value.vehicleMake}
          />
          <LabeledInput
            label="Trim / Engine"
            value={value.vehicleTrim}
            onChange={(vehicleTrim) => onChange({ vehicleTrim })}
            placeholder="3.5L V6"
          />
          <LabeledInput
            label="Engine Details"
            value={value.vehicleEngine}
            onChange={(vehicleEngine) => onChange({ vehicleEngine })}
            placeholder="EcoBoost V6"
          />
          <LabeledInput
            label="Color"
            value={value.vehicleColor}
            onChange={(vehicleColor) => onChange({ vehicleColor })}
            placeholder="Blue"
          />
          <LabeledInput
            label="VIN (optional)"
            value={value.vehicleVin}
            onChange={(vehicleVin) => onChange({ vehicleVin })}
            placeholder="17-character VIN"
          />
          <LabeledInput
            label="Mileage (optional)"
            value={value.vehicleMileage}
            onChange={(vehicleMileage) => onChange({ vehicleMileage })}
            placeholder="e.g., 82,500"
          />
          <LabeledSelect
            label="Fuel Type"
            value={value.vehicleFuelType}
            onChange={(vehicleFuelType) => onChange({ vehicleFuelType })}
            options={FUEL_TYPES}
          />
          <LabeledSelect
            label="Transmission"
            value={value.vehicleTransmission}
            onChange={(vehicleTransmission) => onChange({ vehicleTransmission })}
            options={TRANSMISSIONS}
          />
          <LabeledSelect
            label="Drive Type"
            value={value.vehicleDriveType}
            onChange={(vehicleDriveType) => onChange({ vehicleDriveType })}
            options={DRIVE_TYPES}
          />
          <LabeledSelect
            label="Body Style"
            value={value.vehicleBodyStyle}
            onChange={(vehicleBodyStyle) => onChange({ vehicleBodyStyle })}
            options={BODY_STYLES}
          />
          <LabeledSelect
            label="Doors"
            value={value.vehicleDoors}
            onChange={(vehicleDoors) => onChange({ vehicleDoors })}
            options={DOOR_OPTIONS}
          />
        </div>

        <p className="mt-4 text-xs text-gray-500">
          VIN and mileage help technicians prep. Fuel type, transmission, and drive type ensure the right equipment.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!value.vehicleYear || !value.vehicleMake || !value.vehicleModel}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </div>
  )
}


function ConditionStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  const toggleEquipment = (item: string) => {
    const exists = value.specialEquipment.includes(item)
    onChange({
      specialEquipment: exists
        ? value.specialEquipment.filter((equipment) => equipment !== item)
        : [...value.specialEquipment, item],
    })
  }

  return (
    <div className="space-y-6">
      <CardSection title="Step 5 of 9 • Condition" description="Tell us what happened">
        <div className="grid gap-3 md:grid-cols-2">
          {TOWING_REASONS.map((reason) => (
            <button
              key={reason.id}
              type="button"
              onClick={() => onChange({ towingReason: reason.id })}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                value.towingReason === reason.id
                  ? "border-[#15b78f] bg-[#15b78f]/5 text-[#0D1B2A]"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {reason.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {VEHICLE_STATES.map((state) => (
            <button
              key={state.id}
              type="button"
              onClick={() => onChange({ vehicleState: state.id })}
              className={`rounded-2xl border px-3 py-2 text-sm transition ${
                value.vehicleState === state.id ? "border-[#15b78f] bg-[#15b78f]/5 text-[#0D1B2A]" : "border-gray-200 text-gray-600"
              }`}
            >
              {state.icon} {state.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-500">Damage</label>
          <select
            value={value.damageLevel}
            onChange={(event) => onChange({ damageLevel: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#15b78f] focus:outline-none focus:ring-2 focus:ring-[#15b78f]/20"
          >
            {DAMAGE_LEVELS.map((damage) => (
              <option key={damage.id} value={damage.id}>
                {damage.label}
              </option>
            ))}
          </select>
        </div>
      </CardSection>

      <CardSection title="Access" description="Help the operator know what to expect">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={value.keysAvailable}
              onChange={(event) => onChange({ keysAvailable: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#15b78f] focus:ring-[#15b78f]"
            />
            Keys available
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={value.doorsUnlocked}
              onChange={(event) => onChange({ doorsUnlocked: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#15b78f] focus:ring-[#15b78f]"
            />
            Doors unlocked
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={value.parkingBrake}
              onChange={(event) => onChange({ parkingBrake: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#15b78f] focus:ring-[#15b78f]"
            />
            Parking brake engaged
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={value.inPark}
              onChange={(event) => onChange({ inPark: event.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#15b78f] focus:ring-[#15b78f]"
            />
            Transmission in park / neutral
          </label>
        </div>
      </CardSection>

      <CardSection title="Special equipment" description="Select anything your operator should bring">
        <div className="grid gap-3 md:grid-cols-2">
          {EQUIPMENT_OPTIONS.map((item) => {
            const selected = value.specialEquipment.includes(item)
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleEquipment(item)}
                className={`rounded-2xl border px-3 py-2 text-left text-sm transition ${
                  selected ? "border-[#15b78f] bg-[#15b78f]/5 text-[#0D1B2A]" : "border-gray-200 text-gray-600"
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </CardSection>

      <CardSection title="Notes" description="Add anything else we should know ahead of time">
        <textarea
          value={value.problemDescription}
          onChange={(event) => onChange({ problemDescription: event.target.value })}
          rows={5}
          placeholder="Example: Vehicle died on I-40 shoulder near exit 297. Rear wheels locked, front wheels free."
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-[#15b78f] focus:outline-none focus:ring-2 focus:ring-[#15b78f]/20"
        />
      </CardSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function PhotoStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const names = Array.from(files).map((file) => file.name)
    onChange({ photoFiles: names })
  }

  return (
    <div className="space-y-6">
      <CardSection title="Step 6 of 9 • Photos" description="Upload helpful reference photos">
        <label className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
          <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleFiles(event.target.files)} />
          <span className="text-4xl" aria-hidden>
            📸
          </span>
          <p className="mt-3 font-semibold text-[#0D1B2A]">Add photos</p>
          <p className="text-xs text-gray-500">Vehicle, damage, parking situation, or anything else helpful</p>
          <span className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0D1B2A] shadow">
            Browse files
          </span>
        </label>

        {value.photoFiles.length > 0 && (
          <ul className="mt-4 space-y-2 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
            {value.photoFiles.map((name) => (
              <li key={name} className="flex items-center justify-between">
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ photoFiles: value.photoFiles.filter((fileName) => fileName !== name) })
                  }
                  className="text-xs font-semibold text-rose-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function UrgencyStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  onChange: (partial: Partial<typeof INITIAL_FORM>) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6">
      <CardSection title="Step 7 of 9 • Urgency" description="How quickly do you need service?">
        <div className="grid gap-3 sm:grid-cols-3">
          {URGENCY_LEVELS.map((item) => {
            const selected = value.urgency === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ urgency: item.id })}
                className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                  selected ? "border-[#15b78f] bg-[#15b78f]/5 text-[#0D1B2A]" : "border-gray-200 text-gray-600"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>
      </CardSection>

      <CardSection title="Distance & scheduling" description="Give us an idea of the trip and timing">
        <div className="grid gap-4 md:grid-cols-2">
          <LabeledInput
            label="Distance (miles)"
            value={value.distanceMiles}
            onChange={(distanceMiles) => onChange({ distanceMiles: Number(distanceMiles) || 0 })}
            type="number"
            placeholder="Enter approximate miles"
          />
          <LabeledInput
            label="Preferred date"
            value={value.preferredDate}
            onChange={(preferredDate) => onChange({ preferredDate })}
            type="date"
          />
          <LabeledInput
            label="Preferred time"
            value={value.preferredTime}
            onChange={(preferredTime) => onChange({ preferredTime })}
            type="time"
          />
        </div>
      </CardSection>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-[#0D1B2A]">{value}</span>
    </div>
  )
}

function ReviewStep({
  value,
  cost,
  onEdit,
  onBack,
  onNext,
}: {
  value: typeof INITIAL_FORM
  cost: ReturnType<typeof computeCostBreakdown>
  onEdit: (step: number) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <CardSection title="Step 8 of 9 • Review" description="Make sure everything looks correct before posting">
        <div className="grid gap-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0D1B2A]">Service</h3>
              <button type="button" onClick={() => onEdit(3)} className="text-xs font-semibold text-[#15b78f]">
                Edit
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-gray-600">
              <ReviewRow label="Type" value={value.serviceType} />
              <ReviewRow label="Urgency" value={value.urgency} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0D1B2A]">Vehicle</h3>
              <button type="button" onClick={() => onEdit(2)} className="text-xs font-semibold text-[#15b78f]">
                Edit
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-gray-600">
              <ReviewRow label="Year" value={value.vehicleYear || "—"} />
              <ReviewRow label="Make" value={value.vehicleMake || "—"} />
              <ReviewRow label="Model" value={value.vehicleModel || "—"} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#0D1B2A]">Locations</h3>
              <button type="button" onClick={() => onEdit(0)} className="text-xs font-semibold text-[#15b78f]">
                Edit
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-gray-600">
              <ReviewRow label="Pickup" value={`${value.pickupCity || ""} ${value.pickupState || ""}`} />
              <ReviewRow label="Drop-off" value={`${value.dropoffCity || ""} ${value.dropoffState || ""}`} />
              <ReviewRow label="Distance" value={`${value.distanceMiles || 0} miles`} />
            </div>
          </div>
        </div>
      </CardSection>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-[#0D1B2A]">Cost breakdown</p>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <ReviewRow label="Base fee" value={`$${cost.baseFee.toFixed(2)}`} />
            <ReviewRow label="Distance" value={`$${cost.distanceFee.toFixed(2)}`} />
            <ReviewRow label="Urgency" value={`$${cost.urgencyFee.toFixed(2)}`} />
            <ReviewRow label="Equipment" value={`$${cost.equipmentFee.toFixed(2)}`} />
            <ReviewRow label="Tax" value={`$${cost.tax.toFixed(2)}`} />
            <ReviewRow label="Platform fee" value={`$${cost.postingFee.toFixed(2)}`} />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-[#0D1B2A]">
            <span>Total</span>
            <span>${cost.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
          <p className="font-semibold">Next steps</p>
          <p className="mt-2">
            We’ll notify nearby operators. You can track bids, chat with drivers, and manage your job inside the
            dashboard.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-2xl bg-[#15b78f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#119671]"
          >
            Continue to payment
          </button>
        </div>
      </aside>
    </div>
  )
}

function PaymentStep({
  cost,
  submitting,
  submitError,
  onBack,
  onSubmit,
}: {
  cost: ReturnType<typeof computeCostBreakdown>
  submitting: boolean
  submitError: string | null
  onBack: () => void
  onSubmit: () => void
}) {
  return (
    <div className="space-y-6">
      <CardSection title="Step 9 of 9 • Payment" description="Securely pay the listing fee to post your tow request">
        <div className="space-y-3 text-sm text-gray-600">
          <ReviewRow label="Listing fee" value={`$${cost.postingFee.toFixed(2)}`} />
          <ReviewRow label="Subtotal" value={`$${cost.subtotal.toFixed(2)}`} />
          <ReviewRow label="Tax" value={`$${cost.tax.toFixed(2)}`} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-[#0D1B2A]">
          <span>Total due today</span>
          <span>${(cost.postingFee + cost.tax).toFixed(2)}</span>
        </div>
        {submitError && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{submitError}</div>
        )}
      </CardSection>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        <p className="font-semibold text-[#0D1B2A]">How it works</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>We hold the posting fee securely.</li>
          <li>Nearby operators bid or accept the job.</li>
          <li>You’ll only be charged for the tow after completion.</li>
        </ol>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-2xl bg-[#0D1B2A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Posting request..." : "Submit request"}
        </button>
      </div>
    </div>
  )
}

function computeCostBreakdown(distanceMiles: number, urgency: string, equipmentCount: number) {
  const baseFee = 85
  const perMileRate = 3.5
  const distanceFee = Math.max(distanceMiles, 0) * perMileRate
  const urgencyFee = urgency === "EMERGENCY" ? 60 : urgency === "SAME_DAY" ? 25 : 0
  const equipmentFee = equipmentCount * 15
  const subtotal = baseFee + distanceFee + urgencyFee + equipmentFee
  const tax = subtotal * 0.08
  const postingFee = 12
  const total = subtotal + tax + postingFee
  return { baseFee, perMileRate, distanceFee, urgencyFee, equipmentFee, subtotal, tax, postingFee, total }
}

function deriveVehicleType(make: string) {
  if (!make) return "PASSENGER"
  const lower = make.toLowerCase()
  if (lower.includes("freight") || lower.includes("international")) return "HEAVY_DUTY"
  if (lower.includes("harley") || lower.includes("kawasaki")) return "MOTORCYCLE"
  return "PASSENGER"
}

async function reverseGeocode(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error("Missing Google Maps API key")
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to reverse geocode location")
  }
  const payload = await response.json()
  if (!payload.results?.length) {
    throw new Error("No address found for coordinates")
  }
  const components: Array<{ types: string[]; long_name: string; short_name: string }> =
    payload.results[0].address_components ?? []
  const getComponent = (type: string, useShort = false) =>
    components.find((component) => component.types.includes(type))?.[useShort ? "short_name" : "long_name"] ?? ""

  return {
    street: payload.results[0].formatted_address ?? "",
    city: getComponent("locality") || getComponent("sublocality") || "",
    state: getComponent("administrative_area_level_1", true),
    zip: getComponent("postal_code"),
  }
}

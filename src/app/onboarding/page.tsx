"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarCheck2, Car, CheckCircle2, CreditCard, Shield, UserCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createSupabaseClient } from "@/lib/supabase"
import { WelcomeHero } from "./components/welcome-hero"
import { OnboardingShell } from "./components/onboarding-shell"
import { PersonalInfoCard } from "./components/personal-info-card"
import { VehicleInfoCard } from "./components/vehicle-info-card"
import { MembershipCard } from "./components/membership-card"
import { PaymentCard } from "./components/payment-card"
import { FormSection } from "./components/form-section"

type PersonalInfoForm = {
  firstName: string
  lastName: string
  birthday: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
}

type VehicleForm = {
  year: string
  make: string
  model: string
  engineSize: string
  vin: string
  mileage: string
  color: string
  nickname: string
}

type MembershipOption = {
  // Logical plan identifier – mapped from membership_plans.name
  id: string
  // Display name – mapped from membership_plans.display_name
  name: string
  emoji: string
  priceMonthly: string
  priceYearly: string
  description: string
  perks: string[]
}

const MEMBERSHIP_PLANS: MembershipOption[] = [
  {
    id: "BASIC",
    name: "Basic",
    emoji: "🛠️",
    priceMonthly: "$0",
    priceYearly: "$0",
    description: "Start your repair journey",
    perks: ["Post jobs", "Standard support", "Pay per job"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    emoji: "⚙️",
    priceMonthly: "$9.99",
    priceYearly: "$99.99",
    description: "Faster repairs, better techs",
    perks: ["Priority listings", "Verified technicians", "10% fees"]
  },
  {
    id: "ELITE",
    name: "Elite",
    emoji: "🔧",
    priceMonthly: "$19.99",
    priceYearly: "$199.99",
    description: "VIP service for vehicles",
    perks: ["Dedicated support", "Free diagnostics", "Invite-only techs"]
  },
  {
    id: "FLEET",
    name: "Fleet",
    emoji: "💎",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    description: "Designed for fleets",
    perks: ["Volume discounts", "Account manager", "Business invoicing"]
  },
]

const STEP_LABELS = ["Welcome", "Profile", "Vehicle", "Membership", "Payment", "Complete"]
const TEST_CARDS = [
  { number: "4242 4242 4242 4242", description: "Visa • Works for test mode" },
  { number: "4000 0566 5566 5556", description: "Debit • No funds required" },
]

export default function CustomerOnboardingPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseClient(), [])
  const { user, loading } = useAuth()

  const [step, setStep] = useState(0)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    birthday: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [vehicleData, setVehicleData] = useState<VehicleForm>({
    year: "",
    make: "",
    model: "",
    engineSize: "",
    vin: "",
    mileage: "",
    color: "",
    nickname: "",
  })
  const [availablePlans, setAvailablePlans] = useState<MembershipOption[]>(MEMBERSHIP_PLANS)
  const [membership, setMembership] = useState<MembershipOption>(MEMBERSHIP_PLANS[0])
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [savedCards, setSavedCards] = useState([
    { brand: "Visa", last4: "4242", exp: "04/28", label: "Primary" },
  ])
  const [stepError, setStepError] = useState<string | null>(null)
  const [stepSubmitting, setStepSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/sign-in")
    }
  }, [loading, user, router])

  // Load membership plans from Supabase so pricing and labels match the app/backend
  useEffect(() => {
    if (loading) return
    if (!user) return

    let isMounted = true

    const loadPlans = async () => {
      try {
        const { data, error } = await supabase
          .from("membership_plans")
          .select("name, display_name, tagline, price_monthly, price_yearly, features, is_active")
          .eq("is_active", true)
          .order("price_monthly", { ascending: true })

        if (error || !data || data.length === 0) {
          console.warn("Unable to load membership plans from Supabase, using defaults instead.", error)
          return
        }

        const PLAN_EMOJI: Record<string, string> = {
          BASIC: "🛠️",
          PREMIUM: "⚙️",
          ELITE: "🔧",
          FLEET: "💎",
        }

        const formatPrice = (value: any): string => {
          if (value == null) return "$0"
          const n = Number(value)
          if (Number.isNaN(n)) return "$0"
          if (n === 0) return "$0"
          return `$${n.toFixed(2)}`
        }

        const mapped: MembershipOption[] = data.map((row) => {
          const planName = (row.name as string | null) ?? "BASIC"
          const upper = planName.toUpperCase()
          const emoji = PLAN_EMOJI[upper] ?? "🔧"
          const displayName = (row.display_name as string | null) ?? planName
          const tagline = (row.tagline as string | null) ?? "Membership plan"
          const features = Array.isArray(row.features) ? (row.features as string[]) : []

          return {
            id: planName,
            name: displayName,
            emoji,
            priceMonthly: formatPrice(row.price_monthly),
            priceYearly: formatPrice(row.price_yearly),
            description: tagline,
            perks: features.length ? features : ["Standard support"],
          }
        })

        if (!isMounted) return

        setAvailablePlans(mapped)

        // If the user is still on the initial fallback plan or their previous
        // selection no longer exists, default to the first active plan from Supabase.
        setMembership((previous) => {
          if (!previous) return mapped[0]

          const wasFallback = MEMBERSHIP_PLANS.some((plan) => plan.id === previous.id)
          const stillExists = mapped.find((plan) => plan.id === previous.id)

          if (!stillExists || wasFallback) {
            return mapped[0]
          }

          return previous
        })
      } catch (planError) {
        console.warn("Unexpected error loading membership plans:", planError)
      }
    }

    loadPlans()

    return () => {
      isMounted = false
    }
  }, [loading, user, supabase])

  useEffect(() => {
    if (loading || !user) return

    let isMounted = true

    const verifyOnboarding = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single()

        if (!isMounted) return

        if (error) {
          console.error("Unable to verify onboarding progress:", error)
          return
        }

        if (data?.onboarding_completed) {
          router.replace("/dashboard")
        }
      } catch (verifyError) {
        console.error("Unexpected error verifying onboarding status:", verifyError)
      }
    }

    verifyOnboarding()

    return () => {
      isMounted = false
    }
  }, [loading, user, supabase, router])

  const handleNext = () => setStep((prev) => Math.min(prev + 1, STEP_LABELS.length - 1))
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0))

  const runStepAction = async (action: () => Promise<void>) => {
    setStepSubmitting(true)
    setStepError(null)
    try {
      await action()
    } catch (error: any) {
      console.error("Onboarding error", error)
      setStepError(error?.message ?? "Unable to save this step. Please try again.")
    } finally {
      setStepSubmitting(false)
    }
  }

  const handlePersonalInfoSubmit = async () => {
    if (!user) return
    await runStepAction(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: personalInfo.firstName.trim(),
          last_name: personalInfo.lastName.trim(),
          phone_number: personalInfo.phone.trim(),
          birthday: formatBirthday(personalInfo.birthday),
          address: personalInfo.address || null,
          city: personalInfo.city || null,
          state: personalInfo.state || null,
          zip_code: personalInfo.zipCode || null,
        })
        .eq("id", user.id)
      if (error) throw error
      handleNext()
    })
  }

  const handleVehicleSubmit = async () => {
    if (!user) return
    await runStepAction(async () => {
      const payload = {
        customer_id: user.id,
        year: vehicleData.year.trim(),
        make: vehicleData.make.trim(),
        model: vehicleData.model.trim(),
        engine_size: vehicleData.engineSize.trim(),
        vin: vehicleData.vin || null,
        mileage: vehicleData.mileage || null,
        color: vehicleData.color || null,
        nickname: vehicleData.nickname || null,
        is_primary: true,
      }

      // Avoid relying on `on_conflict` so we don't depend on a specific
      // unique constraint name in Supabase. Instead, perform a manual
      // "upsert" based on customer_id.
      const { data: existing, error: selectError } = await supabase
        .from("customer_vehicles")
        .select("id")
        .eq("customer_id", user.id)
        .maybeSingle()

      if (selectError && (selectError as any).code !== "PGRST116") {
        throw selectError
      }

      if (!existing) {
        const { error: insertError } = await supabase
          .from("customer_vehicles")
          .insert(payload as never)
        if (insertError) throw insertError
      } else {
        const { error: updateError } = await supabase
          .from("customer_vehicles")
          .update(payload as never)
          .eq("customer_id", user.id)
        if (updateError) throw updateError
      }

      handleNext()
    })
  }

  const handleMembershipSubmit = async () => {
    if (!user) return
    await runStepAction(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          membership_level: membership.id,
        })
        .eq("id", user.id)
      if (error) throw error
      handleNext()
    })
  }

  const handlePaymentSubmit = async () => {
    const needsPayment = membership.id !== "BASIC" && membership.id !== "FLEET"
    if (needsPayment && savedCards.length === 0) {
      setStepError("Add a payment method to continue")
      return
    }
    await runStepAction(async () => {
      handleNext()
    })
  }

  const handlePersonalInfoSkip = () => {
    setStepError(null)
    handleNext()
  }

  const handleVehicleSkip = () => {
    setStepError(null)
    handleNext()
  }

  const handleMembershipSkip = () => {
    const fallback =
      availablePlans.find((plan) => plan.id.toUpperCase() === "BASIC") ??
      availablePlans[0] ??
      MEMBERSHIP_PLANS[0]
    setMembership(fallback)
    setBillingCycle("monthly")
    setStepError(null)
    handleNext()
  }

  const handlePaymentSkip = () => {
    setStepError(null)
    handleNext()
  }

  const handleCompletion = async () => {
    if (!user) return
    await runStepAction(async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          membership_level: membership.id,
        })
        .eq("id", user.id)
      if (error) throw error
      router.replace("/dashboard")
    })
  }

  return (
    <OnboardingShell currentStep={step} totalSteps={STEP_LABELS.length} labels={STEP_LABELS}>
      {step === 0 ? (
        <WelcomeHero onBegin={handleNext} />
      ) : (
        <div className="space-y-6">
          {step === 1 && (
            <PersonalInfoCard>
              <form
                className="space-y-8"
                onSubmit={(event) => {
                  event.preventDefault()
                  handlePersonalInfoSubmit()
                }}
              >
                <FormSection
                  title="Contact information"
                  description="We use this to verify your identity and share updates with your technician."
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name *" value={personalInfo.firstName} onChange={(event) => setPersonalInfo({ ...personalInfo, firstName: event.target.value })} />
                    <Field label="Last name *" value={personalInfo.lastName} onChange={(event) => setPersonalInfo({ ...personalInfo, lastName: event.target.value })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Phone number *" value={personalInfo.phone} placeholder="(555) 123-4567" onChange={(event) => setPersonalInfo({ ...personalInfo, phone: event.target.value })} />
                    <Field label="Birthday" placeholder="MM/DD/YYYY" value={personalInfo.birthday} onChange={(event) => setPersonalInfo({ ...personalInfo, birthday: event.target.value })} />
                  </div>
                </FormSection>

                <FormSection
                  title="Address"
                  description="Optional, but helps technicians arrive prepared with travel estimates."
                >
                  <Field label="Street address" value={personalInfo.address} onChange={(event) => setPersonalInfo({ ...personalInfo, address: event.target.value })} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="City" value={personalInfo.city} onChange={(event) => setPersonalInfo({ ...personalInfo, city: event.target.value })} />
                    <Field label="State" value={personalInfo.state} onChange={(event) => setPersonalInfo({ ...personalInfo, state: event.target.value })} />
                    <Field label="ZIP code" value={personalInfo.zipCode} onChange={(event) => setPersonalInfo({ ...personalInfo, zipCode: event.target.value })} />
                  </div>
                </FormSection>

                {stepError && <p className="text-sm font-semibold text-rose-600">{stepError}</p>}

                <StepActions
                  onBack={handleBack}
                  onSkip={handlePersonalInfoSkip}
                  loading={stepSubmitting}
                  isNextDisabled={!personalInfo.firstName.trim() || !personalInfo.lastName.trim() || personalInfo.phone.trim().length < 10}
                />
              </form>
            </PersonalInfoCard>
          )}
          {step === 2 && (
            <VehicleInfoCard>
              <VehicleStep
                value={vehicleData}
                onChange={setVehicleData}
                onSubmit={handleVehicleSubmit}
                onBack={handleBack}
                onSkip={handleVehicleSkip}
                loading={stepSubmitting}
                error={stepError}
              />
            </VehicleInfoCard>
          )}
          {step === 3 && (
            <MembershipCard>
              <MembershipStep
                plans={availablePlans}
                selected={membership}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                onSelect={setMembership}
                onSubmit={handleMembershipSubmit}
                onBack={handleBack}
                onSkip={handleMembershipSkip}
                loading={stepSubmitting}
                error={stepError}
              />
            </MembershipCard>
          )}
          {step === 4 && (
            <PaymentCard>
              <PaymentStep
                cards={savedCards}
                onCardsChange={setSavedCards}
                selectedPlan={membership}
                billingCycle={billingCycle}
                onSubmit={handlePaymentSubmit}
                onBack={handleBack}
                onSkip={handlePaymentSkip}
                loading={stepSubmitting}
                error={stepError}
              />
            </PaymentCard>
          )}
          {step === 5 && (
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 transition-all sm:p-10">
              <CompletionStep
                membership={membership}
                billingCycle={billingCycle}
                onBack={handleBack}
                onFinish={handleCompletion}
                loading={stepSubmitting}
                error={stepError}
              />
            </div>
          )}
        </div>
      )}
    </OnboardingShell>
  )
}

function VehicleStep({
  value,
  onChange,
  onSubmit,
  onBack,
  onSkip,
  loading,
  error,
}: {
  value: VehicleForm
  onChange: (next: VehicleForm) => void
  onSubmit: () => void
  onBack: () => void
  onSkip: () => void
  loading: boolean
  error: string | null
}) {
  const update = (key: keyof VehicleForm, next: string) => onChange({ ...value, [key]: next })
  const isValid = value.year.trim() && value.make.trim() && value.model.trim() && value.engineSize.trim()
  return (
    <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); if (isValid && !loading) onSubmit() }}>
      <header className="space-y-2 text-center">
        <Car className="mx-auto h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold text-slate-900">Add your vehicle</h2>
        <p className="text-sm text-slate-500">Technicians need make, model, year, and engine to come ready.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Year *" value={value.year} onChange={(event) => update("year", event.target.value)} />
        <Field label="Make *" value={value.make} onChange={(event) => update("make", event.target.value)} />
        <Field label="Model *" value={value.model} onChange={(event) => update("model", event.target.value)} />
        <Field label="Engine size *" placeholder="2.0L I4" value={value.engineSize} onChange={(event) => update("engineSize", event.target.value)} />
      </div>
      <Field label="VIN" placeholder="Optional" value={value.vin} onChange={(event) => update("vin", event.target.value)} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Mileage" placeholder="45,000" value={value.mileage} onChange={(event) => update("mileage", event.target.value)} />
        <Field label="Color" value={value.color} onChange={(event) => update("color", event.target.value)} />
        <Field label="Nickname" placeholder="My Honda" value={value.nickname} onChange={(event) => update("nickname", event.target.value)} />
      </div>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      <StepActions onBack={onBack} onSkip={onSkip} loading={loading} isNextDisabled={!isValid} />
    </form>
  )
}

function MembershipStep({
  plans,
  selected,
  billingCycle,
  onBillingCycleChange,
  onSelect,
  onSubmit,
  onBack,
  onSkip,
  loading,
  error,
}: {
  plans: MembershipOption[]
  selected: MembershipOption
  billingCycle: "monthly" | "yearly"
  onBillingCycleChange: (cycle: "monthly" | "yearly") => void
  onSelect: (plan: MembershipOption) => void
  onSubmit: () => void
  onBack: () => void
  onSkip: () => void
  loading: boolean
  error: string | null
}) {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Shield className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Choose a membership</h2>
        <p className="text-sm text-slate-500">Select the plan that best fits your vehicle needs.</p>
      </header>
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-medium text-slate-600">Billing cycle</span>
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-medium">
          <button type="button" onClick={() => onBillingCycleChange("monthly")} className={`rounded-full px-4 py-1 ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            Monthly
          </button>
          <button type="button" onClick={() => onBillingCycleChange("yearly")} className={`rounded-full px-4 py-1 ${billingCycle === "yearly" ? "bg-white text-slate-900 shadow" : "text-slate-500"}`}>
            Yearly
          </button>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {plans.map((plan) => {
          const isSelected = plan.id === selected.id
          return (
            <button key={plan.id} type="button" onClick={() => onSelect(plan)} className={`rounded-2xl border p-5 text-left shadow-sm transition ${isSelected ? "border-primary shadow-lg shadow-primary/10" : "border-slate-200"}`}>
              <div className="flex items-center justify-between">
                <div className="text-3xl">{plan.emoji}</div>
                {isSelected && <CheckCircle2 className="h-6 w-6 text-primary" />}
              </div>
              <p className="mt-4 text-lg font-semibold text-slate-900">{plan.name}</p>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-3 text-xl font-bold text-slate-900">
                {billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly}
                <span className="ml-1 text-sm font-medium text-slate-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
              </p>
              <ul className="mt-4 space-y-1 text-sm text-slate-600">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      <StepActions onBack={onBack} onSkip={onSkip} onNext={onSubmit} loading={loading} />
    </div>
  )
}

function PaymentStep({
  cards,
  onCardsChange,
  selectedPlan,
  billingCycle,
  onSubmit,
  onBack,
  onSkip,
  loading,
  error,
}: {
  cards: { brand: string; last4: string; exp: string; label: string }[]
  onCardsChange: (next: { brand: string; last4: string; exp: string; label: string }[]) => void
  selectedPlan: MembershipOption
  billingCycle: "monthly" | "yearly"
  onSubmit: () => void
  onBack: () => void
  onSkip: () => void
  loading: boolean
  error: string | null
}) {
  const [showForm, setShowForm] = useState(false)
  const [newCard, setNewCard] = useState({ brand: "Visa", last4: "0000", exp: "01/28", label: "New card" })

  const addCard = () => {
    if (!newCard.last4.trim()) return
    onCardsChange([...cards, newCard])
    setNewCard({ brand: "Visa", last4: "0000", exp: "01/28", label: "New card" })
    setShowForm(false)
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2 text-center">
        <CreditCard className="mx-auto h-12 w-12 text-primary" />
        <h2 className="text-2xl font-bold text-slate-900">Payment setup</h2>
        <p className="text-sm text-slate-500">Add a card so we can confirm bookings instantly.</p>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">Plan summary</p>
        <p className="mt-1">
          {selectedPlan.name} · {billingCycle === "monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly}
          <span className="ml-1 text-xs text-slate-500">/{billingCycle === "monthly" ? "month" : "year"}</span>
        </p>
      </div>
      {cards.map((card) => (
        <div key={card.last4} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
          <div>
            <p className="font-semibold text-slate-900">
              {card.brand} · **** {card.last4}
            </p>
            <p className="text-sm text-slate-500">Expires {card.exp} · {card.label}</p>
          </div>
          <button type="button" onClick={() => onCardsChange(cards.filter((item) => item.last4 !== card.last4))} className="text-sm font-medium text-rose-500 hover:text-rose-600">
            Remove
          </button>
        </div>
      ))}
      {showForm ? (
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-semibold text-slate-600">Add payment method</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Card label" value={newCard.label} onChange={(event) => setNewCard({ ...newCard, label: event.target.value })} />
            <Field label="Last 4" maxLength={4} value={newCard.last4} onChange={(event) => setNewCard({ ...newCard, last4: event.target.value })} />
            <Field label="Brand" value={newCard.brand} onChange={(event) => setNewCard({ ...newCard, brand: event.target.value })} />
            <Field label="Exp" placeholder="MM/YY" value={newCard.exp} onChange={(event) => setNewCard({ ...newCard, exp: event.target.value })} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={addCard} className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-white">
              Save card
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setShowForm(true)} className="w-full rounded-2xl border border-dashed border-slate-300 py-4 text-sm font-semibold text-slate-600 hover:border-primary hover:text-primary">
          + Add payment method
        </button>
      )}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        <p className="font-semibold text-slate-900">Test cards (use during sandbox testing)</p>
        {TEST_CARDS.map((card) => (
          <p key={card.number} className="flex items-center justify-between">
            <span className="font-mono">{card.number}</span>
            <span>{card.description}</span>
          </p>
        ))}
      </div>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      <StepActions onBack={onBack} onSkip={onSkip} onNext={onSubmit} loading={loading} isNextDisabled={loading} />
    </div>
  )
}

function CompletionStep({
  membership,
  billingCycle,
  onBack,
  onFinish,
  loading,
  error,
}: {
  membership: MembershipOption
  billingCycle: "monthly" | "yearly"
  onBack: () => void
  onFinish: () => void
  loading: boolean
  error: string | null
}) {
  return (
    <div className="space-y-6 text-center">
      <CalendarCheck2 className="mx-auto h-16 w-16 text-primary" />
      <h2 className="text-3xl font-bold text-slate-900">You&rsquo;re all set!</h2>
      <p className="text-base text-slate-600">Onboarding is complete — your membership is active and backing your repairs.</p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left shadow-inner">
        <p className="text-sm font-semibold text-slate-500">Plan</p>
        <p className="mt-1 text-xl font-bold text-slate-900">
          {membership.emoji} {membership.name}
        </p>
        <p className="text-sm text-slate-600">
          {billingCycle === "monthly" ? membership.priceMonthly : membership.priceYearly} · {billingCycle === "monthly" ? "monthly" : "annual"}
        </p>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          {membership.perks.slice(0, 3).map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </div>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={onBack} className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-400">
          Review previous step
        </button>
        <button type="button" onClick={onFinish} disabled={loading} className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30">
          {loading ? "Finishing..." : "Go to dashboard"}
        </button>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string
  value: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  maxLength?: number
}) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  )
}

function StepActions({
  onBack,
  onNext,
  onSkip,
  skipLabel = "Skip for now",
  loading,
  isNextDisabled,
}: {
  onBack: () => void
  onNext?: () => void
  onSkip?: () => void
  skipLabel?: string
  loading?: boolean
  isNextDisabled?: boolean
}) {
  const isDisabled = loading || isNextDisabled
  return (
    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300"
        >
          Back
        </button>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-dashed border-slate-200 px-6 py-3 text-sm font-semibold text-slate-500 hover:border-primary/40 hover:text-primary"
          >
            {skipLabel}
          </button>
        )}
      </div>
      <button
        type={onNext ? "button" : "submit"}
        onClick={onNext}
        disabled={isDisabled}
        className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  )
}

function formatBirthday(value: string): string | null {
  const cleaned = value.replace(/[^0-9]/g, "")
  if (cleaned.length !== 8) return null
  const month = cleaned.slice(0, 2)
  const day = cleaned.slice(2, 4)
  const year = cleaned.slice(4)
  return `${year}-${month}-${day}`
}

"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { CarRepairProvider, useCarRepair } from './car-repair-context'
import { LocationStep } from './steps/location-step'
import { VehicleStep } from './steps/vehicle-step'
import { ServiceStep } from './steps/service-step'
import { SchedulingStep } from './steps/scheduling-step'
import { CheckoutStep } from './steps/checkout-step'
import { ConfirmationStep } from './steps/confirmation-step'
import { CarRepairIntro } from './components/intro'
import { SERVICE_LABEL_MAP, CAR_REPAIR_AGREEMENT_SECTIONS, STEP_DEFINITIONS } from './data'
import {
  RepairBoardPostDialog,
  RepairBoardCheckoutDialog,
  RepairBoardConfirmationDialog,
  type RepairBoardPostDraft,
  type RepairBoardCheckoutPayload,
} from './components/repair-board-dialogs'
import { useRepairBoardFlow } from './components/hooks/use-repair-board-flow'

const STEP_TITLES = STEP_DEFINITIONS.map((step) => step.label)

function AgreementStep({
  sections,
  onAgree,
  onCancel,
  onScrolledStateChange,
}: {
  sections: { title: string; content: string }[]
  onAgree: () => void
  onCancel: () => void
  onScrolledStateChange?: (scrolledToBottom: boolean) => void
}) {
  const [isAgreed, setIsAgreed] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = element
      if (scrollTop + clientHeight >= scrollHeight - 4) {
        setHasScrolledToBottom(true)
      }
    }

    handleScroll()
    element.addEventListener('scroll', handleScroll)
    return () => element.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    onScrolledStateChange?.(hasScrolledToBottom)
  }, [hasScrolledToBottom, onScrolledStateChange])

  const toggleAgreement = () => {
    if (!hasScrolledToBottom) return
    setIsAgreed((previous) => !previous)
  }

  const handleAgree = () => {
    if (!isAgreed || !hasScrolledToBottom) return

    console.info('Service agreement accepted', {
      timestamp: Date.now(),
    })

    onAgree()
  }

  const handleDownload = () => {
    console.info('Service agreement download requested')
  }

  const agreeDisabled = !(isAgreed && hasScrolledToBottom)

  return (
    <section
      className={`flex w-full flex-col rounded-3xl ${
        hasScrolledToBottom ? 'bg-white' : 'bg-white/98'
      } p-6 shadow-2xl shadow-slate-900/20 backdrop-blur`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#0D1B2A]">Service Agreement</h2>
          <p className="text-sm text-gray-600">Before continuing, please read and agree to the terms below.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-lg text-[#0D1B2A] transition hover:border-[#0D1B2A] hover:bg-[#0D1B2A] hover:text-white"
          aria-label="Close service agreement"
        >
          ✕
        </button>
      </header>

      <div
        ref={scrollRef}
        className="mt-6 max-h-[420px] space-y-5 overflow-y-auto rounded-2xl border border-gray-200 bg-gray-50/70 px-5 py-4 text-sm text-gray-700"
      >
        {sections.map((section) => (
          <article key={section.title} className="space-y-2">
            <h3 className="text-base font-semibold text-[#0D1B2A]">{section.title}</h3>
            {section.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </article>
        ))}
      </div>

      {!hasScrolledToBottom && (
        <p className="mt-4 rounded-xl bg-[#0D1B2A]/10 px-4 py-2 text-center text-sm font-medium text-[#0D1B2A]">
          ⬇️ Please scroll to the bottom to read all terms
        </p>
      )}

      <button
        type="button"
        onClick={toggleAgreement}
        className={`mt-5 flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
          hasScrolledToBottom
            ? 'border-[#0D1B2A] hover:bg-[#0D1B2A]/5'
            : 'cursor-not-allowed border-gray-200 opacity-60'
        }`}
      >
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg border-2 text-base font-semibold ${
            isAgreed && hasScrolledToBottom
              ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
              : hasScrolledToBottom
              ? 'border-[#0D1B2A] text-[#0D1B2A]'
              : 'border-gray-300 text-gray-300'
          }`}
          aria-hidden
        >
          {isAgreed && hasScrolledToBottom ? '✓' : ''}
        </span>
        <span className="text-sm text-gray-700">
          {hasScrolledToBottom
            ? 'I have read and agree to the Vehicle Repair Service Agreement'
            : 'Please scroll to the bottom to read all terms first'}
        </span>
      </button>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-xl border border-[#0D1B2A] px-4 py-3 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A]/10 sm:w-auto sm:flex-1"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAgree}
          disabled={agreeDisabled}
          className="w-full rounded-xl bg-[#0D1B2A] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:flex-1"
        >
          I Agree — Continue
        </button>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="mt-4 w-full rounded-xl border border-dashed border-[#0D1B2A]/40 px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:border-[#0D1B2A] hover:bg-[#0D1B2A]/5"
      >
        📄 Download or print this agreement
      </button>
    </section>
  )
}

type ServiceType = 'car' | 'tire' | 'wash'

export default function CarRepairFlowPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const serviceType: ServiceType = useMemo(() => {
    const fromQuery = (searchParams.get('type') || '').toLowerCase()
    if (fromQuery === 'tire' || fromQuery === 'wash') return fromQuery
    return 'car'
  }, [searchParams])

  return (
    <CarRepairProvider>
      <FlowScaffold serviceType={serviceType} onExit={() => router.push('/dashboard')} />
    </CarRepairProvider>
  )
}

type FlowProps = {
  serviceType: ServiceType
  onExit: () => void
}

function FlowScaffold({ serviceType, onExit }: FlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [overlayIsWhite, setOverlayIsWhite] = useState(false)
  const { service, location, vehicle, setService, reset } = useCarRepair()
  const {
    state: repairBoardState,
    start: startRepairBoardFlow,
    cancel: cancelRepairBoardFlow,
    submitPostDetails: submitRepairBoardDraft,
    goBackToPost: goBackToRepairBoardPost,
    applyDiscount: applyRepairBoardDiscount,
    completeCheckout: completeRepairBoardCheckout,
  } = useRepairBoardFlow()
  const isRepairBoardSelection = service?.action === 'repair-board'

  useEffect(() => {
    if (!isRepairBoardSelection && repairBoardState.stage !== 'idle') {
      cancelRepairBoardFlow()
    }
  }, [isRepairBoardSelection, repairBoardState.stage, cancelRepairBoardFlow])

  const handleResetAndExit = () => {
    reset()
    onExit()
  }

  const goToStep = (index: number) => {
    setStepIndex(() => Math.max(0, Math.min(index, STEP_TITLES.length - 1)))
  }

  const goNext = () => goToStep(stepIndex + 1)
  const goBack = () => goToStep(stepIndex - 1)

  const handleServiceSelect = () => {
    if (isRepairBoardSelection) {
      if (repairBoardState.stage === 'idle') {
        startRepairBoardFlow()
      }
      return
    }

    goNext()
  }

  const postDialogDraft = repairBoardState.stage === 'post' ? repairBoardState.draft : null
  const checkoutDraft =
    repairBoardState.stage === 'checkout' || repairBoardState.stage === 'saving'
      ? repairBoardState.draft
      : null
  const confirmationSummary = repairBoardState.stage === 'confirmation' ? repairBoardState.summary : null
  const checkoutError =
    repairBoardState.stage === 'checkout' ? repairBoardState.error ?? null : null

  const serviceEstimateValue = service
    ? service.serviceEstimate ?? Number(((service.laborCost ?? 0) + (service.partsCost ?? 0)).toFixed(2))
    : 0

  const handleRepairBoardPostSubmit = (draft: RepairBoardPostDraft) => {
    if (!service) return

    setService({
      ...service,
      pricingType: draft.pricingType,
      userBudget:
        draft.pricingType === 'FIXED_PRICE'
          ? draft.fixedBudget ?? service.userBudget
          : draft.maxBidBudget ?? service.userBudget,
      maxBidBudget: draft.maxBidBudget,
      taxAmount: draft.taxAmount,
      postingFee: draft.postingFee,
      serviceFee: draft.serviceFee,
      platformFee: draft.platformFee,
      totalCost: draft.totalCost,
      discountAmount: 0,
      problemDescription: draft.problemDescription,
      dateTimePreference: draft.dateTimePreference,
      preferredDateTime: draft.preferredDateTime,
      locationLatitude: draft.locationLatitude ?? null,
      locationLongitude: draft.locationLongitude ?? null,
      photoUrls: service.photoUrls ?? [],
    })

    submitRepairBoardDraft(draft)
  }

  const handleRepairBoardCheckoutConfirm = async (payload: RepairBoardCheckoutPayload) => {
    const { discountAmount } = payload

    if (!checkoutDraft || !service || !location || !vehicle) return

    setService({
      ...service,
      pricingType: checkoutDraft.pricingType,
      userBudget:
        checkoutDraft.pricingType === 'FIXED_PRICE'
          ? checkoutDraft.fixedBudget ?? service.userBudget
          : checkoutDraft.maxBidBudget ?? service.userBudget,
      maxBidBudget: checkoutDraft.maxBidBudget,
      taxAmount: checkoutDraft.taxAmount,
      postingFee: checkoutDraft.postingFee,
      serviceFee: checkoutDraft.serviceFee,
      platformFee: checkoutDraft.platformFee,
      discountAmount,
      totalCost: Math.max(checkoutDraft.totalCost - discountAmount, 0),
    })

    await completeRepairBoardCheckout(checkoutDraft, {
      categoryName: service.category ?? service.title,
      subcategoryName: service.subcategory ?? service.title,
      specificationName: service.specification,
      serviceTitle: service.title,
      serviceDescription: service.description,
      location: {
        streetAddress: location.streetAddress,
        city: location.city,
        state: location.state,
        zipCode: location.zipCode,
        crossStreet: location.crossStreet,
      },
      vehicle: {
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        engineSize: vehicle.engineSize,
        vin: vehicle.vin,
        mileage: vehicle.mileage,
        trim: vehicle.trim,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        driveType: vehicle.driveType,
        bodyStyle: vehicle.bodyStyle,
        doors: vehicle.doors,
      },
    })
  }

  useEffect(() => {
    if (stepIndex !== 1) {
      setOverlayIsWhite(false)
    }
  }, [stepIndex])

  const renderStepContent = () => {
    switch (stepIndex) {
      case 0:
        return (
          <CarRepairIntro
            serviceType={serviceType}
            onBack={handleResetAndExit}
            onGetStarted={() => goToStep(1)}
          />
        )
      case 1:
        return <div className="min-h-[360px]" aria-hidden />
      case 2:
        return (
          <LocationStep
            serviceLabel={SERVICE_LABEL_MAP[serviceType]}
            onNext={goNext}
            onBack={goBack}
            onCancel={handleResetAndExit}
            stepIndex={2}
            totalSteps={STEP_TITLES.length}
          />
        )
      case 3:
        return <VehicleStep onNext={goNext} onBack={goBack} serviceType={serviceType} />
      case 4:
        return <ServiceStep onSelect={handleServiceSelect} onBack={goBack} serviceType={serviceType} />
      case 5:
        return (
          <SchedulingStep
            onBack={goBack}
            onNext={goNext}
            stepIndex={5}
            totalSteps={STEP_TITLES.length}
          />
        )
      case 6:
        return <CheckoutStep onBack={goBack} onNext={goNext} />
      case 7:
        return <ConfirmationStep onClose={handleResetAndExit} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#0D1B2A]/70">Here Ta Help • {SERVICE_LABEL_MAP[serviceType]}</p>
            <h1 className="text-3xl font-bold text-[#0D1B2A]">Schedule service</h1>
            <div className="h-px w-16 rounded-full bg-gradient-to-r from-[#0D1B2A] via-[#1F2A44] to-transparent" />
          </div>
          <StepIndicator currentStep={stepIndex} />
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={stepIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur"
          >
            {renderStepContent()}
          </motion.section>
        </AnimatePresence>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0D1B2A]/10 bg-white/95 px-5 py-4 text-sm text-gray-600 shadow-md shadow-slate-900/5 backdrop-blur"
        >
          <div className="space-y-1">
            <strong className="text-[#0D1B2A]">Need help?</strong>
            <p>
              Contact support anytime at
              <span className="font-semibold text-[#0D1B2A]"> support@heretahelp.online</span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleResetAndExit}
            className="rounded-xl border border-[#0D1B2A] px-4 py-2 font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
          >
            Cancel request
          </motion.button>
        </motion.section>
      </motion.main>

      <AnimatePresence>
        {stepIndex === 1 && (
          <motion.div
            key="service-agreement"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
              overlayIsWhite ? 'bg-white' : 'bg-black/60'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-3xl"
            >
              <AgreementStep
                sections={CAR_REPAIR_AGREEMENT_SECTIONS}
                onAgree={goNext}
                onCancel={() => goToStep(0)}
                onScrolledStateChange={setOverlayIsWhite}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RepairBoardPostDialog
        open={isRepairBoardSelection && repairBoardState.stage === 'post'}
        onClose={() => cancelRepairBoardFlow()}
        categoryName={service?.category ?? service?.title ?? 'Service'}
        categoryEmoji={service?.emoji}
        subcategoryName={service?.subcategory ?? service?.title ?? 'Service'}
        specificationName={service?.specification}
        vehicle={vehicle ? { year: vehicle.year, make: vehicle.make, model: vehicle.model, engineSize: vehicle.engineSize } : null}
        location={location ? { streetAddress: location.streetAddress, city: location.city, state: location.state, zipCode: location.zipCode } : null}
        serviceEstimate={serviceEstimateValue}
        initialDraft={postDialogDraft ?? undefined}
        onSubmit={handleRepairBoardPostSubmit}
      />

      <RepairBoardCheckoutDialog
        open={isRepairBoardSelection && Boolean(checkoutDraft)}
        draft={checkoutDraft as RepairBoardPostDraft}
        categoryName={service?.category ?? service?.title ?? 'Service'}
        subcategoryName={service?.subcategory ?? service?.title ?? 'Service'}
        specificationName={service?.specification}
        onBack={goBackToRepairBoardPost}
        onConfirm={(payload) => handleRepairBoardCheckoutConfirm(payload)}
        onApplyDiscount={applyRepairBoardDiscount}
        isSubmitting={repairBoardState.stage === 'saving'}
        errorMessage={checkoutError ?? undefined}
      />

      <RepairBoardConfirmationDialog
        open={isRepairBoardSelection && Boolean(confirmationSummary)}
        summary={confirmationSummary ?? { postId: '', totalPaid: 0, pricingType: 'BID', problemDescription: '', photoUrls: [], serviceName: '' }}
        onClose={() => {
          cancelRepairBoardFlow()
          handleResetAndExit()
        }}
      />
    </div>
  )
}

type IndicatorProps = {
  currentStep: number
}

function StepIndicator({ currentStep }: IndicatorProps) {
  void currentStep

  return null
}

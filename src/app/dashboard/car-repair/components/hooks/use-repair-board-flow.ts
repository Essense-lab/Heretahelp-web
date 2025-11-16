import { useCallback, useMemo, useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { RepairBoardRepository } from '@/lib/repositories/repair-board-repository'
import { DiscountService } from '@/lib/repositories/discount-service'
import type { RepairBoardPostDto } from '@/types'
import type { RepairBoardConfirmationSummary, RepairBoardPostDraft } from '../repair-board-dialogs'
import { applyDiscountCode } from '../repair-board-dialogs'

type IdleState = { stage: 'idle' }
type PostState = { stage: 'post'; draft: RepairBoardPostDraft | null }
type CheckoutState = { stage: 'checkout'; draft: RepairBoardPostDraft; error?: string }
type SavingState = { stage: 'saving'; draft: RepairBoardPostDraft }
type ConfirmationState = { stage: 'confirmation'; summary: RepairBoardConfirmationSummary }

export type RepairBoardFlowState = IdleState | PostState | CheckoutState | SavingState | ConfirmationState

type CheckoutDetails = {
  categoryName: string
  subcategoryName: string
  specificationName?: string | null
  serviceTitle: string
  serviceDescription: string
  location: {
    streetAddress: string
    city: string
    state: string
    zipCode: string
    crossStreet?: string
  }
  vehicle: {
    year: string
    make: string
    model: string
    engineSize?: string
    vin?: string
    mileage?: string
    trim?: string
    fuelType?: string
    transmission?: string
    driveType?: string
    bodyStyle?: string
    doors?: string
  }
}

export function useRepairBoardFlow() {
  const [state, setState] = useState<RepairBoardFlowState>({ stage: 'idle' })
  const [discount, setDiscount] = useState<{ amount: number; id: string | null }>({ amount: 0, id: null })

  const supabase = useMemo(() => createSupabaseClient(), [])
  const repository = useMemo(() => new RepairBoardRepository(), [])
  const discountService = useMemo(() => new DiscountService(), [])

  const start = useCallback(() => {
    setDiscount({ amount: 0, id: null })
    setState({ stage: 'post', draft: null })
  }, [])

  const cancel = useCallback(() => {
    setState({ stage: 'idle' })
    setDiscount({ amount: 0, id: null })
  }, [])

  const submitPostDetails = useCallback((draft: RepairBoardPostDraft) => {
    setState({ stage: 'checkout', draft, error: undefined })
  }, [])

  const goBackToPost = useCallback(() => {
    setState((previous) => {
      if (previous.stage === 'checkout' || previous.stage === 'saving') {
        return { stage: 'post', draft: previous.draft }
      }
      return previous
    })
  }, [])

  const applyDiscount = useCallback(async (code: string, orderTotal: number) => {
    const result = await applyDiscountCode(code, orderTotal)
    if (result.success) {
      setDiscount({ amount: result.amount, id: result.id })
    }
    return result
  }, [])

  const completeCheckout = useCallback(
    async (draft: RepairBoardPostDraft, details: CheckoutDetails) => {
      setState({ stage: 'saving', draft })

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error || !user) {
          throw new Error('You must be signed in to post to the repair board.')
        }

        const userName = [
          user.user_metadata?.first_name,
          user.user_metadata?.last_name,
        ]
          .filter(Boolean)
          .join(' ')
          .trim() || user.user_metadata?.full_name || user.email || 'Here Ta Help Customer'

        const finalTotalCost = Math.max(draft.totalCost - discount.amount, 0)

        const categoryLabel = details.categoryName.toLowerCase()
        const subcategoryLabel = details.subcategoryName.toLowerCase()
        const engineLabel = (details.vehicle.engineSize ?? '').toLowerCase()

        const isBoatService = categoryLabel.includes('boat')
        const isTireService =
          categoryLabel.includes('tire') ||
          subcategoryLabel.includes('tire') ||
          subcategoryLabel.includes('wheel alignment') ||
          subcategoryLabel.includes('tpms')
        const isLocksmithService =
          categoryLabel.includes('lock') || subcategoryLabel.includes('lock')
        const isDieselVehicle =
          engineLabel.includes('diesel') ||
          engineLabel.includes('duramax') ||
          engineLabel.includes('powerstroke') ||
          engineLabel.includes('cummins')

        const postRecord: Omit<RepairBoardPostDto, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          user_name: userName,
          vehicle_year: details.vehicle.year,
          vehicle_make: details.vehicle.make,
          vehicle_model: details.vehicle.model,
          vehicle_engine: details.vehicle.engineSize ?? '',
          vehicle_vin: details.vehicle.vin,
          vehicle_mileage: details.vehicle.mileage,
          vehicle_trim: details.vehicle.trim,
          vehicle_fuel_type: details.vehicle.fuelType,
          vehicle_transmission: details.vehicle.transmission,
          vehicle_drive_type: details.vehicle.driveType,
          vehicle_body_style: details.vehicle.bodyStyle,
          vehicle_doors: details.vehicle.doors,
          service_category: details.categoryName,
          service_subcategory: details.subcategoryName,
          service_specification: details.specificationName ?? '',
          location_address: details.location.streetAddress,
          location_city: details.location.city,
          location_state: details.location.state,
          location_zip_code: details.location.zipCode,
          location_latitude: draft.locationLatitude ?? undefined,
          location_longitude: draft.locationLongitude ?? undefined,
          problem_description: draft.problemDescription,
          date_time_preference: draft.dateTimePreference,
          preferred_date_time: draft.preferredDateTime,
          pricing_type: draft.pricingType,
          user_budget:
            draft.pricingType === 'FIXED_PRICE'
              ? draft.fixedBudget ?? 0
              : draft.maxBidBudget ?? 0,
          tax_amount: draft.taxAmount,
          posting_fee: draft.postingFee,
          total_cost: finalTotalCost,
          service_estimate: draft.serviceEstimate,
          status: 'ACTIVE',
          is_public: true,
          car_tech: !isBoatService,
          diesel_tech: isDieselVehicle && !isBoatService,
          boat_tech: isBoatService,
          tire_tech: isTireService,
          locksmith_tech: isLocksmithService,
          photo_urls: [],
        }

        const savedPost = await repository.createPost(postRecord)
        if (!savedPost) {
          throw new Error('Unable to create repair board post.')
        }

        let photoUrls: string[] = []
        const photoFiles = draft.photoFiles ?? []

        if (photoFiles.length > 0) {
          const uploadedUrls = await repository.uploadPhotos(savedPost.id, photoFiles)
          if (uploadedUrls.length > 0) {
            await repository.savePhotosToDatabase(savedPost.id, uploadedUrls)
            await repository.updatePostPhotos(savedPost.id, uploadedUrls)
            photoUrls = uploadedUrls
          }
        }

        if (discount.id && discount.amount > 0) {
          await discountService.recordDiscountUsage({
            discountId: discount.id,
            userId: user.id,
            postId: savedPost.id,
            discountAmount: discount.amount,
            originalAmount: draft.totalCost,
            finalAmount: finalTotalCost,
          })
        }

        setDiscount({ amount: 0, id: null })

        setState({
          stage: 'confirmation',
          summary: {
            postId: savedPost.id,
            totalPaid: finalTotalCost,
            pricingType: draft.pricingType,
            problemDescription: draft.problemDescription,
            photoUrls: photoUrls.length ? photoUrls : savedPost.photo_urls ?? [],
            serviceName: details.serviceTitle,
            discountId: discount.id,
          },
        })
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to complete payment. Please try again.'
        setState({ stage: 'checkout', draft, error: message })
      }
    },
    [discount, supabase, repository, discountService]
  )

  return {
    state,
    discount,
    start,
    cancel,
    submitPostDetails,
    goBackToPost,
    applyDiscount,
    completeCheckout,
  }
}

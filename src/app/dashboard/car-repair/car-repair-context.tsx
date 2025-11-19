'use client'

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type LocationInfo = {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  crossStreet?: string
}

type VehicleInfo = {
  year: string
  make: string
  model: string
  engineSize: string
  vin: string
  mileage: string
  trim?: string
  fuelType?: string
  transmission?: string
  driveType?: string
  bodyStyle?: string
  doors?: string
  tireSize?: string
  color?: string
  licensePlate?: string
  recordId?: string
}

type ServiceSelection = {
  id: string
  categoryId?: string
  subcategoryId?: string
  specificationId?: string
  title: string
  description: string
  laborCost: number
  partsCost: number
  category: string
  subcategory?: string
  emoji?: string
  specification?: string
  action?: 'schedule' | 'repair-board'
  hasOwnParts?: boolean
  selectedParts?: Array<{
    partId: string
    partName: string
    supplierId: string
    supplierName: string
    unitPrice: number
    quantity: number
  }>
  priceSource?: 'base' | 'spread' | 'custom'
  priceRange?: string
  serviceEstimate?: number
  pricingType?: 'BID' | 'FIXED_PRICE'
  userBudget?: number
  maxBidBudget?: number
  taxAmount?: number
  postingFee?: number
  serviceFee?: number
  platformFee?: number
  discountAmount?: number
  totalCost?: number
  problemDescription?: string
  dateTimePreference?: string
  preferredDateTime?: string
  photoUrls?: string[]
  locationLatitude?: number | null
  locationLongitude?: number | null
}

type ScheduleDetails = {
  date: string
  timeSlot: string
  technicianName?: string
  technicianId?: string
  technicianRating?: number
  technicianSpecialty?: string
  technicianPhotoUrl?: string
  notes?: string
  rewardId?: string
  rewardDiscount?: number
}

type BookingConfirmation = {
  appointmentId: string
  subtotal: number
  tax: number
  total: number
  paymentMethod: 'card' | 'wallet'
  technicianName?: string
  eta?: string
}

type CarRepairState = {
  location: LocationInfo | null
  vehicle: VehicleInfo | null
  service: ServiceSelection | null
  schedule: ScheduleDetails | null
  confirmation: BookingConfirmation | null
  setLocation: (value: LocationInfo) => void
  setVehicle: (value: VehicleInfo) => void
  setService: (value: ServiceSelection) => void
  setSchedule: (value: ScheduleDetails) => void
  setConfirmation: (value: BookingConfirmation | null) => void
  reset: () => void
}

const CarRepairContext = createContext<CarRepairState | undefined>(undefined)

export function CarRepairProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationInfo | null>(null)
  const [vehicle, setVehicleState] = useState<VehicleInfo | null>(null)
  const [service, setServiceState] = useState<ServiceSelection | null>(null)
  const [schedule, setScheduleState] = useState<ScheduleDetails | null>(null)
  const [confirmation, setConfirmationState] = useState<BookingConfirmation | null>(null)

  const value = useMemo<CarRepairState>(
    () => ({
      location,
      vehicle,
      service,
      schedule,
      confirmation,
      setLocation: setLocationState,
      setVehicle: setVehicleState,
      setService: setServiceState,
      setSchedule: setScheduleState,
      setConfirmation: setConfirmationState,
      reset: () => {
        setLocationState(null)
        setVehicleState(null)
        setServiceState(null)
        setScheduleState(null)
        setConfirmationState(null)
      },
    }),
    [location, vehicle, service, schedule, confirmation]
  )

  return <CarRepairContext.Provider value={value}>{children}</CarRepairContext.Provider>
}

export function useCarRepair() {
  const context = useContext(CarRepairContext)
  if (!context) {
    throw new Error('useCarRepair must be used within a CarRepairProvider')
  }
  return context
}

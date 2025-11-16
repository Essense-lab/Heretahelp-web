'use client'

import { useState, useEffect } from 'react'
import { useCarRepair } from '../car-repair-context'
import { createSupabaseClient } from '@/lib/supabase'
import { BookingReceiptRepository } from '@/lib/repositories/booking-receipt-repository'
import { BookingServiceRepository } from '@/lib/repositories/booking-service-repository'

type Props = {
  onBack: () => void
  onNext: () => void
}

const HEADLINE_MAP = {
  car: 'Car Repair Request',
  tire: 'Tire Service Request',
  wash: 'Mobile Wash Request',
} as const

export function CheckoutStep({ onBack, onNext }: Props) {
  const { location, vehicle, service, schedule } = useCarRepair()

  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  })
  const [loadingCustomer, setLoadingCustomer] = useState(true)

  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiration, setExpiration] = useState('')
  const [cvv, setCvv] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentSuccessDialog, setShowPaymentSuccessDialog] = useState(false)
  const [showPaymentFailedDialog, setShowPaymentFailedDialog] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState('')

  // Form validation
  const isFormValid = cardNumber.length === 16 &&
                     cardholderName.trim() !== '' &&
                     expiration.length === 4 &&
                     cvv.length >= 3 && cvv.length <= 4 &&
                     agreedToTerms

  // Process payment
  const handleConfirmBooking = async () => {
    if (!isFormValid) return

    setIsProcessing(true)

    // Simulate payment processing (replace with actual API call)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // For demo purposes, simulate success (in real app, check actual payment result)
      const paymentSuccessful = true

      if (paymentSuccessful) {
        // Generate confirmation number
        setConfirmationNumber(`BK${Date.now().toString().slice(-8)}`)

        // Save booking data to database
        const supabase = createSupabaseClient()
        const bookingService = new BookingServiceRepository(supabase)
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        console.log('🔍 Auth check:', { user: user?.id, error: authError })

        if (authError) {
          console.error('❌ Authentication error:', authError)
          throw new Error('User not authenticated')
        }

        if (!user) {
          console.error('❌ No user found')
          throw new Error('User not authenticated')
        }

        if (user && service && location && vehicle) {
          await bookingService.createBooking({
            userId: user.id,
            serviceName: service.title,
            appointmentDate: schedule?.date,
            timeSlot: schedule?.timeSlot,
            serviceAddress: location.streetAddress,
            serviceCity: location.city,
            serviceState: location.state,
            serviceZipCode: location.zipCode,
            vehicleYear: vehicle.year,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
            vehicleEngine: vehicle.engineSize,
            vehicleVin: vehicle.vin,
            technicianName: schedule?.technicianName,
            technicianPhotoUrl: schedule?.technicianPhotoUrl,
            estimatedPrice: subtotal,
            finalPrice: total,
            status: 'CONFIRMED',
            confirmationNumber: confirmationNumber,
            paymentMethod: `Credit Card (****${cardNumber.slice(-4)})`,
            notes: schedule?.notes,
          })
        }

        // Send booking receipt via email and SMS
        const receiptRepo = new BookingReceiptRepository()

        const vehicleInfoStr = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle not specified'
        const paymentMethodStr = `Credit Card (****${cardNumber.slice(-4)})`

        await receiptRepo.sendBookingReceipt({
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerName: customerInfo.name,
          appointmentId: confirmationNumber,
          serviceName: service?.title || 'Service',
          serviceCategory: service?.category || 'Car Repair',
          appointmentDate: schedule?.date || 'To be scheduled',
          timeSlot: schedule?.timeSlot || 'To be scheduled',
          serviceAddress: location?.streetAddress || 'Address not specified',
          vehicleInfo: vehicleInfoStr,
          totalAmount: total,
          paymentMethod: paymentMethodStr,
          confirmationNumber: confirmationNumber,
        })

        setShowPaymentSuccessDialog(true)
      } else {
        setShowPaymentFailedDialog(true)
      }
    } catch (error) {
      setShowPaymentFailedDialog(true)
    } finally {
      setIsProcessing(false)
    }
  }

  // Fetch customer information
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const supabase = createSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone_number, email')
          .eq('id', user.id)
          .single()

        if (profile) {
          setCustomerInfo({
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Customer',
            phone: profile.phone_number || '',
            email: profile.email || user.email || '',
          })
        }
      } catch (error) {
        console.error('Failed to load customer info:', error)
        // Fallback to empty data
        setCustomerInfo({
          name: 'Customer',
          phone: '',
          email: '',
        })
      } finally {
        setLoadingCustomer(false)
      }
    }

    fetchCustomerInfo()
  }, [])

  if (!location || !vehicle || !service) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
        Missing request details. Please go back and complete each step.
      </div>
    )
  }

  const serviceType = 'car' as const
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
        </div>
      </div>

      <section className="space-y-4">
        <SummaryCard title="Customer Information" emoji="👤">
          {loadingCustomer ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0D1B2A]/30 border-t-[#0D1B2A]" />
            </div>
          ) : (
            <div className="space-y-1 text-sm text-gray-700">
              <p>Name: {customerInfo.name}</p>
              <p>Phone: {customerInfo.phone || 'Not provided'}</p>
              <p>Email: {customerInfo.email}</p>
            </div>
          )}
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
          </ul>

          <div className="mt-3 rounded-xl bg-[#0D1B2A]/5 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#0D1B2A]">
                {service.title}
              </span>
              <span className="text-xs text-gray-600">
                {service.action === 'schedule' ? 'Schedule service now' : 'Post to Repair Board'}
              </span>
            </div>
          </div>

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
        </SummaryCard>
      </section>

      {/* Amount Due Card - Separate prominent card */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6">
        <div className="text-center">
          <p className="text-2xl mb-2">💰</p>
          <h3 className="text-xl font-semibold text-[#0D1B2A] mb-2">Amount Due</h3>
          <p className="text-4xl font-bold text-green-600 mb-2">${total.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            Labor: ${service.laborCost.toFixed(2)} | Parts: ${service.partsCost.toFixed(2)} | Tax: ${tax.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment Information Card */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#0D1B2A] mb-4">💳 Payment Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="1234567890123456"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="text"
                value={expiration}
                onChange={(e) => setExpiration(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MMYY"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#0D1B2A] focus:outline-none"
              />
            </div>
          </div>
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔒</span>
              <span className="text-sm text-green-800">Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 text-[#0D1B2A] focus:ring-[#0D1B2A]"
          />
          <span className="text-sm text-gray-700">
            I agree to the Terms of Service and Privacy Policy
          </span>
        </div>
      </div>

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
          onClick={handleConfirmBooking}
          disabled={!isFormValid || isProcessing}
          className={`rounded-xl px-5 py-3 text-sm font-semibold transition flex items-center justify-center gap-2 ${
            isFormValid && !isProcessing
              ? 'bg-[#0D1B2A] hover:bg-[#0A1625] text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className="text-lg">✅</span>
              <span>Confirm Booking</span>
            </>
          )}
        </button>
      </div>

      {/* Payment Success Dialog */}
      {showPaymentSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">✅</div>
              <h2 className="text-xl font-bold text-green-600">Payment Confirmed</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p className="text-sm leading-relaxed">
                Thank you for your purchase! By completing this payment, you acknowledge and agree to our Terms of Service and Privacy Policy.
              </p>
              <p className="text-xs text-gray-500 italic">
                A receipt has been sent to your email.
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setShowPaymentSuccessDialog(false)
                  // In real app, navigate to confirmation page
                  onNext()
                }}
                className="px-6 py-2 bg-[#0D1B2A] text-white rounded-xl font-semibold hover:bg-[#0A1625]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Failed Dialog */}
      {showPaymentFailedDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">❌</div>
              <h2 className="text-xl font-bold text-red-600">Payment Unsuccessful</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your payment could not be processed at this time. Please check your card details or try another payment method.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowPaymentFailedDialog(false)}
                className="px-6 py-2 bg-[#0D1B2A] text-white rounded-xl font-semibold hover:bg-[#0A1625]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
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

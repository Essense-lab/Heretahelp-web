import { BaseRepository } from './base-repository'
import { createSupabaseClient } from '@/lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

interface BookingData {
  userId: string
  serviceName: string
  appointmentDate?: string
  timeSlot?: string
  serviceAddress: string
  serviceCity?: string
  serviceState?: string
  serviceZipCode?: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleEngine?: string
  vehicleVin?: string
  technicianName?: string
  technicianPhotoUrl?: string
  estimatedPrice: number
  finalPrice: number
  status: string
  confirmationNumber: string
  paymentMethod: string
  notes?: string
}

export class BookingServiceRepository extends BaseRepository {
  constructor(private client?: SupabaseClient) {
    super()
    if (client) {
      this.supabase = client
    }
  }
  async createBooking(bookingData: BookingData): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('service_appointments')
        .insert({
          user_id: bookingData.userId,
          service_name: bookingData.serviceName,
          appointment_date: bookingData.appointmentDate || null,
          time_slot: bookingData.timeSlot || null,
          service_address: bookingData.serviceAddress,
          service_city: bookingData.serviceCity || null,
          service_state: bookingData.serviceState || null,
          service_zip_code: bookingData.serviceZipCode || null,
          vehicle_year: bookingData.vehicleYear,
          vehicle_make: bookingData.vehicleMake,
          vehicle_model: bookingData.vehicleModel,
          vehicle_engine: bookingData.vehicleEngine || null,
          vehicle_vin: bookingData.vehicleVin || null,
          technician_name: bookingData.technicianName || null,
          technician_photo_url: bookingData.technicianPhotoUrl || null,
          estimated_price: bookingData.estimatedPrice,
          final_price: bookingData.finalPrice,
          status: bookingData.status,
          confirmation_number: bookingData.confirmationNumber,
          payment_method: bookingData.paymentMethod,
          notes: bookingData.notes || null,
        } as never)
        .select('id')
        .single()

      if (error) throw error

      console.log('✅ Booking created successfully:', data.id)
      return data.id
    } catch (error) {
      console.error('❌ Failed to create booking:', error)
      throw error
    }
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('service_appointments')
        .update({
          status: status,
          updated_at: this.formatTimestamp(),
        } as never)
        .eq('id', bookingId)

      if (error) throw error

      console.log('✅ Booking status updated:', bookingId, status)
    } catch (error) {
      console.error('❌ Failed to update booking status:', error)
      throw error
    }
  }
}

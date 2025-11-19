import { BaseRepository } from './base-repository'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface CarRepairAppointmentPayload {
  userId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  serviceId: string
  serviceName: string
  serviceCategory: string
  serviceSubcategory: string
  serviceSpecification?: string | null
  serviceAddress: string
  serviceCity: string
  serviceState: string
  serviceZipCode: string
  serviceCrossStreet?: string | null
  serviceLatitude?: number | null
  serviceLongitude?: number | null
  appointmentDate: string
  timeSlot: string
  timeSlotStart: string
  timeSlotEnd: string
  status?: string
  technicianId?: string | null
  technicianName?: string | null
  technicianPhotoUrl?: string | null
  technicianSpecialty?: string | null
  technicianRating?: number | null
  vehicleId?: string | null
  vehicleYear: number
  vehicleMake: string
  vehicleModel: string
  vehicleEngine: string
  vehicleVin?: string | null
  vehicleMileage?: number | null
  vehicleTrim?: string | null
  vehicleFuelType?: string | null
  vehicleTransmission?: string | null
  vehicleDriveType?: string | null
  vehicleBodyStyle?: string | null
  vehicleDoors?: string | null
  partsCost?: number | null
  laborCost?: number | null
  estimatedPrice?: number | null
  finalPrice?: number | null
  redeemedRewardId?: string | null
  discountApplied?: number | null
  customerNotes?: string | null
  specialRequests?: string | null
}

export class BookingServiceRepository extends BaseRepository {
  constructor(client?: SupabaseClient) {
    super(client)
  }

  async createBooking(payload: CarRepairAppointmentPayload): Promise<string> {
    try {
      const insertPayload = {
        user_id: payload.userId,
        customer_name: payload.customerName,
        customer_phone: payload.customerPhone,
        customer_email: payload.customerEmail,
        service_id: payload.serviceId,
        service_name: payload.serviceName,
        service_category: payload.serviceCategory,
        service_subcategory: payload.serviceSubcategory,
        service_specification: payload.serviceSpecification ?? null,
        service_address: payload.serviceAddress,
        service_city: payload.serviceCity,
        service_state: payload.serviceState,
        service_zip_code: payload.serviceZipCode,
        service_cross_street: payload.serviceCrossStreet ?? null,
        service_latitude: payload.serviceLatitude ?? null,
        service_longitude: payload.serviceLongitude ?? null,
        appointment_date: payload.appointmentDate,
        time_slot: payload.timeSlot,
        time_slot_start: payload.timeSlotStart,
        time_slot_end: payload.timeSlotEnd,
        status: payload.status ?? 'SCHEDULED',
        technician_id: payload.technicianId ?? null,
        technician_name: payload.technicianName ?? null,
        technician_photo_url: payload.technicianPhotoUrl ?? null,
        technician_specialty: payload.technicianSpecialty ?? null,
        technician_rating: payload.technicianRating ?? null,
        vehicle_id: payload.vehicleId ?? null,
        vehicle_year: payload.vehicleYear,
        vehicle_make: payload.vehicleMake,
        vehicle_model: payload.vehicleModel,
        vehicle_engine: payload.vehicleEngine,
        vehicle_vin: payload.vehicleVin ?? null,
        vehicle_mileage: payload.vehicleMileage ?? null,
        vehicle_trim: payload.vehicleTrim ?? null,
        vehicle_fuel_type: payload.vehicleFuelType ?? null,
        vehicle_transmission: payload.vehicleTransmission ?? null,
        vehicle_drive_type: payload.vehicleDriveType ?? null,
        vehicle_body_style: payload.vehicleBodyStyle ?? null,
        vehicle_doors: payload.vehicleDoors ?? null,
        parts_cost: payload.partsCost ?? null,
        labor_cost: payload.laborCost ?? null,
        estimated_price: payload.estimatedPrice ?? null,
        final_price: payload.finalPrice ?? null,
        redeemed_reward_id: payload.redeemedRewardId ?? null,
        discount_applied: payload.discountApplied ?? null,
        customer_notes: payload.customerNotes ?? null,
        special_requests: payload.specialRequests ?? null,
      } as const

      const { data, error } = await this.supabase
        .from('service_appointments')
        .insert(insertPayload as never)
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

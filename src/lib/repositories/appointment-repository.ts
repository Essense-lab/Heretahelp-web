import type { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './base-repository'
import { AvailabilityRepository, type TechnicianRecord } from './availability-repository'
import { ReassignmentRepository } from './reassignment-repository'

type ServiceAppointmentRecord = {
  id: string
  appointment_date?: string | null
  time_slot?: string | null
  service_latitude?: number | null
  service_longitude?: number | null
  service_category?: string | null
  technician_id?: string | null
  technician_name?: string | null
  status?: string | null
}

interface DeclineAppointmentOptions {
  appointmentId: string
  technicianId: string
  technicianName?: string | null
  declineReason?: string | null
}

export type ReassignmentCandidate = Pick<TechnicianRecord, 'id' | 'name' | 'rating' | 'photoUrl' | 'specialty'>

export class AppointmentRepository extends BaseRepository {
  constructor(client?: SupabaseClient) {
    super(client)
  }

  private async fetchAppointment(appointmentId: string): Promise<ServiceAppointmentRecord> {
    const { data, error } = await this.supabase
      .from('service_appointments')
      .select('id,appointment_date,time_slot,service_latitude,service_longitude,service_category,technician_id,technician_name,status')
      .eq('id', appointmentId)
      .single()

    if (error) {
      if ((error as any).code === 'PGRST116') {
        throw new Error('Appointment not found')
      }
      throw error
    }

    return data as ServiceAppointmentRecord
  }

  async declineAppointment(options: DeclineAppointmentOptions): Promise<{ reassignmentId: string | null; candidates: ReassignmentCandidate[] }> {
    try {
      const appointment = await this.fetchAppointment(options.appointmentId)
      const reassignmentRepo = new ReassignmentRepository(this.supabase)
      const availabilityRepo = new AvailabilityRepository(this.supabase)

      const reassignment = await reassignmentRepo.createReassignment({
        appointmentId: options.appointmentId,
        originalTechnicianId: options.technicianId,
        originalTechnicianName: options.technicianName ?? appointment.technician_name ?? 'Technician',
        declineReason: options.declineReason,
      })

      const previousTechName = options.technicianName ?? appointment.technician_name ?? 'Technician'

      const { error: updateError } = await this.supabase
        .from('service_appointments')
        .update({
          status: 'REASSIGNING',
          reassignment_status: 'PENDING',
          reassignment_id: reassignment.id,
          previous_technician_id: options.technicianId,
          previous_technician_name: previousTechName,
          decline_reason: options.declineReason ?? null,
        } as never)
        .eq('id', options.appointmentId)

      if (updateError) throw updateError

      const candidates = await this.findReplacementCandidates(availabilityRepo, appointment, options.technicianId)

      if (candidates.length) {
        await reassignmentRepo.markCandidatesNotified(
          reassignment.id,
          candidates.map((candidate) => candidate.id)
        )
      }

      return {
        reassignmentId: reassignment.id,
        candidates,
      }
    } catch (error) {
      this.handleError(error, 'decline appointment')
    }
  }

  async cancelAppointment(options: {
    appointmentId: string
    cancelledBy: string
    reason?: string | null
    cancellationFee?: number
  }): Promise<void> {
    try {
      const payload = {
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString(),
        cancelled_by: options.cancelledBy,
        cancellation_reason: options.reason ?? 'Cancelled by customer',
        cancellation_fee: options.cancellationFee ?? 25,
      }

      const { error } = await this.supabase
        .from('service_appointments')
        .update(payload as never)
        .eq('id', options.appointmentId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'cancel appointment')
    }
  }

  async rescheduleAppointment(options: {
    appointmentId: string
    userId: string
    rescheduleFee?: number
  }): Promise<{ creditAmount: number }> {
    try {
      const { data, error } = await this.supabase
        .from('service_appointments')
        .select('final_price, estimated_price')
        .eq('id', options.appointmentId)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Appointment not found')

      const originalPrice =
        typeof data.final_price === 'number'
          ? data.final_price
          : typeof data.estimated_price === 'number'
          ? data.estimated_price
          : 0
      const fee = options.rescheduleFee ?? 25
      const creditAmount = Math.max(originalPrice - fee, 0)

      const payload = {
        status: 'CANCELLED',
        cancelled_at: new Date().toISOString(),
        cancelled_by: options.userId,
        cancellation_reason: 'Rescheduled by customer',
        reschedule_fee: fee,
      }

      const { error: updateError } = await this.supabase
        .from('service_appointments')
        .update(payload as never)
        .eq('id', options.appointmentId)

      if (updateError) throw updateError

      return { creditAmount }
    } catch (error) {
      this.handleError(error, 'reschedule appointment')
    }
  }

  private async findReplacementCandidates(
    availabilityRepo: AvailabilityRepository,
    appointment: ServiceAppointmentRecord,
    excludedTechnicianId: string
  ): Promise<ReassignmentCandidate[]> {
    if (!appointment.appointment_date || !appointment.time_slot) return []

    try {
      const technicians = await availabilityRepo.fetchTechnicians(appointment.appointment_date, appointment.time_slot)
      return technicians
        .filter((technician) => technician.id && technician.id !== excludedTechnicianId)
        .slice(0, 3)
        .map((technician) => ({
          id: technician.id,
          name: technician.name,
          rating: technician.rating,
          photoUrl: technician.photoUrl,
          specialty: technician.specialty,
        }))
    } catch (error) {
      console.warn('Unable to load replacement technicians:', error)
      return []
    }
  }
}

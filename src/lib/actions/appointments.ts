import { AppointmentRepository } from '@/lib/repositories/appointment-repository'
import { createSupabaseClient } from '@/lib/supabase'

export async function declineAppointment(appointmentId: string, technicianId: string, technicianName?: string, declineReason?: string) {
  const supabase = createSupabaseClient()
  const repository = new AppointmentRepository(supabase)
  return repository.declineAppointment({
    appointmentId,
    technicianId,
    technicianName,
    declineReason,
  })
}

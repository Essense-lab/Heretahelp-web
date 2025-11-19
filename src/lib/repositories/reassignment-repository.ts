import type { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './base-repository'

export interface ReassignmentRecord {
  id: string
  appointment_id: string
  original_technician_id: string
  original_technician_name: string
  decline_reason?: string | null
  status?: string | null
}

interface CreateReassignmentOptions {
  appointmentId: string
  originalTechnicianId: string
  originalTechnicianName: string
  declineReason?: string | null
}

export class ReassignmentRepository extends BaseRepository {
  constructor(client?: SupabaseClient) {
    super(client)
  }

  async createReassignment(options: CreateReassignmentOptions): Promise<ReassignmentRecord> {
    try {
      const payload = {
        appointment_id: options.appointmentId,
        original_technician_id: options.originalTechnicianId,
        original_technician_name: options.originalTechnicianName,
        decline_reason: options.declineReason ?? null,
      }

      const { data, error } = await this.supabase
        .from('appointment_reassignments')
        .insert(payload as never)
        .select('*')
        .single()

      if (error) throw error
      return data as ReassignmentRecord
    } catch (error) {
      this.handleError(error, 'create reassignment record')
    }
  }

  async markCandidatesNotified(reassignmentId: string, technicianIds: string[]): Promise<void> {
    if (!technicianIds.length) return

    try {
      const { error } = await this.supabase
        .from('appointment_reassignments')
        .update({
          notification_sent_to: technicianIds,
          notification_sent_at: new Date().toISOString(),
        } as never)
        .eq('id', reassignmentId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'mark reassignment candidates notified')
    }
  }
}

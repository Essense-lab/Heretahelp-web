import type { SupabaseClient } from '@supabase/supabase-js'
import { BaseRepository } from './base-repository'

export type TimeSlotRecord = {
  value: string
  label: string
  available: boolean
}

export type TechnicianRecord = {
  id: string
  name: string
  rating: number
  reviewCount: number
  specialty: string
  photoUrl?: string
  availabilityLabel?: string
}

type AvailableDateRow = {
  date?: string | null
}

type TimeSlotRow = {
  time_slot?: string | null
  current_bookings?: number | null
  max_bookings?: number | null
}

type TechnicianAvailabilityRow = {
  technician_id?: string | null
  technician_name?: string | null
  photo_url?: string | null
  current_bookings?: number | null
  max_bookings?: number | null
}

type TechnicianProfileRow = {
  id?: string | null
  name?: string | null
  rating?: number | null
  review_count?: number | null
  specialty?: string | null
  photo_url?: string | null
}

export class AvailabilityRepository extends BaseRepository {
  constructor(client?: SupabaseClient) {
    super(client)
  }

  async fetchAvailableDates(limit = 60): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('available_dates')
        .select('date')
        .order('date', { ascending: true })
        .limit(limit)

      if (error) {
        throw error
      }

      const rows: AvailableDateRow[] = data ?? []
      return rows
        .map((row) => row.date)
        .filter((value): value is string => Boolean(value))
    } catch (error) {
      console.error('Failed to load available dates', error)
      return []
    }
  }

  async fetchTimeSlots(date: string): Promise<TimeSlotRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('technician_availability')
        .select('time_slot,current_bookings,max_bookings')
        .eq('date', date)
        .eq('is_available', true)

      if (error) {
        throw error
      }

      const rows: TimeSlotRow[] = data ?? []
      const slotMap = new Map<string, { available: boolean }>()

      rows.forEach((row) => {
        const value = row.time_slot?.trim()
        if (!value) return

        const max = row.max_bookings ?? 0
        const current = row.current_bookings ?? 0
        const remaining = max === 0 ? Number.POSITIVE_INFINITY : max - current
        const isAvailable = remaining > 0

        const existing = slotMap.get(value)
        if (existing) {
          slotMap.set(value, { available: existing.available || isAvailable })
        } else {
          slotMap.set(value, { available: isAvailable })
        }
      })

      return Array.from(slotMap.entries())
        .sort(([a], [b]) => this.sortTimeSlots(a, b))
        .map(([value, meta]) => ({
          value,
          label: this.formatTimeSlotLabel(value),
          available: meta.available,
        }))
    } catch (error) {
      console.error('Failed to load available time slots', error)
      return []
    }
  }

  async fetchTechnicians(date: string, timeSlot: string): Promise<TechnicianRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('technician_availability')
        .select('technician_id,technician_name,photo_url,current_bookings,max_bookings')
        .eq('date', date)
        .eq('time_slot', timeSlot)
        .eq('is_available', true)

      if (error) {
        throw error
      }

      const rows: TechnicianAvailabilityRow[] = data ?? []
      const filtered = rows.filter((row) => {
        const max = row.max_bookings ?? 0
        const current = row.current_bookings ?? 0
        return max === 0 || current < max
      })

      const technicianIds = filtered
        .map((row) => row.technician_id)
        .filter((value): value is string => Boolean(value))

      const profileMap = await this.fetchTechnicianProfiles(technicianIds)

      return filtered
        .map((row) => {
          const profile = row.technician_id ? profileMap[row.technician_id] : undefined
          const max = row.max_bookings ?? 0
          const current = row.current_bookings ?? 0
          const remaining = max === 0 ? undefined : Math.max(max - current, 0)

          return {
            id: row.technician_id ?? '',
            name: row.technician_name ?? profile?.name ?? 'Technician',
            rating: profile?.rating ?? 4.8,
            reviewCount: profile?.review_count ?? 0,
            specialty: profile?.specialty ?? 'All Services',
            photoUrl: row.photo_url ?? profile?.photo_url ?? undefined,
            availabilityLabel:
              remaining === undefined
                ? undefined
                : remaining > 1
                  ? `${remaining} slots available`
                  : remaining === 1
                    ? '1 slot left'
                    : 'Fully booked',
          } satisfies TechnicianRecord
        })
        .filter((technician) => technician.id || technician.name.trim().length > 0)
        .sort((a, b) => b.rating - a.rating)
    } catch (error) {
      console.error('Failed to load technicians', error)
      return []
    }
  }

  private async fetchTechnicianProfiles(ids: string[]): Promise<Record<string, TechnicianProfileRow>> {
    if (!ids.length) return {}

    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('id,name,rating,review_count,specialty,photo_url')
        .in('id', Array.from(new Set(ids)))

      if (error) {
        throw error
      }

      const rows: TechnicianProfileRow[] = data ?? []
      return rows.reduce<Record<string, TechnicianProfileRow>>((acc, row) => {
        if (row.id) {
          acc[row.id] = row
        }
        return acc
      }, {})
    } catch (error) {
      console.error('Failed to load technician profiles', error)
      return {}
    }
  }

  private formatTimeSlotLabel(value: string): string {
    return value.replace('-', '–')
  }

  private sortTimeSlots(a: string, b: string): number {
    const toMinutes = (input: string) => {
      const firstPart = input.split(/[–-]/)[0]?.trim() ?? input
      const match = firstPart.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i)
      if (!match) return Number.MAX_SAFE_INTEGER
      let hours = Number(match[1]) % 12
      const minutes = match[2] ? Number(match[2]) : 0
      const meridiem = match[3]?.toUpperCase() === 'PM' ? 12 : 0
      return hours * 60 + minutes + meridiem * 60
    }

    return toMinutes(a) - toMinutes(b)
  }
}

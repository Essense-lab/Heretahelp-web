import { createSupabaseClient } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

export class BaseRepository {
  protected supabase = createSupabaseClient()

  protected handleError(error: any, operation: string): never {
    console.error(`Error in ${operation}:`, error)
    throw new Error(error.message || `Failed to ${operation}`)
  }

  protected async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    if (error) throw error
    if (!user) throw new Error('User not authenticated')
    return user
  }

  protected formatTimestamp(): string {
    return new Date().toISOString()
  }

  protected generateId(): string {
    return crypto.randomUUID()
  }
}

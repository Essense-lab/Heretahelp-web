import { BaseRepository } from './base-repository'

export type DiscountValidationResult = {
  isValid: boolean
  discountId?: string | null
  discountAmount: number
  message?: string | null
}

export class DiscountService extends BaseRepository {
  async validateDiscount(code: string, userId: string, orderAmount: number): Promise<DiscountValidationResult> {
    const { data, error } = await this.supabase.rpc('validate_discount', {
      p_code: code,
      p_user_id: userId,
      p_order_amount: orderAmount,
    })

    if (error) {
      console.warn('Failed to validate discount', error)
      return {
        isValid: false,
        discountId: null,
        discountAmount: 0,
        message: error.message ?? 'Unable to validate code at this time.',
      }
    }

    const payload = Array.isArray(data) && data.length > 0 ? data[0] : null

    if (!payload) {
      return {
        isValid: false,
        discountId: null,
        discountAmount: 0,
        message: 'Discount code not found.',
      }
    }

    return {
      isValid: Boolean(payload.is_valid),
      discountId: payload.discount_id,
      discountAmount: typeof payload.discount_amount === 'number' ? payload.discount_amount : Number(payload.discount_amount ?? 0),
      message: payload.message ?? null,
    }
  }

  async recordDiscountUsage(params: {
    discountId: string
    userId: string
    postId: string
    discountAmount: number
    originalAmount: number
    finalAmount: number
  }): Promise<boolean> {
    const { error } = await this.supabase.rpc('record_discount_usage', {
      p_discount_id: params.discountId,
      p_user_id: params.userId,
      p_post_id: params.postId,
      p_discount_amount: params.discountAmount,
      p_original_amount: params.originalAmount,
      p_final_amount: params.finalAmount,
    })

    if (error) {
      console.warn('Failed to record discount usage', error)
      return false
    }

    return true
  }
}

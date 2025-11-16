import { BaseRepository } from './base-repository'

export type BidBasedPricingConfig = {
  id: string
  taxRate: number
  postingFee: number
  serviceFee: number
  platformFeeRate: number
}

export type FixedPriceConfig = {
  id: string
  taxRate: number
  postingFee: number
  serviceFee: number
  platformFeeRate: number
}

const mapBidConfig = (row: any): BidBasedPricingConfig => ({
  id: row?.id ?? 'default',
  taxRate: toNumber(row?.tax_rate),
  postingFee: toNumber(row?.posting_fee),
  serviceFee: toNumber(row?.service_fee),
  platformFeeRate: toNumber(row?.platform_fee_rate),
})

const mapFixedConfig = (row: any): FixedPriceConfig => ({
  id: row?.id ?? 'default',
  taxRate: toNumber(row?.tax_rate),
  postingFee: toNumber(row?.posting_fee),
  serviceFee: toNumber(row?.service_fee),
  platformFeeRate: toNumber(row?.platform_fee_rate),
})

const DEFAULT_BID_CONFIG: BidBasedPricingConfig = {
  id: 'default',
  taxRate: 0,
  postingFee: 0,
  serviceFee: 0,
  platformFeeRate: 0,
}

const DEFAULT_FIXED_CONFIG: FixedPriceConfig = {
  id: 'default',
  taxRate: 0,
  postingFee: 0,
  serviceFee: 0,
  platformFeeRate: 0,
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

export class PricingConfigRepository extends BaseRepository {
  async fetchActiveBidBasedConfig(): Promise<BidBasedPricingConfig> {
    const { data, error } = await this.supabase
      .from('bid_based_pricing')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.warn('Failed to load bid-based pricing config', error)
      return DEFAULT_BID_CONFIG
    }

    if (!data) return DEFAULT_BID_CONFIG
    return mapBidConfig(data)
  }

  async fetchActiveFixedConfig(): Promise<FixedPriceConfig> {
    const { data, error } = await this.supabase
      .from('fixed_price')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.warn('Failed to load fixed pricing config', error)
      return DEFAULT_FIXED_CONFIG
    }

    if (!data) return DEFAULT_FIXED_CONFIG
    return mapFixedConfig(data)
  }
}

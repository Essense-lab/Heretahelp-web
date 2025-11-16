import { BaseRepository } from './base-repository'

export type ServicePricingOption = {
  id: string
  optionName: string
  percentageValue: number
}

const mapOption = (row: any): ServicePricingOption | null => {
  if (!row) return null
  return {
    id: row.id ?? 'unknown',
    optionName: row.option_name ?? '',
    percentageValue: typeof row.percentage_value === 'number' ? row.percentage_value : Number(row.percentage_value ?? 0),
  }
}

export class ServicePricingOptionsRepository extends BaseRepository {
  async fetchAcceptBidsMinimumPercentage(): Promise<number> {
    const option = await this.fetchOptionByName('accept_bids_minimum_percentage')
    return option?.percentageValue ?? 10
  }

  async fetchFixedPricePercentage(): Promise<number> {
    const option = await this.fetchOptionByName('fixed_price_percentage')
    return option?.percentageValue ?? 100
  }

  private async fetchOptionByName(optionName: string): Promise<ServicePricingOption | null> {
    const { data, error } = await this.supabase
      .rpc('get_pricing_option_by_name', { p_option_name: optionName })

    if (error) {
      console.warn(`Failed to load pricing option ${optionName}`, error)
      return null
    }

    if (!Array.isArray(data) || data.length === 0) return null
    return mapOption(data[0])
  }
}

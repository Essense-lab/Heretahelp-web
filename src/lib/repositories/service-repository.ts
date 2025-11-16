import { BaseRepository } from './base-repository'
import {
  SERVICE_CATEGORIES,
  type RepairServiceCategory,
  type RepairServiceSpecification,
  type RepairServiceSubcategory,
} from '@/app/dashboard/car-repair/data'

const DEFAULT_LABOR_RATE = 67

type PricingSnapshot = {
  baseTimeHours?: number
  baseLaborRate?: number
  basePartsCost?: number
  estimatedTime?: string
  priceRange?: string
}

const FALLBACK_SUBCATEGORY_PRICING = new Map<string, PricingSnapshot>()
const FALLBACK_SPECIFICATION_PRICING = new Map<string, PricingSnapshot>()

const canonicalize = (value?: string | null) =>
  value ? value.trim().toLowerCase().replace(/[^a-z0-9]/g, '') : ''

const snapshotKey = (id?: string | null, name?: string | null) => {
  const normalizedId = canonicalize(id)
  if (normalizedId) return normalizedId

  const normalizedName = canonicalize(name)
  if (normalizedName) return normalizedName

  return ''
}

const setSnapshot = (map: Map<string, PricingSnapshot>, id?: string | null, name?: string | null, snapshot?: PricingSnapshot) => {
  if (!snapshot) return
  const keyFromId = canonicalize(id)
  const keyFromName = canonicalize(name)

  if (keyFromId) map.set(keyFromId, snapshot)
  if (keyFromName) map.set(keyFromName, snapshot)
}

for (const category of SERVICE_CATEGORIES) {
  for (const subcategory of category.subcategories) {
    const snapshot: PricingSnapshot = {
      baseTimeHours: subcategory.baseTimeHours,
      baseLaborRate: subcategory.baseLaborRate,
      basePartsCost: subcategory.basePartsCost,
      estimatedTime: subcategory.estimatedTime,
      priceRange: subcategory.priceRange,
    }

    setSnapshot(FALLBACK_SUBCATEGORY_PRICING, subcategory.id, subcategory.name, snapshot)

    for (const specification of subcategory.specifications) {
      const specSnapshot: PricingSnapshot = {
        baseTimeHours: specification.baseTimeHours,
        baseLaborRate: specification.baseLaborRate,
        basePartsCost: specification.basePartsCost,
        estimatedTime: specification.estimatedTime,
        priceRange: specification.priceRange,
      }

      setSnapshot(
        FALLBACK_SPECIFICATION_PRICING,
        specification.id,
        specification.name,
        specSnapshot
      )
    }
  }
}

const isTruthy = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined

export class ServiceRepository extends BaseRepository {
  async fetchAllServices(): Promise<RepairServiceCategory[]> {
    const [categoryResult, subcategoryResult, specificationResult] = await Promise.all([
      this.supabase
        .from('service_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      this.supabase
        .from('service_subcategories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
      this.supabase
        .from('service_specifications')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true }),
    ])

    const { data: categoryRows, error: categoryError } = categoryResult
    const { data: subcategoryRows, error: subcategoryError } = subcategoryResult
    const { data: specificationRows, error: specificationError } = specificationResult

    if (categoryError) this.handleError(categoryError, 'fetch service categories')
    if (subcategoryError) this.handleError(subcategoryError, 'fetch service subcategories')
    if (specificationError) this.handleError(specificationError, 'fetch service specifications')

    const specificationBySubcategory = new Map<string, RepairServiceSpecification[]>()

    for (const spec of specificationRows ?? []) {
      const mapped = this.mapSpecificationRow(spec)
      if (!mapped) continue
      const existing = specificationBySubcategory.get(spec.subcategory_id) ?? []
      existing.push(mapped)
      specificationBySubcategory.set(spec.subcategory_id, existing)
    }

    const subcategoriesByCategory = new Map<string, RepairServiceSubcategory[]>()

    for (const row of subcategoryRows ?? []) {
      const mapped = this.mapSubcategoryRow(row, specificationBySubcategory.get(row.id) ?? [])
      if (!mapped) continue
      const existing = subcategoriesByCategory.get(row.category_id) ?? []
      existing.push(mapped)
      subcategoriesByCategory.set(row.category_id, existing)
    }

    return (categoryRows ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      emoji: category.emoji ?? '🛠️',
      subcategories: subcategoriesByCategory.get(category.id) ?? [],
    }))
  }

  private mapSubcategoryRow(
    row: any,
    specifications: RepairServiceSpecification[]
  ): RepairServiceSubcategory | null {
    if (!row?.id) return null

    const fallback = FALLBACK_SUBCATEGORY_PRICING.get(snapshotKey(row.id, row.name))

    const baseTimeHours = toNumber(row.base_time_hours) ?? fallback?.baseTimeHours ?? null
    const baseLaborRate =
      toNumber(row.base_labor_rate) ?? fallback?.baseLaborRate ?? DEFAULT_LABOR_RATE
    const basePartsCost =
      toNumber(row.base_parts_cost) ?? fallback?.basePartsCost ?? undefined

    const estimatedTime = normalizeString(row.estimated_time) ?? fallback?.estimatedTime
    const priceRange = normalizeString(row.price_range) ?? fallback?.priceRange

    const subcategory: RepairServiceSubcategory = {
      id: row.id,
      name: row.name ?? 'Service',
      description: row.description ?? '',
      specifications,
    }

    if (baseTimeHours && baseTimeHours > 0) {
      subcategory.baseTimeHours = baseTimeHours
      subcategory.baseLaborRate = baseLaborRate
      subcategory.basePartsCost = basePartsCost ?? 0
    }

    if (estimatedTime) subcategory.estimatedTime = estimatedTime
    if (priceRange) subcategory.priceRange = priceRange

    return subcategory
  }

  private mapSpecificationRow(row: any): RepairServiceSpecification | null {
    if (!row?.id) return null

    const fallback = FALLBACK_SPECIFICATION_PRICING.get(snapshotKey(row.id, row.name))

    const baseTimeHours = toNumber(row.base_time_hours) ?? fallback?.baseTimeHours ?? undefined
    const baseLaborRate = toNumber(row.base_labor_rate) ?? fallback?.baseLaborRate ?? undefined
    const basePartsCost = toNumber(row.base_parts_cost) ?? fallback?.basePartsCost ?? undefined
    const estimatedTime = normalizeString(row.estimated_time) ?? fallback?.estimatedTime
    const priceRange = normalizeString(row.price_range) ?? fallback?.priceRange

    const spec: RepairServiceSpecification = {
      id: row.id,
      name: row.name ?? 'Option',
      description: row.description ?? '',
    }

    if (baseTimeHours && baseTimeHours > 0) spec.baseTimeHours = baseTimeHours
    if (baseLaborRate && baseLaborRate > 0) spec.baseLaborRate = baseLaborRate
    if (isTruthy(basePartsCost)) spec.basePartsCost = basePartsCost
    if (estimatedTime) spec.estimatedTime = estimatedTime
    if (priceRange) spec.priceRange = priceRange

    return spec
  }
}

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

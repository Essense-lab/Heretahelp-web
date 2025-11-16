import { createSupabaseClient } from '@/lib/supabase'

const YEAR_START = 1981
const YEAR_END = new Date().getFullYear() + 1
const YEAR_RANGE = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, idx) => `${YEAR_END - idx}`)

const supabase = createSupabaseClient()

const normalizeString = (value: string | null | undefined) => value?.trim() ?? ''

const unique = (values: (string | null | undefined)[]) => {
  const seen = new Set<string>()
  for (const value of values) {
    if (!value) continue
    const cleaned = value.trim()
    if (!cleaned) continue
    seen.add(cleaned)
  }
  return Array.from(seen)
}

type VehicleAttributeResponse = {
  engine_displacement?: string | number | null
  engine_cylinders?: string | number | null
  fuel_type_primary?: string | null
  transmission_speeds?: string | number | null
  transmission_style?: string | null
  drive_type?: string | null
  body_class?: string | null
  doors?: string | number | null
}

const buildEngineLabel = (displacement: string | number | null, cylinders: string | number | null) => {
  const displacementLabel = displacement ? `${String(displacement).replace(/[^0-9.]/g, '')}L` : null
  const cylindersLabel = cylinders ? `${String(cylinders).replace(/[^0-9]/g, '')}-Cylinder` : null
  if (displacementLabel && cylindersLabel) return `${displacementLabel} ${cylindersLabel}`
  if (displacementLabel) return displacementLabel
  if (cylindersLabel) return cylindersLabel
  return null
}

const buildTransmissionLabel = (style: string | null, speeds: string | number | null) => {
  const styleLabel = normalizeString(style)
  const speedsLabel = speeds ? `${String(speeds).replace(/[^0-9]/g, '')}-Speed` : ''
  if (styleLabel && speedsLabel) return `${styleLabel} ${speedsLabel}`
  if (styleLabel) return styleLabel
  if (speedsLabel) return speedsLabel
  return null
}

export async function fetchYears(): Promise<string[]> {
  try {
    return YEAR_RANGE
  } catch (error) {
    console.error('Failed to build year range', error)
    return YEAR_RANGE
  }
}

export async function fetchMakes(year: number): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('nhtsa_vehicles')
      .select('make_name')
      .eq('year', year)
      .limit(5000)

    if (error) throw error

    return unique((data ?? []).map((record) => normalizeString(record.make_name))).sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.warn('Failed to load makes from Supabase', error)
    return []
  }
}

export async function fetchModels(year: number, make: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('nhtsa_vehicles')
      .select('model_name')
      .eq('year', year)
      .eq('make_name', make)
      .limit(5000)

    if (error) throw error

    return unique((data ?? []).map((record) => normalizeString(record.model_name))).sort((a, b) => a.localeCompare(b))
  } catch (error) {
    console.warn('Failed to load models from Supabase', error)
    return []
  }
}

export async function fetchVehicleAttributes(year: number, make: string, model: string) {
  try {
    const { data, error } = await supabase
      .from('nhtsa_vehicles')
      .select(
        'engine_displacement, engine_cylinders, fuel_type_primary, transmission_style, transmission_speeds, drive_type, body_class, doors'
      )
      .eq('year', year)
      .eq('make_name', make)
      .eq('model_name', model)
      .limit(2000)

    if (error) throw error

    const records = (data ?? []) as VehicleAttributeResponse[]

    const engineOptions = unique(
      records.map((record) =>
        buildEngineLabel(record.engine_displacement ?? null, record.engine_cylinders ?? null)
      )
    )
    const fuelOptions = unique(records.map((record) => normalizeString(record.fuel_type_primary)))
    const transmissionOptions = unique(
      records.map((record) =>
        buildTransmissionLabel(record.transmission_style ?? null, record.transmission_speeds ?? null)
      )
    )
    const driveOptions = unique(records.map((record) => normalizeString(record.drive_type)))
    const bodyStyleOptions = unique(records.map((record) => normalizeString(record.body_class)))
    const doorOptions = unique(records.map((record) => normalizeString(record.doors ? String(record.doors) : null)))

    return {
      engines: engineOptions,
      fuels: fuelOptions,
      transmissions: transmissionOptions,
      drives: driveOptions,
      bodyStyles: bodyStyleOptions,
      doors: doorOptions,
    }
  } catch (error) {
    console.warn('Failed to load vehicle attributes from Supabase', error)
    return {
      engines: [] as string[],
      fuels: [] as string[],
      transmissions: [] as string[],
      drives: [] as string[],
      bodyStyles: [] as string[],
      doors: [] as string[],
    }
  }
}

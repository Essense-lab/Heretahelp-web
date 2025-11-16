'use client'

import { useEffect, useState } from 'react'
import { useCarRepair } from '../car-repair-context'
import {
  BODY_STYLES,
  DOOR_OPTIONS,
  DRIVE_TYPES,
  ENGINE_OPTIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
} from '../data'
import {
  fetchMakes,
  fetchModels,
  fetchVehicleAttributes,
  fetchYears,
} from '../repositories/vehicle-repository'

type Props = {
  onNext: () => void
  onBack: () => void
  serviceType: 'car' | 'tire' | 'wash'
}

type VehicleForm = {
  year: string
  make: string
  model: string
  engineSize: string
  mileage: string
  vin: string
  trim: string
  fuelType: string
  transmission: string
  driveType: string
  bodyStyle: string
  doors: string
  tireSize: string
  color: string
  licensePlate: string
}

const INITIAL_VEHICLE: VehicleForm = {
  year: '',
  make: '',
  model: '',
  engineSize: '',
  mileage: '',
  vin: '',
  trim: '',
  fuelType: '',
  transmission: '',
  driveType: '',
  bodyStyle: '',
  doors: '',
  tireSize: '',
  color: '',
  licensePlate: '',
}

export function VehicleStep({ onNext, onBack, serviceType }: Props) {
  const { vehicle, setVehicle } = useCarRepair()
  const [form, setForm] = useState<VehicleForm>(INITIAL_VEHICLE)
  const [hoveredVin, setHoveredVin] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [yearOptions, setYearOptions] = useState<string[]>([])
  const [makeOptions, setMakeOptions] = useState<string[]>([])
  const [modelOptions, setModelOptions] = useState<string[]>([])
  const [engineOptions, setEngineOptions] = useState<string[]>(ENGINE_OPTIONS)
  const [fuelOptions, setFuelOptions] = useState<string[]>(FUEL_TYPES)
  const [transmissionOptions, setTransmissionOptions] = useState<string[]>(TRANSMISSIONS)
  const [driveOptions, setDriveOptions] = useState<string[]>(DRIVE_TYPES)
  const [bodyStyleOptions, setBodyStyleOptions] = useState<string[]>(BODY_STYLES)
  const [doorOptions, setDoorOptions] = useState<string[]>(DOOR_OPTIONS)

  const [isLoadingMakes, setIsLoadingMakes] = useState(false)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    fetchYears()
      .then((years) => {
        if (!isActive) return
        setYearOptions(years.length ? years : [])
      })
      .catch((error) => {
        console.warn('Failed to load years', error)
        if (!isActive) return
        setYearOptions([])
        setLoadError('Unable to load vehicle year data. Please try again.')
      })
    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!vehicle) return

    setForm({
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      engineSize: vehicle.engineSize ?? '',
      mileage: vehicle.mileage,
      vin: vehicle.vin,
      trim: vehicle.trim ?? '',
      fuelType: vehicle.fuelType ?? '',
      transmission: vehicle.transmission ?? '',
      driveType: vehicle.driveType ?? '',
      bodyStyle: vehicle.bodyStyle ?? '',
      doors: vehicle.doors ?? '',
      tireSize: vehicle.tireSize ?? '',
      color: vehicle.color ?? '',
      licensePlate: vehicle.licensePlate ?? '',
    })
  }, [vehicle])

  useEffect(() => {
    if (!form.year) {
      setMakeOptions([])
      setModelOptions([])
      return
    }

    let isActive = true
    setIsLoadingMakes(true)
    setLoadError(null)

    fetchMakes(Number(form.year))
      .then((makes) => {
        if (!isActive) return
        const options = makes.length ? makes : []
        setMakeOptions(options)
        if (options.length && form.make && !options.includes(form.make)) {
          setForm((prev) => ({ ...prev, make: '', model: '' }))
        }
      })
      .catch((error) => {
        console.warn('Failed to load makes', error)
        if (!isActive) return
        setMakeOptions([])
        setLoadError('Unable to load vehicle makes. Please try again.')
      })
      .finally(() => {
        if (isActive) setIsLoadingMakes(false)
      })

    return () => {
      isActive = false
    }
  }, [form.year])

  useEffect(() => {
    if (!form.year || !form.make) {
      setModelOptions([])
      return
    }

    let isActive = true
    setIsLoadingModels(true)
    setLoadError(null)

    fetchModels(Number(form.year), form.make)
      .then((models) => {
        if (!isActive) return
        const options = models.length ? models : []
        setModelOptions(options)
        if (options.length && form.model && !options.includes(form.model)) {
          setForm((prev) => ({ ...prev, model: '' }))
        }
      })
      .catch((error) => {
        console.warn('Failed to load models', error)
        if (!isActive) return
        setModelOptions([])
        setLoadError('Unable to load vehicle models. Please try again.')
      })
      .finally(() => {
        if (isActive) setIsLoadingModels(false)
      })

    return () => {
      isActive = false
    }
  }, [form.year, form.make])

  useEffect(() => {
    if (!form.year || !form.make || !form.model) {
      setEngineOptions(ENGINE_OPTIONS)
      setFuelOptions(FUEL_TYPES)
      setTransmissionOptions(TRANSMISSIONS)
      setDriveOptions(DRIVE_TYPES)
      setBodyStyleOptions(BODY_STYLES)
      setDoorOptions(DOOR_OPTIONS)
      return
    }

    let isActive = true
    setIsLoadingAttributes(true)
    setLoadError(null)

    fetchVehicleAttributes(Number(form.year), form.make, form.model)
      .then((attributes) => {
        if (!isActive) return

        const withCurrent = (list: string[], current: string, fallback: string[]) => {
          const base = list.length ? list : fallback
          if (current && !base.includes(current)) {
            return [current, ...base]
          }
          return base
        }

        setEngineOptions(withCurrent(attributes.engines, form.engineSize, ENGINE_OPTIONS))
        setFuelOptions(withCurrent(attributes.fuels, form.fuelType, FUEL_TYPES))
        setTransmissionOptions(withCurrent(attributes.transmissions, form.transmission, TRANSMISSIONS))
        setDriveOptions(withCurrent(attributes.drives, form.driveType, DRIVE_TYPES))
        setBodyStyleOptions(withCurrent(attributes.bodyStyles, form.bodyStyle, BODY_STYLES))
        setDoorOptions(withCurrent(attributes.doors, form.doors, DOOR_OPTIONS))
      })
      .catch((error) => {
        console.warn('Failed to load vehicle attributes', error)
        if (!isActive) return
        setEngineOptions(ENGINE_OPTIONS)
        setFuelOptions(FUEL_TYPES)
        setTransmissionOptions(TRANSMISSIONS)
        setDriveOptions(DRIVE_TYPES)
        setBodyStyleOptions(BODY_STYLES)
        setDoorOptions(DOOR_OPTIONS)
        setLoadError('Unable to load detailed vehicle specs. You can still enter them manually.')
      })
      .finally(() => {
        if (isActive) setIsLoadingAttributes(false)
      })

    return () => {
      isActive = false
    }
  }, [form.year, form.make, form.model])

  const isTireFlow = serviceType === 'tire'

  const handleChange = (field: keyof VehicleForm, value: string) => {
    const sanitizedValue = (() => {
      if (field === 'vin') return value.toUpperCase()
      if (field === 'tireSize') return value.toUpperCase()
      if (field === 'licensePlate') return value.toUpperCase()
      return value
    })()

    setForm((prev) => {
      const next = { ...prev, [field]: sanitizedValue }
      if (field === 'make') {
        next.model = ''
      }
      if (field === 'year') {
        next.make = ''
        next.model = ''
      }
      return next
    })
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.year) nextErrors.year = 'Select a year'
    if (!form.make) nextErrors.make = 'Select a make'
    if (!form.model) nextErrors.model = 'Select a model'
    if (!form.engineSize) nextErrors.engineSize = 'Pick an engine size'
    if (!form.fuelType) nextErrors.fuelType = 'Choose a fuel type'
    if (!form.transmission) nextErrors.transmission = 'Select transmission'

    if (form.mileage && !/^[0-9,]+$/.test(form.mileage)) {
      nextErrors.mileage = 'Mileage should contain only numbers'
    }

    if (form.vin && !/^([A-HJ-NPR-Z0-9]{0,17})$/.test(form.vin)) {
      nextErrors.vin = 'VIN must be alphanumeric (I, O, Q excluded)'
    }

    if (isTireFlow && !form.tireSize) {
      nextErrors.tireSize = 'Tire size required for tire services'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validate()) return

    setVehicle({
      year: form.year,
      make: form.make,
      model: form.model,
      engineSize: form.engineSize,
      vin: form.vin,
      mileage: form.mileage,
      trim: form.trim,
      fuelType: form.fuelType,
      transmission: form.transmission,
      driveType: form.driveType,
      bodyStyle: form.bodyStyle,
      doors: form.doors,
      tireSize: form.tireSize,
      color: form.color,
      licensePlate: form.licensePlate,
    })

    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-4xl" aria-hidden>
          🚗
        </p>
        <h2 className="text-2xl font-semibold text-[#0D1B2A]">Vehicle information</h2>
        <p className="text-sm text-gray-600">
          We use these details to match the right technician and estimate labor and parts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-3">
          <Dropdown
            label="Year *"
            value={form.year}
            onChange={(value) => handleChange('year', value)}
            options={yearOptions}
            error={errors.year}
            isLoading={!yearOptions.length}
          />
          <Dropdown
            label="Make *"
            value={form.make}
            onChange={(value) => handleChange('make', value)}
            options={makeOptions}
            error={errors.make}
            disabled={!form.year || isLoadingMakes}
            isLoading={isLoadingMakes}
          />
          <Dropdown
            label="Model *"
            value={form.model}
            onChange={(value) => handleChange('model', value)}
            options={modelOptions}
            disabled={!form.make || isLoadingModels}
            error={errors.model}
            isLoading={isLoadingModels}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Dropdown
            label="Engine size *"
            value={form.engineSize}
            onChange={(value) => handleChange('engineSize', value)}
            options={engineOptions}
            error={errors.engineSize}
            isLoading={isLoadingAttributes}
          />
          <Dropdown
            label="Fuel type *"
            value={form.fuelType}
            onChange={(value) => handleChange('fuelType', value)}
            options={fuelOptions}
            error={errors.fuelType}
            isLoading={isLoadingAttributes}
          />
          <Dropdown
            label="Transmission *"
            value={form.transmission}
            onChange={(value) => handleChange('transmission', value)}
            options={transmissionOptions}
            error={errors.transmission}
            isLoading={isLoadingAttributes}
          />
          <Dropdown
            label="Drive type"
            value={form.driveType}
            onChange={(value) => handleChange('driveType', value)}
            options={driveOptions}
            isLoading={isLoadingAttributes}
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Dropdown
            label="Body style"
            value={form.bodyStyle}
            onChange={(value) => handleChange('bodyStyle', value)}
            options={bodyStyleOptions}
            isLoading={isLoadingAttributes}
          />
          <Dropdown
            label="Doors"
            value={form.doors}
            onChange={(value) => handleChange('doors', value)}
            options={doorOptions}
            isLoading={isLoadingAttributes}
          />
          <label className="space-y-1 text-sm font-medium sm:col-span-3 lg:col-span-1">
            <span>VIN</span>
            <input
              value={form.vin}
              onChange={(event) => handleChange('vin', event.target.value.toUpperCase())}
              onFocus={() => setHoveredVin(true)}
              onBlur={() => setHoveredVin(false)}
              placeholder="17-character VIN"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 uppercase tracking-widest focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
              maxLength={17}
            />
            {errors.vin && <p className="text-xs text-red-600">{errors.vin}</p>}
            {!errors.vin && hoveredVin && (
              <p className="text-xs text-gray-500">
                Locate it on the driver-side dashboard or inside the door jamb.
              </p>
            )}
          </label>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            <span>Mileage</span>
            <input
              value={form.mileage}
              onChange={(event) => handleChange('mileage', event.target.value.replace(/[^0-9,]/g, ''))}
              placeholder="85,200"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
            {errors.mileage && <p className="text-xs text-red-600">{errors.mileage}</p>}
          </label>
          <label className="space-y-1 text-sm font-medium">
            <span>Trim</span>
            <input
              value={form.trim}
              onChange={(event) => handleChange('trim', event.target.value)}
              placeholder="EX-L, LTZ, Premium"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium">
            <span>Color</span>
            <input
              value={form.color}
              onChange={(event) => handleChange('color', event.target.value)}
              placeholder="Silver"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>
          <label className="space-y-1 text-sm font-medium">
            <span>License Plate</span>
            <input
              value={form.licensePlate}
              onChange={(event) => handleChange('licensePlate', event.target.value)}
              placeholder="7ABC123"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
          </label>
        </section>

        {isTireFlow && (
          <label className="space-y-1 text-sm font-medium">
            <span>Tire size *</span>
            <input
              value={form.tireSize}
              onChange={(event) => handleChange('tireSize', event.target.value.toUpperCase())}
              placeholder="225/65R17"
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15"
            />
            {errors.tireSize && <p className="text-xs text-red-600">{errors.tireSize}</p>}
          </label>
        )}

        {loadError && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {loadError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  )
}

type DropdownProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled?: boolean
  error?: string
  isLoading?: boolean
}

function Dropdown({ label, value, onChange, options, disabled, error, isLoading }: DropdownProps) {
  return (
    <label className="space-y-1 text-sm font-medium">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-[#0D1B2A]/15 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="" disabled>
          {isLoading ? 'Loading…' : 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  )
}

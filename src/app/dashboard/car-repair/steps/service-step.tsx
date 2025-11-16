'use client'

import { useMemo, useState } from 'react'
import { useCarRepair } from '../car-repair-context'
import {
  CAR_SERVICES,
  SERVICE_CATEGORIES,
  TIRE_SERVICES,
  WASH_SERVICES,
  calculateFlatFee,
  getPartsForSubcategory,
  type PartSupplier,
  type RepairServiceCategory,
  type RepairServiceSubcategory,
  type RepairServiceSpecification,
  type VehicleSpecificPart,
} from '../data'
import { CardList } from './card-list'

type Props = {
  onSelect: () => void
  onBack: () => void
  serviceType: 'car' | 'tire' | 'wash'
}

const FLAT_SERVICE_MAP = {
  car: CAR_SERVICES,
  tire: TIRE_SERVICES,
  wash: WASH_SERVICES,
}

type Stage = 'category' | 'subcategory' | 'specification' | 'confirmation' | 'action'

const HEADER_LABEL: Record<'car' | 'tire' | 'wash', string> = {
  car: 'Services',
  tire: '🛞 Tire Services',
  wash: '🚿 Mobile Wash Services',
}

type SelectedPartState = {
  part: VehicleSpecificPart
  supplier: PartSupplier
  quantity: number
}

type SearchResult = {
  category: RepairServiceCategory
  subcategory: RepairServiceSubcategory
  specification: RepairServiceSpecification | null
}

const formatCurrency = (value: number) => `$${Number.isFinite(value) ? value.toFixed(2) : '0.00'}`

const findBestSupplier = (suppliers: PartSupplier[]) =>
  [...suppliers].sort((a, b) => a.price - b.price)[0]

const HOURS_IN_MINUTE = 60

const formatDuration = (hours?: number | null) => {
  if (!hours || hours <= 0) return 'Timing varies'

  const totalMinutes = Math.round(hours * HOURS_IN_MINUTE)
  if (totalMinutes < 60) {
    return `${totalMinutes} min`
  }

  const wholeHours = totalMinutes / HOURS_IN_MINUTE
  if (Number.isInteger(wholeHours)) {
    return `${wholeHours} hr${wholeHours === 1 ? '' : 's'}`
  }

  return `${hours.toFixed(1)} hrs`
}

const resolveTimeLabel = (
  subcategory: RepairServiceSubcategory,
  specification?: RepairServiceSpecification | null
) => {
  if (specification?.estimatedTime) return specification.estimatedTime
  if (subcategory.estimatedTime) return subcategory.estimatedTime
  const hours = specification?.baseTimeHours ?? subcategory.baseTimeHours ?? null
  return formatDuration(hours)
}

const resolvePriceLabel = (
  subcategory: RepairServiceSubcategory,
  specification?: RepairServiceSpecification | null
) => {
  if (specification?.priceRange) return specification.priceRange
  if (subcategory.priceRange) return subcategory.priceRange

  const baseHours = specification?.baseTimeHours ?? subcategory.baseTimeHours ?? 0
  const laborRate = specification?.baseLaborRate ?? subcategory.baseLaborRate ?? 0
  const baseParts = specification?.basePartsCost ?? subcategory.basePartsCost ?? 0
  const computed = calculateFlatFee(baseHours, laborRate, baseParts, undefined)

  if (Number.isFinite(computed) && computed > 0) {
    return formatCurrency(computed)
  }

  return 'Price varies'
}

export function ServiceStep({ onSelect, onBack, serviceType }: Props) {
  const { location, vehicle, setService } = useCarRepair()

  const services = useMemo(() => FLAT_SERVICE_MAP[serviceType], [serviceType])
  const categories = useMemo(() => SERVICE_CATEGORIES, [])
  const isCarFlow = serviceType === 'car'

  const [stage, setStage] = useState<Stage>(isCarFlow ? 'category' : 'category')
  const [selectedCategory, setSelectedCategory] = useState<RepairServiceCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<RepairServiceSubcategory | null>(null)
  const [selectedSpecification, setSelectedSpecification] = useState<RepairServiceSpecification | null>(null)
  const [hasOwnParts, setHasOwnParts] = useState(false)
  const [selectedParts, setSelectedParts] = useState<SelectedPartState[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const flattenedServices = useMemo<SearchResult[]>(
    () =>
      categories.flatMap((category) =>
        category.subcategories.flatMap((subcategory) => {
          if (subcategory.specifications.length === 0) {
            return [{ category, subcategory, specification: null } as SearchResult]
          }

          return subcategory.specifications.map((specification) => ({
            category,
            subcategory,
            specification,
          }))
        })
      ),
    [categories]
  )

  const availableParts = useMemo(() => {
    if (!selectedSubcategory) return []
    return getPartsForSubcategory(selectedSubcategory.id, selectedSpecification?.id)
  }, [selectedSubcategory, selectedSpecification])

  const defaultPartsCost = selectedSpecification?.basePartsCost ?? selectedSubcategory?.basePartsCost ?? 0
  const laborEstimateTotal = useMemo(() => {
    if (!selectedSubcategory) return 0

    const baseHours = selectedSpecification?.baseTimeHours ?? selectedSubcategory.baseTimeHours
    const laborRate = selectedSpecification?.baseLaborRate ?? selectedSubcategory.baseLaborRate
    const baseParts = selectedSpecification?.basePartsCost ?? selectedSubcategory.basePartsCost
    const priceRange = selectedSpecification?.priceRange ?? selectedSubcategory.priceRange

    return calculateFlatFee(baseHours, laborRate, baseParts, priceRange)
  }, [selectedSpecification, selectedSubcategory])

  const partsSubtotal = hasOwnParts
    ? 0
    : selectedParts.reduce((total, item) => total + item.supplier.price * item.quantity, 0)

  const laborPortion = Math.max(laborEstimateTotal - defaultPartsCost, 0)
  const partsCost = hasOwnParts
    ? 0
    : selectedParts.length > 0
      ? partsSubtotal
      : defaultPartsCost
  const totalEstimate = laborPortion + partsCost

  const priceSource: 'base' | 'spread' | 'custom' = selectedParts.length > 0
    ? 'custom'
    : selectedSpecification?.priceRange || selectedSubcategory?.priceRange
      ? 'spread'
      : 'base'

  const resetPartsState = () => {
    setSelectedParts([])
    setHasOwnParts(false)
  }

  const handleFlatServiceSelect = (serviceId: string) => {
    const selection = services.find((item) => item.id === serviceId)
    if (!selection) return

    setService({
      id: selection.id,
      title: selection.title,
      description: selection.description,
      laborCost: selection.laborCost,
      partsCost: selection.partsCost,
      category: selection.category,
      subcategory: selection.subcategory,
      emoji: selection.emoji,
      action: 'schedule',
      hasOwnParts: false,
      selectedParts: [],
      priceSource: 'base',
    })

    onSelect()
  }

  const handleStageBack = () => {
    if (!isCarFlow) {
      onBack()
      return
    }

    switch (stage) {
      case 'category':
        onBack()
        break
      case 'subcategory':
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        setSelectedSpecification(null)
        setStage('category')
        resetPartsState()
        break
      case 'specification':
        setSelectedSpecification(null)
        setStage('subcategory')
        resetPartsState()
        break
      case 'confirmation':
        if (selectedSubcategory?.specifications.length) {
          setSelectedSpecification(null)
          setStage('specification')
        } else {
          setSelectedSubcategory(null)
          setStage('subcategory')
        }
        resetPartsState()
        break
      case 'action':
        setStage('confirmation')
        break
      default:
        onBack()
    }
  }

  const canContinueToAction = hasOwnParts || selectedParts.length > 0 || availableParts.length === 0
  const disableRepairBoard = !hasOwnParts && selectedParts.length > 0

  const filteredSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return flattenedServices.slice(0, 60)
    }
    const query = searchQuery.trim().toLowerCase()
    return flattenedServices
      .filter(({ category, subcategory, specification }) => {
        const haystack = [category.name, subcategory.name, subcategory.description, specification?.name, specification?.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(query)
      })
      .slice(0, 60)
  }, [flattenedServices, searchQuery])

  const handleSearchSelect = (result: SearchResult) => {
    setSearchQuery('')
    setSelectedCategory(result.category)
    setSelectedSubcategory(result.subcategory)
    resetPartsState()

    if (result.specification) {
      setSelectedSpecification(result.specification)
      setStage('confirmation')
    } else if (result.subcategory.specifications.length > 0) {
      setSelectedSpecification(null)
      setStage('specification')
    } else {
      setSelectedSpecification(null)
      setStage('confirmation')
    }
  }

  const breadcrumbs = useMemo(() => {
    const labels: string[] = []
    if (selectedCategory) labels.push(selectedCategory.name)
    if (selectedSubcategory) labels.push(selectedSubcategory.name)
    if (selectedSpecification) labels.push(selectedSpecification.name)
    return labels
  }, [selectedCategory, selectedSubcategory, selectedSpecification])

  const handleCategorySelect = (category: RepairServiceCategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
    setSelectedSpecification(null)
    resetPartsState()
    setStage('subcategory')
  }

  const handleSubcategorySelect = (subcategory: RepairServiceSubcategory) => {
    setSelectedSubcategory(subcategory)
    setSelectedSpecification(null)
    resetPartsState()
    setStage(subcategory.specifications.length > 0 ? 'specification' : 'confirmation')
  }

  const handleSpecificationSelect = (specification: RepairServiceSpecification) => {
    setSelectedSpecification(specification)
    resetPartsState()
    setStage('confirmation')
  }

  const handleContinueToAction = () => {
    setStage('action')
  }

  const handleAddPart = (part: VehicleSpecificPart) => {
    if (selectedParts.some((item) => item.part.id === part.id)) return
    const supplier = findBestSupplier(part.suppliers)
    if (!supplier) return

    setSelectedParts((prev) => [...prev, { part, supplier, quantity: 1 }])
  }

  const handleRemovePart = (partId: string) => {
    setSelectedParts((prev) => prev.filter((item) => item.part.id !== partId))
  }

  const handleQuantityChange = (partId: string, delta: number) => {
    setSelectedParts((prev) =>
      prev.map((item) =>
        item.part.id === partId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const handleSupplierChange = (partId: string, supplierId: string) => {
    setSelectedParts((prev) =>
      prev.map((item) => {
        if (item.part.id !== partId) return item
        const nextSupplier = item.part.suppliers.find((supplier) => supplier.id === supplierId)
        if (!nextSupplier) return item
        return { ...item, supplier: nextSupplier }
      })
    )
  }

  const handleOwnPartsToggle = (value: boolean) => {
    setHasOwnParts(value)
    if (value) {
      setSelectedParts([])
    }
  }

  const handleActionSelect = (action: 'schedule' | 'repair-board') => {
    if (!selectedCategory || !selectedSubcategory) return

    const effectiveParts = hasOwnParts
      ? []
      : selectedParts.map((item) => ({
          partId: item.part.id,
          partName: item.part.name,
          supplierId: item.supplier.id,
          supplierName: item.supplier.name,
          unitPrice: item.supplier.price,
          quantity: item.quantity,
        }))

    const specification = selectedSpecification?.name ?? undefined
    const descriptionParts = [selectedSubcategory.description, selectedSpecification?.description]
      .filter(Boolean)
      .join(' ')

    const priceRange = selectedSpecification?.priceRange ?? selectedSubcategory?.priceRange

    setService({
      id: selectedSpecification ? `${selectedSubcategory.id}-${selectedSpecification.id}` : selectedSubcategory.id,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory.id,
      specificationId: selectedSpecification?.id,
      title: selectedSpecification
        ? `${selectedSubcategory.name} – ${selectedSpecification.name}`
        : selectedSubcategory.name,
      description: descriptionParts.trim(),
      laborCost: Number(laborPortion.toFixed(2)),
      partsCost: Number(partsCost.toFixed(2)),
      category: selectedCategory.name,
      subcategory: selectedSubcategory.name,
      emoji: selectedCategory.emoji,
      specification,
      action,
      hasOwnParts,
      selectedParts: hasOwnParts ? [] : effectiveParts,
      priceRange,
    })

    onSelect()
  }

  const stageTitle = useMemo(() => {
    if (!isCarFlow) return HEADER_LABEL[serviceType]
    switch (stage) {
      case 'category':
        return 'Services'
      case 'subcategory':
        return selectedCategory ? `${selectedCategory.emoji} ${selectedCategory.name}` : 'Services'
      case 'specification':
        return selectedSubcategory ? selectedSubcategory.name : 'Services'
      case 'confirmation':
        return 'Review Service'
      case 'action':
        return 'Choose Next Step'
      default:
        return HEADER_LABEL[serviceType]
    }
  }, [isCarFlow, serviceType, stage, selectedCategory, selectedSubcategory])

  const stageHint = useMemo(() => {
    if (!isCarFlow) return 'Tap a service below to continue'
    switch (stage) {
      case 'category':
        return 'Select a service category to continue'
      case 'subcategory':
        return 'Choose the repair you need'
      case 'specification':
        return 'Pick the exact location or variation'
      case 'confirmation':
        return 'Review details then continue'
      case 'action':
        return 'Post to Repair Board or schedule now'
      default:
        return ''
    }
  }, [isCarFlow, stage])

  const renderCategoryStage = () => (
    <section className="space-y-3">
      <p className="text-sm text-gray-600">Select a service category to continue.</p>
      <div className="space-y-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0D1B2A] hover:shadow-md"
          >
            <button type="button" onClick={() => handleCategorySelect(category)} className="flex w-full items-center gap-4">
              <span className="text-3xl" aria-hidden>
                {category.emoji}
              </span>
              <div className="flex-1 space-y-1 text-left">
                <p className="text-base font-semibold text-[#0D1B2A]">{category.name}</p>
                <p className="text-xs text-gray-500">{category.subcategories.length} services available</p>
              </div>
              <span className="text-lg text-[#0D1B2A]" aria-hidden>
                ›
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  )

  const renderSubcategoryStage = () => (
    <section className="space-y-3">
      <p className="text-sm text-gray-600">Select the repair that best matches your issue.</p>
      <CardList
        items={selectedCategory?.subcategories}
        onItemClick={handleSubcategorySelect}
        itemRenderer={(subcategory) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-[#0D1B2A]">{subcategory.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{subcategory.description}</p>
              </div>
              <span className="text-lg text-[#0D1B2A]" aria-hidden>
                ›
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#0D1B2A]/5 px-3 py-2 text-xs font-medium text-[#0D1B2A]">
              <span>{resolveTimeLabel(subcategory)}</span>
              <span>{resolvePriceLabel(subcategory)}</span>
            </div>
          </div>
        )}
      />
    </section>
  )

  const renderSpecificationStage = () => (
    <section className="space-y-3">
      <p className="text-sm text-gray-600">Choose the exact location or component for this repair.</p>
      <CardList
        items={selectedSubcategory?.specifications}
        onItemClick={handleSpecificationSelect}
        itemRenderer={(specification) => (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-[#0D1B2A]">{specification.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{specification.description}</p>
              </div>
              <span className="text-lg text-[#0D1B2A]" aria-hidden>
                ›
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#0D1B2A]/5 px-3 py-2 text-xs font-medium text-[#0D1B2A]">
              <span>{resolveTimeLabel(selectedSubcategory, specification)}</span>
              <span>{resolvePriceLabel(selectedSubcategory, specification)}</span>
            </div>
          </div>
        )}
      />
    </section>
  )

  const renderConfirmationStage = () => (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0D1B2A]">Service details</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {selectedSpecification?.description || selectedSubcategory?.description}
        </p>

        <dl className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl bg-[#0D1B2A]/5 px-3 py-2">
            <dt>Estimated time</dt>
            <dd>{selectedSpecification?.estimatedTime ?? selectedSubcategory?.estimatedTime ?? 'Varies by vehicle'}</dd>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#0D1B2A]/5 px-3 py-2">
            <dt>Estimate source</dt>
            <dd className="capitalize">{priceSource === 'custom' ? 'custom pricing' : priceSource}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-[#0D1B2A]">Parts</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleOwnPartsToggle(false)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                !hasOwnParts
                  ? 'bg-[#0D1B2A] text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0D1B2A]/40'
              }`}
            >
              I need parts sourced
            </button>
            <button
              type="button"
              onClick={() => handleOwnPartsToggle(true)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                hasOwnParts
                  ? 'bg-[#0D1B2A] text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-[#0D1B2A]/40'
              }`}
            >
              I have the parts
            </button>
          </div>
        </div>

        {!hasOwnParts && (
          <div className="mt-4 space-y-4">
            {availableParts.length === 0 && (
              <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600">
                This service typically relies on technician-sourced parts.
              </p>
            )}

            {availableParts.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recommended components</p>
                <div className="space-y-3">
                  {availableParts.map((part) => {
                    const bestSupplier = findBestSupplier(part.suppliers)
                    const isSelected = selectedParts.some((item) => item.part.id === part.id)

                    return (
                      <div
                        key={part.id}
                        className={`rounded-2xl border px-4 py-4 ${
                          isSelected ? 'border-[#0D1B2A] bg-[#0D1B2A]/5' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-[#0D1B2A]">{part.name}</p>
                            <p className="text-xs text-gray-500">{part.description}</p>
                          </div>
                          {bestSupplier && (
                            <p className="text-sm font-semibold text-[#0D1B2A]">{formatCurrency(bestSupplier.price)}</p>
                          )}
                        </div>

                        {isSelected ? (
                          <div className="mt-3 flex flex-col gap-3 rounded-xl border border-[#0D1B2A]/20 bg-white px-3 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-semibold uppercase text-[#0D1B2A]">Supplier</label>
                              <select
                                className="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 focus:border-[#0D1B2A] focus:outline-none"
                                value={selectedParts.find((item) => item.part.id === part.id)?.supplier.id}
                                onChange={(event) => handleSupplierChange(part.id, event.target.value)}
                              >
                                {part.suppliers.map((supplier) => (
                                  <option key={supplier.id} value={supplier.id}>
                                    {supplier.name} – {formatCurrency(supplier.price)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(part.id, -1)}
                                className="h-8 w-8 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="min-w-[2ch] text-center text-sm font-medium text-[#0D1B2A]">
                                {selectedParts.find((item) => item.part.id === part.id)?.quantity ?? 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(part.id, 1)}
                                className="h-8 w-8 rounded-full border border-gray-300 text-sm font-semibold text-gray-600 hover:border-[#0D1B2A] hover:text-[#0D1B2A]"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePart(part.id)}
                              className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddPart(part)}
                            className="mt-4 rounded-xl border border-[#0D1B2A] px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
                          >
                            Add to estimate
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {hasOwnParts && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Customer-supplied parts are not covered under warranty. Please have the parts ready when the technician arrives.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0D1B2A]">Estimate</h3>
        <dl className="mt-3 space-y-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <dt>Labor</dt>
            <dd>{formatCurrency(laborPortion)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Parts</dt>
            <dd>{hasOwnParts ? 'Customer supplied' : formatCurrency(partsCost)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-[#0D1B2A]">
            <dt>Total estimate</dt>
            <dd>{formatCurrency(totalEstimate)}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        onClick={handleContinueToAction}
        disabled={!canContinueToAction}
        className="w-full rounded-xl bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Continue
      </button>
    </section>
  )

  const renderActionStage = () => (
    <section className="space-y-4">
      <div className="rounded-2xl border border-[#0D1B2A] bg-[#0D1B2A]/5 px-4 py-3 text-sm text-[#0D1B2A]">
        <p className="font-semibold">How would you like to proceed?</p>
        <p className="text-xs text-[#0D1B2A]/70">
          Match the Android app by either posting this job to the Repair Board for technician bids or scheduling immediately.
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          disabled={disableRepairBoard}
          onClick={() => handleActionSelect('repair-board')}
          className={`flex w-full flex-col gap-3 rounded-2xl border px-5 py-5 text-left shadow-sm transition ${
            disableRepairBoard
              ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-70'
              : 'border-gray-200 bg-white hover:-translate-y-0.5 hover:border-[#0D1B2A] hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-[#0D1B2A]">Add service to Repair Board</p>
              <p className="text-sm text-gray-600">Collect technician bids and choose the offer that works best for you.</p>
            </div>
            <span className="text-2xl" aria-hidden>
              📋
            </span>
          </div>
          {disableRepairBoard && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Remove selected parts or mark that you have your own parts to post this job to the Repair Board.
            </p>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleActionSelect('schedule')}
          className="flex w-full flex-col gap-3 rounded-2xl border border-[#0D1B2A] bg-[#0D1B2A] px-5 py-5 text-left text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0A1625]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold">Schedule service now</p>
              <p className="text-sm text-white/80">Choose a date, time, and technician — then checkout through escrow.</p>
            </div>
            <span className="text-2xl" aria-hidden>
              📅
            </span>
          </div>
        </button>
      </div>
    </section>
  )

  const renderCarContent = () => {
    switch (stage) {
      case 'category':
        return renderCategoryStage()
      case 'subcategory':
        return renderSubcategoryStage()
      case 'specification':
        return renderSpecificationStage()
      case 'confirmation':
        return renderConfirmationStage()
      case 'action':
        return renderActionStage()
      default:
        return null
    }
  }

  const renderNonCarContent = () => (
    <section className="space-y-3">
      <p className="text-sm text-gray-600">Tap a service to continue.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const estimatedTime = (service as { estimatedTime?: string }).estimatedTime ?? 'Timing varies'
          const priceRange =
            (service as { priceRange?: string }).priceRange ?? formatCurrency(service.laborCost + service.partsCost)

          return (
            <button
              key={service.id}
              onClick={() => handleFlatServiceSelect(service.id)}
              className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0D1B2A] hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {service.emoji}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[#0D1B2A]">{service.title}</p>
                    <p className="text-xs text-gray-500">{service.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#0D1B2A]/5 px-3 py-2 text-xs font-medium text-[#0D1B2A]">
                  <span>{estimatedTime}</span>
                  <span>{priceRange}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )

  const isSearchActive = searchQuery.trim().length > 0

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <header className="sticky top-0 z-10 bg-white py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleStageBack}
            className="rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
          >
            Back
          </button>
          <div className="text-center">
            <h2 className="text-base font-semibold text-[#0D1B2A]">{stageTitle}</h2>
            <p className="text-xs text-gray-600">{stageHint}</p>
          </div>
          <span className="w-16" aria-hidden></span>
        </div>
        {breadcrumbs.length > 0 && (
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb} className="flex items-center gap-1">
                {index > 0 && <span aria-hidden>›</span>}
                <span>{crumb}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-[#0D1B2A]">Vehicle</h3>
          {vehicle ? (
            <div className="mt-1 text-sm text-gray-600">
              <p>
                {vehicle.year} {vehicle.make} {vehicle.model}
                {vehicle.trim ? ` • ${vehicle.trim}` : ''}
              </p>
              {vehicle.engineSize && <p>Engine: {vehicle.engineSize}</p>}
            </div>
          ) : (
            <p className="mt-1 text-sm text-gray-500">Add vehicle details to continue.</p>
          )}
          {location && (
            <p className="mt-3 text-xs text-gray-500">
              📍 {location.streetAddress}, {location.city}, {location.state} {location.zipCode}
            </p>
          )}
        </div>

        {isCarFlow && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[#0D1B2A]">Search services</h3>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-[#0D1B2A] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-600 focus:border-[#0D1B2A] focus:outline-none"
              placeholder="Search by service name or keyword"
            />
            {isSearchActive && (
              <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
                {filteredSearchResults.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-500">
                    No services matched "{searchQuery}".
                  </p>
                ) : (
                  filteredSearchResults.map(({ category, subcategory, specification }) => (
                    <button
                      key={`${category.id}-${subcategory.id}-${specification?.id ?? 'base'}`}
                      type="button"
                      onClick={() => handleSearchSelect({ category, subcategory, specification })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition hover:border-[#0D1B2A] hover:bg-[#0D1B2A]/5"
                    >
                      <p className="font-semibold text-[#0D1B2A]">
                        {specification ? `${subcategory.name} – ${specification.name}` : subcategory.name}
                      </p>
                      <p className="text-xs text-gray-500">{category.emoji} {category.name}</p>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {!isSearchActive && (isCarFlow ? renderCarContent() : renderNonCarContent())}
      </div>
    </div>
  )
}

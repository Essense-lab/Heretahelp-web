'use client'

import { ReactNode } from 'react'

type CardListProps<T> = {
  items?: T[] | null
  onItemClick: (item: T) => void
  itemRenderer: (item: T) => ReactNode
  getKey?: (item: T, index: number) => string | number
  emptyMessage?: string
}

export function CardList<T>({
  items,
  onItemClick,
  itemRenderer,
  getKey,
  emptyMessage = 'No options available right now.',
}: CardListProps<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-500">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <button
          key={getKey ? getKey(item, index) : index}
          type="button"
          onClick={() => onItemClick(item)}
          className="w-full rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#0D1B2A] hover:shadow-md"
        >
          {itemRenderer(item)}
        </button>
      ))}
    </div>
  )
}

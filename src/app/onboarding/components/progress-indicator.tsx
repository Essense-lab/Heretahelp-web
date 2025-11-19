"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: ProgressIndicatorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>Step {currentStep + 1}</span>
        <span>{totalSteps} total</span>
      </div>

      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index <= currentStep
          return (
            <motion.div
              key={index}
              layout
              className="w-full rounded-full bg-slate-200"
            >
              <motion.div
                layout
                className="h-2 rounded-full"
                animate={{ width: isActive ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                style={{ backgroundColor: isActive ? "#0D1B2A" : "transparent" }}
              />
            </motion.div>
          )
        })}
      </div>

      {labels && labels.length === totalSteps && (
        <div className="grid grid-cols-2 gap-2 text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:grid-cols-3 lg:grid-cols-6">
          {labels.map((label, index) => (
            <div
              key={label}
              className={`rounded-full border px-2 py-1 text-center ${
                index === currentStep ? "border-[#0D1B2A] text-[#0D1B2A]" : "border-transparent"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { ReactNode } from "react"
import { ProgressIndicator } from "./progress-indicator"

interface OnboardingShellProps {
  currentStep: number
  totalSteps: number
  labels: string[]
  children: ReactNode
}

export function OnboardingShell({ currentStep, totalSteps, labels, children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} labels={labels} />
        {children}
      </div>
    </div>
  )
}

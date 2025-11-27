'use client'

import { Progress } from '@/components/ui/progress'

// Define the onboarding flow structure
export const ONBOARDING_FLOW = {
  intro: { start: 1, steps: 3 },
  demographics: { start: 4, steps: 3 },
  goals: { start: 7, steps: 3 },
  patterns: { start: 10, steps: 2 },
  summary: { start: 12, steps: 1 },
  plan: { start: 13, steps: 1 },
} as const

export const TOTAL_ONBOARDING_STEPS = 13

type OnboardingPage = keyof typeof ONBOARDING_FLOW

interface OnboardingProgressProps {
  currentPage: OnboardingPage
  currentStep: number
}

export function OnboardingProgress({ currentPage, currentStep }: OnboardingProgressProps) {
  const pageConfig = ONBOARDING_FLOW[currentPage]
  const globalStep = pageConfig.start + currentStep - 1

  return (
    <div className="mb-6">
      {/* Global progress text */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Your progress</span>
        <span className="text-xs font-semibold text-primary">
          {globalStep}/{TOTAL_ONBOARDING_STEPS}
        </span>
      </div>
      
      {/* Global progress bar */}
      <Progress 
        value={globalStep} 
        max={TOTAL_ONBOARDING_STEPS} 
        className="h-2 bg-orange-100"
      />
    </div>
  )
}


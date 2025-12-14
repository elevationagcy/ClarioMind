'use client'

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
  const progress = (globalStep / TOTAL_ONBOARDING_STEPS) * 100

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">Your progress</span>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
          <span className="text-sm font-medium text-blue-600">{globalStep}</span>
          <span className="text-sm text-slate-400">/</span>
          <span className="text-sm text-slate-500">{TOTAL_ONBOARDING_STEPS}</span>
        </div>
      </div>
      
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

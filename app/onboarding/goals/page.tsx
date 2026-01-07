'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Sparkles, Check } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { CHANGE_REASONS } from '@/lib/constants/onboarding'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import type { AlcoholGoalType } from '@/types'

export default function GoalsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [triedQuitBefore, setTriedQuitBefore] = useState<boolean | null>(null)
  const [reasons, setReasons] = useState<string[]>([])
  const [alcoholGoal, setAlcoholGoal] = useState<AlcoholGoalType | ''>('')

  const totalSteps = 3

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/onboarding/demographics')
    }
  }

  const toggleReason = (reason: string) => {
    if (reasons.includes(reason)) {
      setReasons(reasons.filter(r => r !== reason))
    } else {
      setReasons([...reasons, reason])
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('user_goals')
          .upsert({
            user_id: user.id,
            tried_quit_before: triedQuitBefore,
            reasons: reasons,
            alcohol_relationship_goal: alcoholGoal as AlcoholGoalType,
          })

        router.push('/onboarding/patterns')
      }
    } catch (error) {
      console.error('Error saving goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return triedQuitBefore !== null
      case 2: return reasons.length > 0
      case 3: return alcoholGoal !== ''
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
        </button>
            <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </button>
            <div className="w-8" />
      </div>
          <OnboardingProgress currentPage="goals" currentStep={step} />
      </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {step === 1 && <Step2 triedBefore={triedQuitBefore} setTriedBefore={setTriedQuitBefore} />}
        {step === 2 && <Step3 reasons={reasons} toggleReason={toggleReason} />}
        {step === 3 && <Step4 goal={alcoholGoal} setGoal={setAlcoholGoal} />}
      </main>

      <footer className="bg-white border-t border-slate-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
        <Button
          onClick={handleNext}
          size="lg"
          disabled={!canProceed() || loading}
            className={`w-full py-6 rounded-xl text-lg font-semibold ${
              !canProceed() || loading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
        </Button>
      </div>
      </footer>
    </div>
  )
}

function Step2({ triedBefore, setTriedBefore }: { triedBefore: boolean | null; setTriedBefore: (val: boolean) => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Have you tried to cut back or quit drinking in the past?
      </h2>
        <p className="text-slate-500">
          If you've tried before, you're already showing incredible determination.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { value: true, label: 'Yes' },
          { value: false, label: 'No' }
        ].map((option) => (
        <button
            key={String(option.value)}
            onClick={() => setTriedBefore(option.value)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              triedBefore === option.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
          }`}
        >
            {option.label}
        </button>
        ))}
      </div>
    </div>
  )
}

function Step3({ reasons, toggleReason }: { reasons: string[]; toggleReason: (reason: string) => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Your "why" is powerful</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
        Why do you want to change your drinking habits?
      </h2>
        <p className="text-slate-500 text-sm">
        Select all that apply — we'll remind you of these reasons when you need it most
      </p>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        {CHANGE_REASONS.map((reason) => {
          const isSelected = reasons.includes(reason)
          return (
          <button
            key={reason}
            onClick={() => toggleReason(reason)}
              className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 flex items-center gap-3 ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-blue-600' : 'bg-slate-100'
              }`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </div>
            {reason}
          </button>
          )
        })}
      </div>
    </div>
  )
}

function Step4({ goal, setGoal }: { goal: string; setGoal: (val: AlcoholGoalType) => void }) {
  const options: { value: AlcoholGoalType; label: string }[] = [
    { value: 'quit', label: 'I want to quit drinking' },
    { value: 'cut_back', label: 'I want to cut back on drinking' },
    { value: 'stay_sober', label: 'Continue staying sober' },
    { value: 'not_sure', label: "I'm not sure yet" }
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Define your path forward</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
        How do you want to change your relationship with alcohol?
      </h2>
        <p className="text-slate-500 text-sm">
          You can always adjust your goal as you progress.
      </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
        <button
            key={option.value}
            onClick={() => setGoal(option.value)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              goal === option.value
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
          }`}
        >
            {option.label}
        </button>
        ))}
      </div>
    </div>
  )
}

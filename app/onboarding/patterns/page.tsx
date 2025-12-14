'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import type { InterferenceFrequencyType } from '@/types'

export default function PatternsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [drinksPerWeek, setDrinksPerWeek] = useState(7)
  const [spendPerWeek, setSpendPerWeek] = useState(50)
  const [interferenceFrequency, setInterferenceFrequency] = useState<InterferenceFrequencyType | ''>('')

  const totalSteps = 2

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
      router.push('/onboarding/goals')
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('drinking_patterns')
          .upsert({
            user_id: user.id,
            drinks_per_week: drinksPerWeek,
            spend_per_week: spendPerWeek,
            interference_frequency: interferenceFrequency as InterferenceFrequencyType,
            drink_more_than_intended: null,
          })

        router.push('/onboarding/summary')
      }
    } catch (error) {
      console.error('Error saving patterns:', error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1: return true
      case 2: return interferenceFrequency !== ''
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
            <Logo size="sm" />
            <div className="w-8" />
          </div>
          <OnboardingProgress currentPage="patterns" currentStep={step} />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {step === 1 && <Step2 drinks={drinksPerWeek} setDrinks={setDrinksPerWeek} spend={spendPerWeek} setSpend={setSpendPerWeek} />}
        {step === 2 && <Step6 frequency={interferenceFrequency} setFrequency={setInterferenceFrequency} />}
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

function Step2({ drinks, setDrinks, spend, setSpend }: {
  drinks: number
  setDrinks: (val: number) => void
  spend: number
  setSpend: (val: number) => void
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Let's look at your baseline</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          What does a typical week look like for you?
        </h2>
        <p className="text-slate-500 text-sm">
          We'll use this to show you potential savings and health benefits!
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-slate-700 mb-6 font-medium">
            How many drinks do you usually have per week?
          </p>
          <Slider
            value={drinks}
            onChange={setDrinks}
            min={0}
            max={50}
            step={1}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-slate-700 mb-6 font-medium">
            How much do you typically spend per week?
          </p>
          <Slider
            value={spend}
            onChange={setSpend}
            min={0}
            max={1000}
            step={10}
            suffix="€"
          />
        </div>
      </div>
    </div>
  )
}

function Step6({ frequency, setFrequency }: { frequency: string; setFrequency: (val: InterferenceFrequencyType) => void }) {
  const options: { value: InterferenceFrequencyType; label: string }[] = [
    { value: 'always', label: 'Always' },
    { value: 'often', label: 'Often' },
    { value: 'sometimes', label: 'Sometimes' }
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Assessing the impact</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          How often does alcohol interfere with your life?
        </h2>
        <p className="text-slate-500 text-sm">
          Recognizing the impact is a sign of strength.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setFrequency(option.value)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              frequency === option.value
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

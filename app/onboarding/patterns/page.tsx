'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { InterferenceFrequencyType } from '@/types'

export default function PatternsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form data
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
            drink_more_than_intended: null, // This will be set in summary page
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
      case 1: return true // Sliders always have values
      case 2: return interferenceFrequency !== ''
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button onClick={handleBack} disabled={step === 1} className="text-gray-900 disabled:text-gray-300 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Progress value={step} max={totalSteps} className="bg-orange-200" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {step === 1 && <Step2 drinks={drinksPerWeek} setDrinks={setDrinksPerWeek} spend={spendPerWeek} setSpend={setSpendPerWeek} />}
        {step === 2 && <Step6 frequency={interferenceFrequency} setFrequency={setInterferenceFrequency} />}
      </div>

      {/* Next button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full bg-primary text-white hover:bg-primary-dark"
          disabled={!canProceed() || loading}
        >
          {step === totalSteps ? (loading ? 'Saving...' : 'Next') : 'Next'}
        </Button>
      </div>
    </div>
  )
}

// Step 2: Typical week sliders
function Step2({ drinks, setDrinks, spend, setSpend }: {
  drinks: number
  setDrinks: (val: number) => void
  spend: number
  setSpend: (val: number) => void
}) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        📈 Let's look at your baseline
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        What does a typical week look like for you?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        We'll use this to show you potential savings and health benefits!
      </p>

      <div className="space-y-8">
        <div>
          <p className="text-gray-700 mb-4 font-medium">
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

        <div>
          <p className="text-gray-700 mb-4 font-medium">
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

// Step 6: Interference frequency
function Step6({ frequency, setFrequency }: { frequency: string; setFrequency: (val: InterferenceFrequencyType) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        🌟 Assessing the impact
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        How often does alcohol interfere with your life?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        Recognizing the impact is a sign of strength. You're taking the right steps to reclaim control.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setFrequency('always')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            frequency === 'always'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Always
        </button>
        <button
          onClick={() => setFrequency('often')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            frequency === 'often'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Often
        </button>
        <button
          onClick={() => setFrequency('sometimes')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            frequency === 'sometimes'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Sometimes
        </button>
      </div>
    </div>
  )
}


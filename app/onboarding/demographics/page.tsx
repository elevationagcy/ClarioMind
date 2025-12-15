'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { RELATIONSHIP_STATUSES } from '@/lib/constants/onboarding'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import type { SexType } from '@/types'

export default function DemographicsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [sex, setSex] = useState<SexType | ''>('')
  const [age, setAge] = useState('')
  const [relationshipStatus, setRelationshipStatus] = useState('')

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
      router.push('/onboarding/intro')
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('user_profiles')
          .update({
            sex: sex as SexType,
            age: parseInt(age),
            relationship_status: relationshipStatus,
          })
          .eq('user_id', user.id)

        router.push('/onboarding/goals')
      }
    } catch (error) {
      console.error('Error saving demographics:', error)
    } finally {
      setLoading(false)
    }
  }

  const isUnder18 = age !== '' && parseInt(age) < 18

  const canProceed = () => {
    switch (step) {
      case 1: return sex !== ''
      case 2: return age !== '' && parseInt(age) >= 18
      case 3: return relationshipStatus !== ''
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
          <OnboardingProgress currentPage="demographics" currentStep={step} />
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {step === 1 && <Step1 sex={sex} setSex={setSex} />}
        {step === 2 && <Step2 age={age} setAge={setAge} isUnder18={isUnder18} />}
        {step === 3 && <Step3 status={relationshipStatus} setStatus={setRelationshipStatus} />}
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

function Step1({ sex, setSex }: { sex: string; setSex: (val: SexType) => void }) {
  const options: { value: SexType; label: string }[] = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'prefer_not_to_say', label: 'Prefer not to answer' }
  ]

  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Let's personalize your experience</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Sex and hormones impact how our body responds to alcohol.
        </h2>
        <p className="text-slate-500">
          This helps us provide science-backed insights tailored to your biology.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSex(option.value)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              sex === option.value
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

function Step2({ age, setAge, isUnder18 }: { age: string; setAge: (val: string) => void; isUnder18: boolean }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Building your profile</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          What is your age?
        </h2>
        <p className="text-slate-500">
          Age-specific insights help us recommend the most effective strategies for you.
        </p>
      </div>

      <input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        min="1"
        max="120"
        className={`w-full px-6 py-5 bg-white border-2 rounded-2xl text-slate-800 text-center text-3xl font-bold placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
          isUnder18 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
        }`}
      />

      {isUnder18 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-medium">You must be 18 or older</p>
            <p className="text-red-600 text-sm mt-1">
              ClarioMind is designed for adults aged 18 and above. If you're struggling with alcohol, please speak with a trusted adult or healthcare provider.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Step3({ status, setStatus }: { status: string; setStatus: (val: string) => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">Understanding your support system</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          What is your relationship status?
        </h2>
        <p className="text-slate-500">
          Your relationships play a key role in your journey.
        </p>
      </div>

      <div className="space-y-3">
        {RELATIONSHIP_STATUSES.map((relationshipStatus) => (
          <button
            key={relationshipStatus}
            onClick={() => setStatus(relationshipStatus)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              status === relationshipStatus
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
            }`}
          >
            {relationshipStatus}
          </button>
        ))}
      </div>
    </div>
  )
}

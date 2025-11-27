'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { RELATIONSHIP_STATUSES } from '@/lib/constants/onboarding'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import type { SexType } from '@/types'

export default function DemographicsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form data
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

  const canProceed = () => {
    switch (step) {
      case 1: return sex !== ''
      case 2: return age !== '' && parseInt(age) > 0
      case 3: return relationshipStatus !== ''
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
        
        {/* Global Onboarding Progress */}
        <OnboardingProgress currentPage="demographics" currentStep={step} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {step === 1 && <Step1 sex={sex} setSex={setSex} />}
        {step === 2 && <Step2 age={age} setAge={setAge} />}
        {step === 3 && <Step3 status={relationshipStatus} setStatus={setRelationshipStatus} />}
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

// Step 1: Sex
function Step1({ sex, setSex }: { sex: string; setSex: (val: SexType) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        🧬 Let's personalize your experience
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Sex and hormones impact how our body responds to alcohol. Which sex best describes you?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        This helps us provide science-backed insights tailored to your biology.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setSex('female')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            sex === 'female'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Female
        </button>
        <button
          onClick={() => setSex('male')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            sex === 'male'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Male
        </button>
        <button
          onClick={() => setSex('prefer_not_to_say')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            sex === 'prefer_not_to_say'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Prefer not to answer
        </button>
      </div>
    </div>
  )
}

// Step 2: Age
function Step2({ age, setAge }: { age: string; setAge: (val: string) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        📊 Building your personalized profile
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        What is your age?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        Age-specific insights help us recommend the most effective strategies for you.
      </p>

      <Input
        type="number"
        placeholder="Enter your age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        min="18"
        max="120"
        className="text-center text-2xl"
      />
    </div>
  )
}

// Step 3: Relationship Status
function Step3({ status, setStatus }: { status: string; setStatus: (val: string) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        💞 Understanding your support system
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        What is your relationship status?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        Your relationships play a key role in your journey. We'll help you navigate them successfully.
      </p>

      <div className="space-y-3">
        {RELATIONSHIP_STATUSES.map((relationshipStatus) => (
          <button
            key={relationshipStatus}
            onClick={() => setStatus(relationshipStatus)}
            className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
              status === relationshipStatus
                ? 'bg-primary text-white'
                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            {relationshipStatus}
          </button>
        ))}
      </div>
    </div>
  )
}

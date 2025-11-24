'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { CHANGE_REASONS } from '@/lib/constants/onboarding'
import type { AlcoholGoalType, RegretFrequencyType } from '@/types'

export default function GoalsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form data
  const [triedQuitBefore, setTriedQuitBefore] = useState<boolean | null>(null)
  const [reasons, setReasons] = useState<string[]>([])
  const [alcoholGoal, setAlcoholGoal] = useState<AlcoholGoalType | ''>('')
  const [regretFrequency, setRegretFrequency] = useState<RegretFrequencyType | ''>('')

  const totalSteps = 5

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
            regret_frequency: regretFrequency as RegretFrequencyType,
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
      case 1: return true // Intro screen
      case 2: return triedQuitBefore !== null
      case 3: return reasons.length > 0
      case 4: return alcoholGoal !== ''
      case 5: return regretFrequency !== ''
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
      <div className="flex-1 px-6 py-8">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 triedBefore={triedQuitBefore} setTriedBefore={setTriedQuitBefore} />}
        {step === 3 && <Step3 reasons={reasons} toggleReason={toggleReason} />}
        {step === 4 && <Step4 goal={alcoholGoal} setGoal={setAlcoholGoal} />}
        {step === 5 && <Step5 frequency={regretFrequency} setFrequency={setRegretFrequency} />}
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

// Step 1: Intro
function Step1() {
  return (
    <div>
      <p className="text-primary font-semibold mb-4">
        🎯 Let's understand your goals
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        We want to learn more about your goals for healthier drinking.
      </h2>
      <p className="text-gray-600 mb-6">
        These following answers will help us create the best experience.
      </p>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
        <p className="text-sm text-gray-700">
          💭 <strong>Remember:</strong> There are no wrong answers. This is about YOUR journey and what YOU want to achieve.
        </p>
      </div>
    </div>
  )
}

// Step 2: Tried to quit before
function Step2({ triedBefore, setTriedBefore }: { triedBefore: boolean | null; setTriedBefore: (val: boolean) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Have you tried to cut back or quit drinking in the past unsuccessfully?
      </h2>
      
      <p className="text-sm text-gray-600 mb-6">
        💪 If you've tried before, you're already showing incredible determination. This time, you'll have science and support on your side.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setTriedBefore(true)}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            triedBefore === true
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => setTriedBefore(false)}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            triedBefore === false
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}

// Step 3: Reasons for changing
function Step3({ reasons, toggleReason }: { reasons: string[]; toggleReason: (reason: string) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        ❤️ Your "why" is powerful
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Why do you want to change your drinking habits?
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Select all that apply — we'll remind you of these reasons when you need it most
      </p>

      <div className="space-y-3">
        {CHANGE_REASONS.map((reason) => (
          <button
            key={reason}
            onClick={() => toggleReason(reason)}
            className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
              reasons.includes(reason)
                ? 'bg-primary text-white'
                : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
            }`}
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  )
}

// Step 4: Relationship with alcohol goal
function Step4({ goal, setGoal }: { goal: string; setGoal: (val: AlcoholGoalType) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        🌱 Define your path forward
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        How do you want to change your relationship with alcohol?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        Whatever you choose, Reframe will support you. You can always adjust your goal as you progress.
      </p>

      <div className="space-y-3">
        <button
          onClick={() => setGoal('quit')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            goal === 'quit'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          I want to quit drinking
        </button>
        <button
          onClick={() => setGoal('cut_back')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            goal === 'cut_back'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          I want to cut back on drinking
        </button>
        <button
          onClick={() => setGoal('stay_sober')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            goal === 'stay_sober'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Continue staying sober
        </button>
        <button
          onClick={() => setGoal('not_sure')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            goal === 'not_sure'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          I'm not sure yet
        </button>
      </div>
    </div>
  )
}

// Step 5: Regret frequency
function Step5({ frequency, setFrequency }: { frequency: string; setFrequency: (val: RegretFrequencyType) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        🧠 Understanding your feelings
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        After consuming a drink how often do you feel regret?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        Your honesty here helps us provide the right support. You're in a judgment-free zone.
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
          onClick={() => setFrequency('somewhat_often')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            frequency === 'somewhat_often'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Somewhat Often
        </button>
        <button
          onClick={() => setFrequency('never')}
          className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
            frequency === 'never'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-primary'
          }`}
        >
          Never
        </button>
      </div>
    </div>
  )
}


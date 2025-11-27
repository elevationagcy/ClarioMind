'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { REFERRAL_SOURCES } from '@/lib/constants/onboarding'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function IntroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [referralSource, setReferralSource] = useState('')
  const [loading, setLoading] = useState(false)
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
      
      if (user && referralSource) {
        await supabase
          .from('user_profiles')
          .update({ referral_source: referralSource })
          .eq('user_id', user.id)
      }

      router.push('/onboarding/demographics')
    } catch (error) {
      console.error('Error saving referral source:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col">
      {/* Header */}
      <div className="p-6">
        {step > 1 && (
          <button onClick={handleBack} className="text-gray-800">
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <Progress value={step} max={totalSteps} className="bg-orange-200" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 referralSource={referralSource} setReferralSource={setReferralSource} />}
        {step === 3 && <Step5 />}
      </div>

      {/* Next button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full bg-primary text-white hover:bg-primary-dark"
          disabled={step === 2 && !referralSource || loading}
        >
          {step === totalSteps ? (loading ? 'Loading...' : 'Start customizing my plan') : 'Next'}
        </Button>
      </div>
    </div>
  )
}

// Step 1: Reframe Works. Period.
function Step1() {
  return (
    <div className="text-center text-gray-900">
      <h1 className="text-4xl font-bold mb-4">
        Reframe Works.<br />Period.
      </h1>
      
      <p className="text-lg text-primary font-semibold mb-8">
        💪 You're taking the first step toward a healthier you!
      </p>

      {/* Earth Lottie Animation */}
      <div className="my-12 relative h-48 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/f38cb803-24f4-498a-b24f-587078bfdfd2/BBZKJ20M6D.lottie"
          loop
          autoplay
          style={{ height: '200px', width: '100%' }}
        />
      </div>

      <p className="text-xl leading-relaxed mb-6">
        We are helping <span className="font-bold">2,000,000+ users</span><br />
        to build healthier drinking habits<br />
        in over <span className="font-bold">84 countries</span>
      </p>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
        <p className="text-sm text-gray-700">
          ✨ <strong>You're not alone.</strong> Thousands of people just like you have transformed their lives with Reframe.
        </p>
      </div>
    </div>
  )
}

// Step 2: How did you hear about us?
function Step2({ referralSource, setReferralSource }: { referralSource: string; setReferralSource: (val: string) => void }) {
  return (
    <div className="text-gray-900">
      <h2 className="text-3xl font-bold mb-3">
        How did you hear about us?
      </h2>
      
      <p className="text-gray-600 mb-8">
        🌟 We're curious to know what brought you here today!
      </p>

      <div className="space-y-3">
        {REFERRAL_SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => setReferralSource(source)}
            className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
              referralSource === source
                ? 'bg-primary text-white'
                : 'bg-white text-gray-900 hover:bg-orange-100 border border-gray-200'
            }`}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  )
}

// Step 5: Stats and creating plan
function Step5() {
  return (
    <div className="text-gray-900">
      <p className="text-lg text-primary font-semibold mb-4 text-center">
        🚀 Ready to see real results?
      </p>
      
      <h2 className="text-2xl font-bold mb-8 leading-tight text-center">
        Reframers noted a 70% decrease in their drinking after 3 months of using the app.
      </h2>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 text-gray-900 mb-6">
        <div className="relative h-64 flex items-center justify-center">
          <img
            src="/assets/graph.png"
            alt="Usage stats graph"
            className="max-h-full max-w-full object-contain"
          />
        </div>

      </div>

      <p className="text-xs text-center text-gray-600 mb-6">
        *Note that this data is based on an estimate of 600k<br />
        Reframe users
      </p>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mb-6">
        <p className="text-center text-gray-700">
          ✨ <strong>Your story could be next.</strong> These results are real people, just like you, who decided to take action.
        </p>
      </div>

      <p className="text-center text-lg font-semibold">
        Creating your personalized plan...
      </p>
    </div>
  )
}


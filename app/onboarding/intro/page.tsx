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
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
        {step === 5 && <Step5 />}
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

// Step 3: You're in the right place
function Step3() {
  return (
    <div className="text-gray-900">
      <h2 className="text-3xl font-bold mb-3">
        You're in the right place.
      </h2>
      
      <p className="text-lg text-primary font-semibold mb-8">
        🎯 Great choice! Let us show you what makes Reframe different.
      </p>
      
      <div className="my-12 flex items-center justify-center">
        <img
          src="/assets/venn-diagram.png"
          alt="Reframe Approach Illustration"
          className="max-h-80 w-auto"
        />
      </div>

      <p className="text-center text-lg mb-4">
        Reframe is the only platform that brings together<br />
        a scientific evidence-based change program,<br />
        personalized tools, and a supportive community.
      </p>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mt-6">
        <p className="text-sm text-gray-700 text-center">
          💡 This isn't about willpower—it's about rewiring your brain for lasting change.
        </p>
      </div>
    </div>
  )
}

// Step 4: Program preview
function Step4() {
  return (
    <div className="text-gray-900">
      <h2 className="text-2xl font-bold mb-3">
        Here's what your daily experience looks like
      </h2>
      
      <p className="text-gray-600 mb-8">
        📱 Small, achievable tasks that fit into your daily routine
      </p>

      {/* Preview card */}
      <div className="bg-white rounded-2xl p-6 text-gray-900">
        <div className="flex items-center justify-between mb-4">
          <button className="text-gray-400">←</button>
          <span className="font-semibold">Day 26</span>
          <button className="text-gray-400">→</button>
        </div>

        {/* Streak illustration */}
        <div className="bg-gradient-to-b from-blue-100 to-green-100 rounded-xl p-6 mb-6 text-center">
          <p className="text-sm text-gray-600 mb-2">Keep up the good work!</p>
          <p className="text-2xl font-bold">7 Day Streak</p>
        </div>

        {/* Daily tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Daily Tasks</span>
            <span className="text-sm text-gray-500">1/4</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full mb-4">
            <div className="h-2 bg-primary rounded-full" style={{ width: '25%' }} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-200 rounded-full mr-3 flex items-center justify-center">📚</div>
              <div className="flex-1">
                <p className="font-medium text-sm">Alcohol, Dopamine, and the Hedonic Set Point</p>
                <p className="text-xs text-gray-500">⏱ 3 min read</p>
              </div>
              <div className="text-green-500">✓</div>
            </div>

            <div className="flex items-center p-3 bg-white shadow-md rounded-xl border-2 border-primary">
              <div className="w-10 h-10 bg-yellow-200 rounded-full mr-3 flex items-center justify-center">☀️</div>
              <div className="flex-1">
                <p className="font-medium text-sm">Urge Surfing Exercise</p>
                <p className="text-xs text-gray-500">⏱ 2 mins</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-xl opacity-50">
              <div className="w-10 h-10 bg-purple-200 rounded-full mr-3 flex items-center justify-center">🧠</div>
              <div className="flex-1">
                <p className="font-medium text-sm">Log Your Stress</p>
                <p className="text-xs text-gray-500">⏱ 1 min</p>
              </div>
              <div className="text-gray-400">🔒</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mt-8">
        <p className="text-center font-semibold text-gray-900 mb-2">
          🎉 Reframe has 100+ research-backed tools designed for you to succeed!
        </p>
        <p className="text-sm text-gray-600 text-center">
          Each day brings new insights and practical exercises tailored to your journey.
        </p>
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


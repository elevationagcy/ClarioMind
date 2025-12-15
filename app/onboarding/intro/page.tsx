'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Sparkles, ArrowRight, Loader2 } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { REFERRAL_SOURCES } from '@/lib/constants/onboarding'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
          </button>
            ) : (
              <div className="w-8" />
        )}
            <Logo size="sm" />
            <div className="w-8" />
      </div>

          <OnboardingProgress currentPage="intro" currentStep={step} />
      </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 referralSource={referralSource} setReferralSource={setReferralSource} />}
        {step === 3 && <Step5 />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
        <Button
          onClick={handleNext}
          size="lg"
            disabled={(step === 2 && !referralSource) || loading}
            className={`w-full py-6 rounded-xl text-lg font-semibold ${
              (step === 2 && !referralSource) || loading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading...
              </>
            ) : step === totalSteps ? (
              <>
                Start customizing my plan
                <ArrowRight className="ml-2 w-5 h-5" />
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

function Step1() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700 font-medium">You're taking the first step</span>
      </div>

      <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4 leading-tight">
        ClarioMind Works.
        <span className="block text-blue-600">Period.</span>
      </h1>
      
      <div className="my-8 relative h-48 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/f38cb803-24f4-498a-b24f-587078bfdfd2/BBZKJ20M6D.lottie"
          loop
          autoplay
          style={{ height: '200px', width: '100%' }}
        />
      </div>

      <p className="text-xl text-slate-600 leading-relaxed mb-6">
        We are helping <span className="font-bold text-slate-800">thousands of professionals</span><br />
        transform their drinking habits<br />
        with <span className="font-bold text-blue-600">neuroscience</span>
      </p>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <p className="text-sm text-slate-600">
          <span className="text-blue-600">✨</span> <strong className="text-slate-800">You're not alone.</strong> Thousands of professionals just like you have transformed their lives with ClarioMind.
        </p>
      </div>
    </div>
  )
}

function Step2({ referralSource, setReferralSource }: { referralSource: string; setReferralSource: (val: string) => void }) {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
        How did you hear about us?
      </h2>
        <p className="text-slate-500">
          We're curious to know what brought you here today!
      </p>
      </div>

      <div className="space-y-3">
        {REFERRAL_SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => setReferralSource(source)}
            className={`w-full p-4 rounded-2xl text-left font-medium transition-all border-2 ${
              referralSource === source
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
            }`}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  )
}

function Step5() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700 font-medium">Ready to see real results?</span>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 mb-8">
        <span className="text-blue-600">80%</span> of ClarioMind users noted a decrease in alcohol use within 2 months.
      </h2>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
        <div className="relative h-48 flex items-center justify-center">
          <img
            src="/assets/graph.png"
            alt="Usage stats graph"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6">
        *Based on user surveys and self-reported data
      </p>
      
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-6">
        <p className="text-slate-600">
          <span className="text-blue-600">✨</span> <strong className="text-slate-800">Your story could be next.</strong> These results are from real professionals, just like you, who decided to take action.
        </p>
      </div>

      <p className="text-lg font-semibold text-slate-600 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        Creating your personalized plan...
      </p>
    </div>
  )
}

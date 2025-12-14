'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Shield, Star } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'

export default function PlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('there')
  const [goals, setGoals] = useState<string[]>([])

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(' ')[0])
        }

        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('alcohol_relationship_goal, reasons')
          .eq('user_id', user.id)
          .single()

        if (goalsData) {
          const userGoals: string[] = []
          
          if (goalsData.alcohol_relationship_goal === 'quit') {
            userGoals.push('Continue your alcohol-free journey')
          } else if (goalsData.alcohol_relationship_goal === 'cut_back') {
            userGoals.push('Cut back on drinking')
          } else if (goalsData.alcohol_relationship_goal === 'stay_sober') {
            userGoals.push('Stay sober')
          }

          if (goalsData.reasons && goalsData.reasons.length > 0) {
            userGoals.push(goalsData.reasons[0])
            if (goalsData.reasons.length > 1) {
              userGoals.push(goalsData.reasons[1])
            }
          }

          setGoals(userGoals.slice(0, 3))
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/summary')
  }

  const handleContinue = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('user_profiles')
          .update({ completed_onboarding: true })
          .eq('user_id', user.id)

        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            lesson_id: null,
            current_day: 1,
            current_streak: 0,
            longest_streak: 0,
            completed: false,
          })

        router.push('/tutorial')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Neuroscience-based behavior change program',
    'Daily exercises to build great habits',
    'Evidence-based tools, meditations, breathing exercises',
    'A supportive community to inspire & answer questions',
    'A Thrive Coach to provide additional support'
  ]

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
          <OnboardingProgress currentPage="plan" currentStep={1} />
        </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full overflow-y-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          <span className="text-blue-600">{userName}'s</span> Plan
        </h1>

        {/* Goals Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-800">
              With our customized plan, we'll help you:
            </h2>
          </div>
          <p className="text-slate-500 text-sm mb-4">(Based on your goals)</p>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium text-blue-700">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promise */}
        <div className="bg-blue-600 rounded-2xl p-6 text-center text-white mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5" />
            <p className="text-lg font-bold">Our promise is simple.</p>
          </div>
          <p className="text-xl font-bold">
            See results or 200% money back.
          </p>
        </div>

        {/* How you'll get there */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            How you will get there with us:
          </h2>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-slate-600">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button
            onClick={handleContinue}
            size="lg"
            disabled={loading}
            className="w-full py-6 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading...
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

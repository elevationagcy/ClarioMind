'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check } from 'lucide-react'
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
        // Get user name from metadata
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name.split(' ')[0])
        }

        // Get user goals
        const { data: goalsData } = await supabase
          .from('user_goals')
          .select('alcohol_relationship_goal, reasons')
          .eq('user_id', user.id)
          .single()

        if (goalsData) {
          const userGoals: string[] = []
          
          // Convert goal to text
          if (goalsData.alcohol_relationship_goal === 'quit') {
            userGoals.push('Continue your alcohol-free journey')
          } else if (goalsData.alcohol_relationship_goal === 'cut_back') {
            userGoals.push('Cut back on drinking')
          } else if (goalsData.alcohol_relationship_goal === 'stay_sober') {
            userGoals.push('Stay sober')
          }

          // Add top reasons
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

  const handleContinue = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Mark onboarding as complete
        await supabase
          .from('user_profiles')
          .update({ completed_onboarding: true })
          .eq('user_id', user.id)

        // Initialize user progress
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <button onClick={() => router.back()} className="text-primary mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Global Onboarding Progress */}
        <OnboardingProgress currentPage="plan" currentStep={1} />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {userName}'s Plan
        </h1>

        {/* Goals Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-2">
            With our customized plan, we'll help you:
          </h2>
          <p className="text-gray-600 text-sm mb-4">(Based on your goals)</p>

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="bg-secondary rounded-xl p-4 text-primary font-medium">
                {goal}
              </div>
            ))}
          </div>
        </div>

        {/* Promise */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 mb-8 text-white text-center">
          <p className="text-lg font-bold">
            Our promise is simple.<br />
            See results or 200% money back.
          </p>
        </div>

        {/* How you'll get there */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            How you will get there with us:
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                Neuroscience-based behavior change program
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                Daily exercises to build great habits
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                Evidence-based tools, meditations, breathing exercises and more
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                A supportive community to inspire & answer questions
              </p>
            </div>

            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-700">
                A Thrive Coach to provide you with additional support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="p-6 bg-white shadow-lg">
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}


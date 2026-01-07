'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, DollarSign, Flame, Moon, Loader2, TrendingUp } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { createClient } from '@/lib/supabase/client'
import { calculateYearlySavings, calculateCaloriesSaved, calculateREMCycles, formatCurrency, formatNumber } from '@/lib/utils/calculations'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'

export default function SummaryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [drinksPerWeek, setDrinksPerWeek] = useState(0)
  const [spendPerWeek, setSpendPerWeek] = useState(0)
  const [yearlySavings, setYearlySavings] = useState(0)
  const [caloriesSaved, setCaloriesSaved] = useState(0)
  const [remCycles, setRemCycles] = useState(0)

  useEffect(() => {
    loadPatterns()
  }, [])

  const loadPatterns = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('drinking_patterns')
          .select('drinks_per_week, spend_per_week')
          .eq('user_id', user.id)
          .single()

        if (data) {
          const drinks = data.drinks_per_week || 0
          const spend = data.spend_per_week || 0
          
          setDrinksPerWeek(drinks)
          setSpendPerWeek(spend)
          setYearlySavings(calculateYearlySavings(spend))
          setCaloriesSaved(calculateCaloriesSaved(drinks))
          setRemCycles(calculateREMCycles(drinks))
        }
      }
    } catch (error) {
      console.error('Error loading patterns:', error)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/patterns')
  }

  const handleNext = () => {
    setLoading(true)
        router.push('/onboarding/plan')
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
            <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity">
              <Logo size="sm" />
            </button>
            <div className="w-8" />
      </div>
          <OnboardingProgress currentPage="summary" currentStep={1} />
      </div>
      </header>

      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-4">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Your potential transformation</span>
      </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            Here's what you could achieve
      </h2>
          <p className="text-slate-500">
            Based on your patterns and a 70% reduction
          </p>
    </div>

        <div className="space-y-4 mb-8">
        {/* Savings Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mr-4 border border-green-100">
                <DollarSign className="w-7 h-7 text-green-600" />
            </div>
            <div className="flex-1">
                <p className="text-slate-500 text-sm mb-1">Potential yearly savings</p>
                <p className="text-4xl font-bold text-green-600">
                  {formatCurrency(yearlySavings)}
              </p>
            </div>
          </div>
        </div>

        {/* Calories Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start">
              <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mr-4 border border-orange-100">
                <Flame className="w-7 h-7 text-orange-600" />
            </div>
            <div className="flex-1">
                <p className="text-slate-500 text-sm mb-1">Calories saved per year</p>
                <p className="text-4xl font-bold text-orange-600">
                  {formatNumber(caloriesSaved)}
              </p>
            </div>
          </div>
        </div>

        {/* REM Cycles Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mr-4 border border-purple-100">
                <Moon className="w-7 h-7 text-purple-600" />
            </div>
            <div className="flex-1">
                <p className="text-slate-500 text-sm mb-1">Additional REM cycles per year</p>
                <p className="text-4xl font-bold text-purple-600">
                {formatNumber(remCycles)}
              </p>
            </div>
          </div>
        </div>
      </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-600 text-center mb-2">
            <span className="text-blue-600">🎉</span> <strong className="text-slate-800">Exciting, isn't it?</strong> Thousands of professionals have achieved these results — and you can too!
        </p>
          <p className="text-xs text-slate-400 text-center">
            These projections are based on average outcomes. Individual results may vary.
        </p>
      </div>
      </main>

      <footer className="bg-white border-t border-slate-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button
            onClick={handleNext}
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
                See my plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  )
}

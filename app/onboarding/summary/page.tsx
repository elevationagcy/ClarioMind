'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, DollarSign, Flame, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calculateYearlySavings, calculateCaloriesSaved, calculateREMCycles, formatCurrency, formatNumber } from '@/lib/utils/calculations'
import type { DrinkIntentionFrequencyType } from '@/types'

export default function SummaryPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [drinkMoreThanIntended, setDrinkMoreThanIntended] = useState<DrinkIntentionFrequencyType | ''>('')
  
  // Calculated values
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

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.back()
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Update drinking patterns with drink_more_than_intended
        await supabase
          .from('drinking_patterns')
          .update({ drink_more_than_intended: drinkMoreThanIntended as DrinkIntentionFrequencyType })
          .eq('user_id', user.id)

        router.push('/onboarding/plan')
      }
    } catch (error) {
      console.error('Error completing summary:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col">
      {/* Header */}
      <div className="p-6">
        <button onClick={handleBack} className="text-gray-900 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {step === 1 && <Step1 frequency={drinkMoreThanIntended} setFrequency={setDrinkMoreThanIntended} />}
        {step === 2 && <Step2 savings={yearlySavings} calories={caloriesSaved} remCycles={remCycles} />}
      </div>

      {/* Next button */}
      <div className="p-6 bg-white shadow-lg">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full"
          disabled={(step === 1 && !drinkMoreThanIntended) || loading}
        >
          {step === 2 ? (loading ? 'Loading...' : 'See my plan') : 'Next'}
        </Button>
      </div>
    </div>
  )
}

// Step 1: Drink more than intended
function Step1({ frequency, setFrequency }: { frequency: string; setFrequency: (val: DrinkIntentionFrequencyType) => void }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3">
        🎯 One final question
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        How often do you drink more than you intended to?
      </h2>
      
      <p className="text-sm text-gray-600 mb-8">
        This is a common experience. We'll help you regain control and stick to your goals.
      </p>

      <div className="space-y-3">
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

// Step 2: Summary with calculations
function Step2({ savings, calories, remCycles }: { savings: number; calories: number; remCycles: number }) {
  return (
    <div>
      <p className="text-primary font-semibold mb-3 text-center">
        ✨ Your potential transformation
      </p>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        Here's what you could achieve with Reframe
      </h2>
      <p className="text-gray-600 mb-8 text-center">
        Based on your drinking patterns and a 70% reduction — imagine what this could mean for your life!
      </p>

      <div className="space-y-4">
        {/* Savings Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Potential yearly savings</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(savings)}
              </p>
            </div>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Calories saved per year</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(calories)}
              </p>
            </div>
          </div>
        </div>

        {/* REM Cycles Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <Moon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Additional REM cycles per year</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(remCycles)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 mt-8">
        <p className="text-sm text-gray-700 text-center mb-3">
          🎉 <strong>Exciting, isn't it?</strong> Thousands of users have achieved these results — and you can too!
        </p>
        <p className="text-xs text-gray-600 text-center">
          These projections are based on average outcomes from Reframe users. Individual results may vary.
        </p>
      </div>
    </div>
  )
}


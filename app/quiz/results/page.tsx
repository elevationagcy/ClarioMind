'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Shield, Mail, Loader2, CheckCircle2, AlertCircle, Sparkles, Lock } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { calculateQuizResult, QuizResult } from '@/lib/utils/quiz-scoring'

export default function QuizResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedAnswers = localStorage.getItem('quizAnswers')
    if (storedAnswers) {
      const answers = JSON.parse(storedAnswers)
      const calculatedResult = calculateQuizResult(answers)
      setResult(calculatedResult)
      setTimeout(() => setShowEmailForm(true), 1500)
    } else {
      router.push('/quiz')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')
    localStorage.setItem('quizEmail', email)
    router.push('/quiz/checkout')
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return { 
          color: 'text-green-600', 
          bg: 'bg-green-50',
          border: 'border-green-200',
          barColor: 'bg-green-500'
        }
      case 'moderate':
        return { 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          barColor: 'bg-yellow-500'
        }
      case 'elevated':
        return { 
          color: 'text-orange-600', 
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          barColor: 'bg-orange-500'
        }
      case 'high':
        return { 
          color: 'text-red-600', 
          bg: 'bg-red-50',
          border: 'border-red-200',
          barColor: 'bg-red-500'
        }
      default:
        return { 
          color: 'text-blue-600', 
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          barColor: 'bg-blue-500'
        }
    }
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    )
  }

  const levelConfig = getLevelConfig(result.level)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/quiz')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">Back to quiz</span>
          </button>
          <Logo size="sm" />
          <div className="w-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Result Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-center text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 mb-3">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Assessment Complete</span>
            </div>
            <h1 className="text-2xl font-bold">Your Results</h1>
          </div>
          
          <div className="p-6 sm:p-8">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${levelConfig.bg} border ${levelConfig.border} text-lg font-semibold mb-6`}>
                {result.level === 'low' ? (
                  <CheckCircle2 className={`w-5 h-5 ${levelConfig.color}`} />
                ) : (
                  <AlertCircle className={`w-5 h-5 ${levelConfig.color}`} />
                )}
                <span className={levelConfig.color}>{result.title}</span>
              </div>
              
              {/* Score Bar */}
              <div className="mb-4">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${levelConfig.barColor} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-400">
                  <span>Low</span>
                  <span>Moderate</span>
                  <span>Elevated</span>
                  <span>High</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Your score: <span className="text-slate-700 font-medium">{result.totalScore}</span> / {result.maxScore}
              </p>
            </div>

            {/* Description */}
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
              <p className="text-slate-600 leading-relaxed mb-4">
                {result.description}
              </p>
              <p className={`${levelConfig.color} font-medium`}>
                {result.recommendation}
              </p>
            </div>

            {/* Privacy Note */}
            <div className="flex items-start gap-3 text-sm text-slate-500">
              <Shield className="w-5 h-5 flex-shrink-0 text-blue-600" />
              <p>Your results are completely confidential. We never share your personal information.</p>
            </div>
          </div>
        </div>

        {/* Email Collection Form */}
        <div className={`transition-all duration-700 ${
          showEmailForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Get Your Personalized Recovery Plan
              </h2>
              <p className="text-slate-500">
                Enter your email to receive your detailed results and unlock ClarioMind.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                Continue to ClarioMind
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
              <Lock className="w-3 h-3" />
              <span>By continuing, you agree to our Terms & Privacy Policy</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

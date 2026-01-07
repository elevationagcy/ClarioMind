'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ArrowRight, Shield, Mail, Loader2, Sparkles, Lock, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
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

  if (!result) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'low':
        return { 
          label: 'Healthy',
          color: 'text-[#10B981]', 
          bg: 'bg-[#10B981]/10',
          border: 'border-[#10B981]/20',
          icon: <CheckCircle2 className="text-[#10B981] w-5 h-5" />,
          segmentColor: '#10B981',
          shadow: 'rgba(16, 185, 129, 0.4)'
        }
      case 'moderate':
        return { 
          label: 'Low Risk',
          color: 'text-[#84CC16]', 
          bg: 'bg-[#84CC16]/10',
          border: 'border-[#84CC16]/20',
          icon: <AlertTriangle className="text-[#84CC16] w-5 h-5" />,
          segmentColor: '#84CC16',
          shadow: 'rgba(132, 204, 22, 0.4)'
        }
      case 'elevated':
        return { 
          label: 'Moderate',
          color: 'text-[#F59E0B]', 
          bg: 'bg-[#F59E0B]/10',
          border: 'border-[#F59E0B]/20',
          icon: <AlertTriangle className="text-[#F59E0B] w-5 h-5" />,
          segmentColor: '#F59E0B',
          shadow: 'rgba(245, 158, 11, 0.4)'
        }
      case 'high':
        return { 
          label: 'High Risk',
          color: 'text-[#EF4444]', 
          bg: 'bg-[#EF4444]/10',
          border: 'border-[#EF4444]/20',
          icon: <AlertTriangle className="text-[#EF4444] w-5 h-5" />,
          segmentColor: '#EF4444',
          shadow: 'rgba(239, 68, 68, 0.4)'
        }
      default:
        return { 
          label: 'Assessment',
          color: 'text-blue-500', 
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: <Info className="text-blue-500 w-5 h-5" />,
          segmentColor: '#3B82F6',
          shadow: 'rgba(59, 130, 246, 0.4)'
        }
    }
  }

  const levelConfig = getLevelConfig(result.level)

  return (
    <div className="min-h-screen bg-[#F0F5FA] font-sans antialiased text-gray-800 flex flex-col transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <button
          onClick={() => router.push('/quiz')}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-1">
          <Logo size="md" />
        </div>
        <div className="w-8"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full space-y-6">
        {/* Assessment Complete Card */}
        <div className="bg-blue-600 rounded-xl p-6 text-center text-white shadow-lg relative overflow-hidden lg:p-8">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-300 opacity-20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3 border border-white/30">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Assessment Complete
            </div>
            <h1 className="text-2xl font-bold mb-1">Your Results</h1>
            <p className="text-blue-100 text-sm">Based on your recent answers</p>
          </div>
        </div>

        {/* Meter Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-center mb-8">
            <div className={`px-5 py-2 ${levelConfig.bg} border ${levelConfig.border} rounded-full flex items-center gap-2`}>
              {levelConfig.icon}
              <span className={`${levelConfig.color} font-bold text-lg`}>{levelConfig.label}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-4 relative">
            <div className="relative w-[280px] h-[280px] rounded-full flex items-center justify-center mb-6">
              {/* Background ring */}
              <div className="absolute inset-0 border-[20px] border-white/5 rounded-full"></div>
              
              {/* Progress ring with gradient - green (low risk) to red (high risk) */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-1000 ease-out" 
                style={{
                  background: 'conic-gradient(from 180deg, #10B981 0%, #84CC16 25%, #F59E0B 50%, #F97316 75%, #EF4444 100%)',
                  mask: `radial-gradient(farthest-side, transparent calc(100% - 20px), #000 calc(100% - 20px + 1px))`,
                  WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - 20px), #000 calc(100% - 20px + 1px))`,
                }}
              >
                {/* Mask to show only the percentage filled */}
                <div 
                  className="absolute inset-[-1px] rounded-full bg-gray-100" 
                  style={{
                    mask: `conic-gradient(from 180deg, transparent 0%, transparent ${result.percentage}%, black ${result.percentage}%, black 100%)`,
                    WebkitMask: `conic-gradient(from 180deg, transparent 0%, transparent ${result.percentage}%, black ${result.percentage}%, black 100%)`,
                  }}
                />
              </div>

              {/* Text in middle */}
              <div className="relative z-20 flex flex-col items-center justify-center text-center">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">Risk Level</p>
                <p className={`text-3xl font-extrabold ${levelConfig.color} drop-shadow-md`}>{result.title}</p>
                <p className="text-xs text-gray-400 mt-1">Current Assessment</p>
              </div>
            </div>

            {/* Labels under meter */}
            <div className="relative w-full grid grid-cols-5 text-center text-[10px] font-medium -mt-4 px-2">
              <p className="text-[#10B981]">Healthy</p>
              <p className="text-[#84CC16]">Low</p>
              <p className="text-[#F59E0B]">Moderate</p>
              <p className="text-[#F97316]">Elevated</p>
              <p className="text-[#EF4444]">High<br/>Risk</p>
            </div>
          </div>

          <div className="text-center mt-6 border-t border-gray-100 pt-4">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Risk Score</p>
            <div className="text-3xl font-bold text-gray-900 flex items-baseline justify-center gap-1">
              {result.percentage} <span className="text-lg text-gray-400 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Higher scores indicate higher risk</p>
          </div>
        </div>

        {/* Analysis Card */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
            <Info className="w-4 h-4 text-blue-600 mr-2" />
            Analysis
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {result.description}
          </p>
          <div className="mt-4 pt-4 border-t border-blue-100">
            <p className="text-sm font-medium text-blue-600">
              {result.recommendation}
            </p>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 px-2">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-500 leading-tight">
            Your results are completely confidential. We adhere to strict privacy standards and never share your personal information.
          </p>
        </div>

        {/* Email Form */}
        <div className={`transition-all duration-700 ${showEmailForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Get Your Personalized Plan
              </h2>
              <p className="text-sm text-gray-600">
                Enter your email to receive your detailed results and unlock your path to recovery.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-xl text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                See My Personalized Plan
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-500">
              <Lock className="w-3 h-3" />
              <span>Confidential & Secure Assessment</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

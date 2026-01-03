'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, X, Check, Brain, Clock, Activity, Target, Users, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { quizQuestions } from '@/lib/utils/quiz-scoring'

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  useEffect(() => {
    if (answers[question.id] !== undefined) {
      const answerIndex = question.options.findIndex(opt => opt.value === answers[question.id])
      setSelectedOption(answerIndex)
    } else {
      setSelectedOption(null)
    }
  }, [currentQuestion, answers, question])

  const handleSelectOption = (index: number) => {
    setSelectedOption(index)
  }

  const handleNext = () => {
    if (selectedOption === null) return

    const newAnswers = {
      ...answers,
      [question.id]: question.options[selectedOption].value
    }
    setAnswers(newAnswers)

    if (isLastQuestion) {
      localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
      router.push('/quiz/results')
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1)
        setIsAnimating(false)
      }, 200)
    } else {
      router.push('/welcome')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'demographics': return <Users className="w-10 h-10 text-blue-500" />
      case 'frequency': return <Clock className="w-10 h-10 text-blue-500" />
      case 'control': return <Target className="w-10 h-10 text-blue-500" />
      case 'impact': return <Activity className="w-10 h-10 text-blue-500" />
      case 'dependency': return <Brain className="w-10 h-10 text-blue-500" />
      default: return <Sparkles className="w-10 h-10 text-blue-500" />
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#1E293B] flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Background blobs - subtle */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] rounded-full bg-blue-50/50 blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[30%] rounded-full bg-indigo-50/50 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 px-6 py-4 bg-white/90 backdrop-blur-sm">
        <div className="max-w-md mx-auto w-full flex items-center justify-between mb-4">
          <button 
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-slate-500 hover:text-blue-500 transition-all active:scale-95 border border-slate-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>

          <button 
            onClick={() => router.push('/welcome')}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-slate-500 hover:text-red-500 transition-all active:scale-95 border border-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-md mx-auto w-full px-1">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-8 pb-32 px-6 max-w-md mx-auto w-full z-10">
        <div className={`w-full transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="w-full flex justify-center mb-10">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-[#EEF2FF] flex items-center justify-center shadow-sm transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                {getCategoryIcon(question.category)}
              </div>
            </div>
          </div>

          <h1 className="text-[28px] font-extrabold text-center mb-3 text-slate-900 leading-tight">
            {question.question}
          </h1>

          {question.description && (
            <p className="text-center text-slate-500 mb-10 text-[15px] leading-relaxed max-w-[280px] mx-auto">
              {question.description}
            </p>
          )}

          <div className="w-full space-y-3.5">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`group relative w-full flex items-center p-4 bg-white rounded-[20px] border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-slate-100 hover:border-blue-100 shadow-sm'
                }`}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mr-4 transition-all ${
                  selectedOption === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#F0F7FF] text-blue-600'
                }`}>
                  <span className="font-bold text-base">{String.fromCharCode(65 + index)}</span>
                </div>
                
                <div className="flex-grow text-left">
                  <span className={`block text-[17px] font-semibold ${
                    selectedOption === index 
                      ? 'text-blue-600' 
                      : 'text-slate-700'
                  }`}>
                    {option.text}
                  </span>
                </div>

                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-200'
                }`}>
                  <Check className={`w-4 h-4 text-white transition-opacity duration-200 ${
                    selectedOption === index ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white z-20">
        <div className="max-w-md mx-auto w-full">
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full py-7 rounded-2xl text-lg font-bold flex items-center justify-center transition-all active:scale-[0.98] group ${
              selectedOption !== null
                ? 'bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'See My Results' : 'Continue'}
            <ChevronLeft className="ml-2 w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  )
}

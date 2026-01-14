'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, X, Check, Brain, Clock, Activity, Target, Users, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { quizQuestions } from '@/lib/utils/quiz-scoring'

// Track Meta Pixel events
const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, params);
  }
};

const trackCustomEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, params);
  }
};

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const isLastQuestion = currentQuestion === quizQuestions.length - 1

  // Track ViewContent and Quiz Started on first load
  useEffect(() => {
    trackEvent('ViewContent', { content_name: 'Quiz Page' });
    // Also fire QuizStarted custom event when quiz page loads
    trackCustomEvent('QuizStarted', { total_questions: quizQuestions.length });
  }, []);

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
      // Track Quiz Completed
      trackEvent('CompleteRegistration', { content_name: 'Quiz Completed' });
      trackCustomEvent('QuizCompleted', { 
        total_questions: quizQuestions.length 
      });
      router.push('/quiz/results')
    } else {
      // Track Quiz Progress
      trackCustomEvent('QuizProgress', { 
        question_number: currentQuestion + 1,
        total_questions: quizQuestions.length,
        progress_percentage: Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)
      });
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
    <div className="min-h-screen h-screen bg-white font-sans text-[#1E293B] flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Background blobs - subtle */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[40%] rounded-full bg-blue-50/50 blur-3xl"></div>
        <div className="absolute top-[40%] -left-[10%] w-[40%] h-[30%] rounded-full bg-indigo-50/50 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-md lg:max-w-xl xl:max-w-2xl mx-auto w-full flex items-center justify-between mb-3 sm:mb-4">
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

        <div className="max-w-md lg:max-w-xl xl:max-w-2xl mx-auto w-full px-1">
          <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center pt-4 lg:pt-6 xl:pt-8 pb-20 sm:pb-24 lg:pb-28 px-4 lg:px-6 max-w-md lg:max-w-xl xl:max-w-2xl mx-auto w-full z-10">
        <div className={`w-full transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="w-full flex justify-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-20 lg:h-20 xl:w-20 xl:h-20 rounded-3xl bg-[#EEF2FF] flex items-center justify-center shadow-sm transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <div className="scale-90 sm:scale-100 lg:scale-95 xl:scale-95">
                  {getCategoryIcon(question.category)}
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-[24px] sm:text-[28px] lg:text-[26px] xl:text-[26px] font-extrabold text-center mb-2 sm:mb-3 text-slate-900 leading-tight px-2">
            {question.question}
          </h1>

          {question.description && (
            <p className="text-center text-slate-500 mb-6 sm:mb-8 lg:mb-10 xl:mb-12 text-[14px] sm:text-[15px] lg:text-[16px] xl:text-[17px] leading-relaxed max-w-[260px] sm:max-w-[280px] lg:max-w-[570px] xl:max-w-[665px] mx-auto px-2">
              {question.description}
            </p>
          )}

          <div className="w-full px-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-3.5 lg:gap-3 xl:gap-3.5">
              {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`group relative w-full flex items-center p-3 sm:p-4 lg:p-3 xl:p-3 bg-white rounded-[18px] sm:rounded-[20px] lg:rounded-[18px] xl:rounded-[18px] border-2 transition-all duration-200 ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-slate-100 hover:border-blue-100 shadow-sm'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 lg:w-10 lg:h-10 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center mr-3 sm:mr-4 lg:mr-3 xl:mr-3 transition-all ${
                  selectedOption === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#F0F7FF] text-blue-600'
                }`}>
                  <span className="font-bold text-sm sm:text-base lg:text-lg">{String.fromCharCode(65 + index)}</span>
                </div>

                <div className="flex-grow text-left">
                  <span className={`block text-[16px] sm:text-[17px] lg:text-[16px] xl:text-[16px] font-semibold leading-snug ${
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
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 bg-white z-20">
        <div className="max-w-md lg:max-w-xl xl:max-w-2xl mx-auto w-full">
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full py-6 sm:py-7 lg:py-6 rounded-2xl text-base sm:text-lg lg:text-lg xl:text-lg font-bold flex items-center justify-center transition-all active:scale-[0.98] group ${
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

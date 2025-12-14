'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
            <Logo size="sm" />
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium text-blue-600">{currentQuestion + 1}</span>
              <span className="text-sm text-slate-400">/</span>
              <span className="text-sm text-slate-500">{quizQuestions.length}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
          {/* Question */}
          <div className="text-center mb-10">
            {currentQuestion === 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">Your answers are confidential</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
              {question.question}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 flex items-center justify-between border-2 ${
                  selectedOption === index
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    selectedOption === index
                      ? 'bg-blue-600'
                      : 'bg-slate-100'
                  }`}>
                    {selectedOption === index ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-slate-400">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  <span className={`font-medium text-base sm:text-lg ${
                    selectedOption === index ? 'text-blue-700' : 'text-slate-700'
                  }`}>
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Button
            onClick={handleNext}
            disabled={selectedOption === null}
            className={`w-full py-6 rounded-xl text-lg font-semibold transition-all ${
              selectedOption !== null
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'See My Results' : 'Continue'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { Lesson } from '@/types'
import ReactMarkdown from 'react-markdown'
import { MeditationLesson } from './meditation-lesson'

interface Quiz {
  id: string
  question: string
  options: string[]
  correct_answer: number
  order: number
}

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      loadLesson(params.id as string)
    }
  }, [params.id])

  const loadLesson = async (lessonId: string) => {
    try {
      const supabase = createClient()
      
      // Load lesson
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (lessonData) {
        setLesson(lessonData)
      }

      // Load quizzes for this lesson
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order')

      if (quizData) {
        setQuizzes(quizData)
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (quizId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [quizId]: answerIndex
    }))
  }

  const handleCheckAnswers = () => {
    setShowResults(true)
  }

  const getQuizScore = () => {
    let correct = 0
    quizzes.forEach(quiz => {
      if (selectedAnswers[quiz.id] === quiz.correct_answer) {
        correct++
      }
    })
    return { correct, total: quizzes.length }
  }

  const canComplete = () => {
    if (quizzes.length === 0) return true
    if (!showResults) return false
    const score = getQuizScore()
    return score.correct >= Math.ceil(score.total * 0.7) // Need 70% to pass
  }

  const handleComplete = async () => {
    if (!lesson) return

    setCompleting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Mark lesson as complete
        await supabase
          .from('user_progress')
          .upsert(
            {
              user_id: user.id,
              lesson_id: lesson.id,
              completed: true,
              completed_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id,lesson_id',
            }
          )

        // Update streak and current day
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('current_streak, longest_streak, current_day')
          .eq('user_id', user.id)
          .is('lesson_id', null)
          .single()

        if (progressData) {
          const newStreak = (progressData.current_streak || 0) + 1
          const longestStreak = Math.max(newStreak, progressData.longest_streak || 0)
          const newDay = (progressData.current_day || 0) + 1

          await supabase
            .from('user_progress')
            .update({
              current_streak: newStreak,
              longest_streak: longestStreak,
              current_day: newDay,
            })
            .eq('user_id', user.id)
            .is('lesson_id', null)
        }

        // Invalidate React Query cache to refresh dashboard data
        await queryClient.invalidateQueries({ queryKey: ['lessons'] })
        await queryClient.invalidateQueries({ queryKey: ['user-progress'] })
        await queryClient.invalidateQueries({ queryKey: ['global-progress'] })
        
        // Wait a bit for cache invalidation to complete
        await new Promise(resolve => setTimeout(resolve, 100))

        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
    } finally {
      setCompleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-slate-500">Lesson not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-6 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-slate-800 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-3xl mr-4 relative overflow-hidden border border-blue-100">
            {lesson.icon?.startsWith('http') ? (
              <Image
                src={lesson.icon}
                alt={lesson.title}
                fill
                sizes="64px"
                className="object-contain"
                unoptimized
                onError={(e) => {
                  console.error('Image failed to load:', lesson.icon)
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : lesson.icon?.startsWith('/') ? (
              <Image
                src={lesson.icon}
                alt={lesson.title}
                width={40}
                height={40}
                className="object-contain"
              />
            ) : (
              <span>{lesson.icon || '📖'}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{lesson.title}</h1>
            <p className="text-sm text-slate-500">
              ⏱ {lesson.duration_minutes} min {lesson.category}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-32">
        {/* Lesson Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="prose prose-sm max-w-none text-slate-800">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>
        </div>

        {/* Meditation Player */}
        {lesson.is_meditation && lesson.meditation_audio_url && (
          <div className="mb-6">
            <MeditationLesson
              title={lesson.title}
              audioUrl={lesson.meditation_audio_url}
              duration={lesson.duration_minutes || 10}
            />
          </div>
        )}

        {/* Quizzes */}
        {quizzes.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">
              📝 Check Your Understanding
            </h2>
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {Object.keys(selectedAnswers).length}/{quizzes.length}
              </span>
            </div>
            
            <div className="space-y-6">
              {quizzes.map((quiz, index) => (
                <div key={quiz.id} className="border-b border-slate-100 last:border-b-0 pb-6 last:pb-0">
                  <p className="font-semibold text-slate-800 mb-3">
                    {index + 1}. {quiz.question}
                  </p>
                  
                  <div className="space-y-2">
                    {quiz.options.map((option, optionIndex) => {
                      const isSelected = selectedAnswers[quiz.id] === optionIndex
                      const isCorrect = quiz.correct_answer === optionIndex
                      const showFeedback = showResults
                      
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => !showResults && handleAnswerSelect(quiz.id, optionIndex)}
                          disabled={showResults}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            showFeedback
                              ? isCorrect
                                ? 'border-green-500 bg-green-50 text-slate-800'
                                : isSelected
                                ? 'border-red-500 bg-red-50 text-slate-800'
                                : 'border-slate-200 bg-slate-50 text-slate-800'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50 text-slate-800'
                              : 'border-slate-200 hover:border-blue-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-slate-800">{option}</span>
                            {showFeedback && (
                              <span>
                                {isCorrect ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : isSelected ? (
                                  <span className="text-red-600">✗</span>
                                ) : null}
                              </span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!showResults && Object.keys(selectedAnswers).length === quizzes.length && (
              <Button
                onClick={handleCheckAnswers}
                size="lg"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Check Answers
              </Button>
            )}

            {showResults && (
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-center font-semibold text-slate-800">
                  Score: {getQuizScore().correct} / {getQuizScore().total}
                  {canComplete() ? (
                    <span className="text-green-600 block mt-1">✓ Great job!</span>
                  ) : (
                    <span className="text-amber-600 block mt-1">Review the lesson and try again</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complete Button */}
      <div className="fixed bottom-16 left-0 right-0 p-6 bg-white shadow-lg border-t border-slate-100">
        <Button
          onClick={handleComplete}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={completing || !canComplete()}
        >
          {completing ? 'Completing...' : 'Mark as Complete'}
        </Button>
      </div>
    </div>
  )
}


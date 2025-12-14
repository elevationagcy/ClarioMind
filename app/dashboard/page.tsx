'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Check, Lock, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { fadeInUp, staggerContainer, cardHover, cardTap } from '@/lib/animations'
import { useLessons, useUserProgress, useGlobalProgress } from '@/lib/queries/lessons'
import type { Lesson } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [currentDay, setCurrentDay] = useState(1)
  const [streak, setStreak] = useState(0)

  // Use React Query for data fetching with caching
  const { data: lessons = [], isLoading: lessonsLoading } = useLessons()
  const { data: progressData = [], isLoading: progressLoading } = useUserProgress()
  const { data: globalProgress, isLoading: globalLoading } = useGlobalProgress()

  const loading = lessonsLoading || progressLoading || globalLoading

  // Calculate completed lessons
  const completedLessons = new Set(
    progressData?.filter(p => p.completed && p.lesson_id).map(p => p.lesson_id) || []
  )

  // Update current day and streak from GLOBAL progress
  useEffect(() => {
    if (globalProgress) {
      setCurrentDay(globalProgress.current_day || 1)
      setStreak(globalProgress.current_streak || 0)
    }
  }, [globalProgress])

  const handleLessonClick = (lesson: Lesson, index: number) => {
    // Only allow clicking the first incomplete lesson
    const completedCount = Array.from(completedLessons).length
    if (index <= completedCount) {
      router.push(`/dashboard/lesson/${lesson.id}`)
    }
  }

  const getTotalProgress = () => {
    return completedLessons.size
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
        {/* Header Skeleton */}
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Content Skeleton */}
        <div className="p-6 pb-24">
          {/* Day Nav Skeleton */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            <Skeleton className="w-full h-32 rounded-xl" />
          </div>

          {/* Tasks Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full mb-6" />
            
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center p-4 bg-slate-50 rounded-xl">
                  <Skeleton className="w-16 h-16 rounded-full mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="w-6 h-6 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Header */}
      <div className="p-6">
        <Logo size="md" className="mb-2" />
        <p className="text-sm text-slate-500">
          A neuroscience-based program developed by leading experts
        </p>
      </div>

      {/* Content */}
      <div className="p-6 pb-24">
        {/* Day Navigation */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <span className="font-semibold text-slate-800">Day {currentDay}</span>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Streak Illustration */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-4 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-2 right-4 opacity-30">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            
            <div className="relative text-center">
              <p className="text-sm text-slate-600 mb-2">Keep up the good work!</p>
              <p className="text-3xl font-bold text-blue-600">{streak} Day Streak</p>
            </div>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-slate-800">30-Day Program</h2>
            <span className="text-sm text-blue-600 font-medium">{getTotalProgress()}/30</span>
          </div>
          
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(getTotalProgress() / 30) * 100}%` }}
            />
          </div>

          <motion.div 
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessons.has(lesson.id)
              const isLocked = index > completedLessons.size
              const isActive = index === completedLessons.size

              return (
                <motion.button
                  key={lesson.id}
                  variants={fadeInUp}
                  whileHover={!isLocked ? cardHover : undefined}
                  whileTap={!isLocked ? cardTap : undefined}
                  onClick={() => handleLessonClick(lesson, index)}
                  disabled={isLocked}
                  className={`w-full flex items-center p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white shadow-md border-2 border-blue-500'
                      : isCompleted
                      ? 'bg-slate-50 border border-slate-100'
                      : 'bg-slate-50 border border-slate-100 opacity-60'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 flex-shrink-0 relative overflow-hidden ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isActive 
                        ? 'bg-blue-100' 
                        : isLocked 
                        ? 'bg-slate-100'
                        : 'bg-blue-50'
                    }`}
                  >
                    {lesson.icon?.startsWith('http') ? (
                      <Image
                        src={lesson.icon}
                        alt={lesson.title}
                        fill
                        sizes="64px"
                        className={`object-contain ${isLocked ? 'opacity-40 grayscale' : ''}`}
                        unoptimized
                      />
                    ) : lesson.icon?.startsWith('/') ? (
                      <Image
                        src={lesson.icon}
                        alt={lesson.title}
                        width={56}
                        height={56}
                        className={`object-contain ${isLocked ? 'opacity-40 grayscale' : ''}`}
                      />
                    ) : (
                      <span className={isLocked ? 'opacity-40 grayscale' : ''}>{lesson.icon || '📖'}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Day {lesson.order}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-green-600">✓ Completed</span>
                      )}
                      {isLocked && (
                        <span className="text-xs text-slate-400">🔒 Locked</span>
                      )}
                    </div>
                    <p className={`font-semibold text-sm ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${isLocked ? 'text-slate-400' : 'text-slate-500'}`}>
                        ⏱ {lesson.duration_minutes} min • {lesson.category}
                      </span>
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="ml-3">
                    {isCompleted ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : null}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Footer text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-center text-slate-700 text-sm">
              🎯 <strong>Complete lessons in order</strong> to unlock the next day.<br />
              <span className="text-xs text-slate-500">Each lesson builds on the previous one!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Check, Lock } from 'lucide-react'
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
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
        {/* Header Skeleton */}
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Content Skeleton */}
        <div className="p-6 pb-24">
          {/* Day Nav Skeleton */}
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
            <Skeleton className="w-full h-32 rounded-xl" />
          </div>

          {/* Tasks Skeleton */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full mb-6" />
            
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl">
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
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          A neuroscience-based program
        </h1>
        <p className="text-sm text-gray-600">
          developed by leading experts, customized to your needs.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 pb-24">
        {/* Day Navigation */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <span className="font-semibold text-gray-900">Day {currentDay}</span>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Streak Illustration */}
          <div className="bg-gradient-to-b from-orange-100 via-amber-50 to-yellow-100 rounded-xl p-6 mb-4 relative overflow-hidden">
            {/* Mountain illustration */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path d="M 0 150 L 100 80 L 200 120 L 300 60 L 400 100 L 400 200 L 0 200 Z" fill="#F97316" />
                <path d="M 50 180 L 150 110 L 250 140 L 350 90 L 400 120 L 400 200 L 0 200 Z" fill="#FB923C" />
              </svg>
            </div>
            
            <div className="relative text-center">
              <p className="text-sm text-gray-600 mb-2">Keep up the good work!</p>
              <p className="text-3xl font-bold text-gray-900">{streak} Day Streak</p>
            </div>
          </div>
        </div>

        {/* Daily Tasks */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-900">30-Day Program</h2>
            <span className="text-sm text-gray-500">{getTotalProgress()}/30</span>
          </div>
          
          <Progress value={getTotalProgress()} max={30} className="mb-6" />

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
                  className={`w-full flex items-center p-4 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-white shadow-lg border-2 border-primary'
                      : isCompleted
                      ? 'bg-gray-50'
                      : 'bg-gray-50 opacity-60'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mr-4 flex-shrink-0 relative overflow-hidden ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isActive 
                        ? 'bg-primary/20' 
                        : isLocked 
                        ? 'bg-gray-100'
                        : 'bg-orange-100'
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
                      <span className="text-xs font-semibold text-primary bg-orange-100 px-2 py-0.5 rounded">
                        Day {lesson.order}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-green-600">✓ Completed</span>
                      )}
                      {isLocked && (
                        <span className="text-xs text-gray-400">🔒 Locked</span>
                      )}
                    </div>
                    <p className={`font-semibold text-sm ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className={`text-xs ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
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
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : null}
                  </div>
                </motion.button>
              )
            })}
          </motion.div>

          {/* Footer text */}
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-center text-gray-700 text-sm">
              🎯 <strong>Complete lessons in order</strong> to unlock the next day.<br />
              <span className="text-xs text-gray-600">Each lesson builds on the previous one!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


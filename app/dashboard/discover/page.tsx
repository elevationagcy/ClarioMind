'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeInUp, staggerContainer, cardHover, cardTap } from '@/lib/animations'
import { useChallenges, useTips } from '@/lib/queries/discover'
import { useLessons } from '@/lib/queries/lessons'

export default function DiscoverPage() {
  const router = useRouter()

  // Use React Query with caching
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges()
  const { data: tips = [], isLoading: tipsLoading } = useTips(3)
  const { data: allLessons = [], isLoading: lessonsLoading } = useLessons()

  // Filter featured courses (those with images)
  const courses = allLessons.filter(lesson => 
    lesson.icon?.startsWith('http') || lesson.icon?.startsWith('/')
  )

  const loading = challengesLoading || tipsLoading || lessonsLoading

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          <div className="flex items-center bg-primary/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">⭐ 0</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Guided Challenges */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Guided Challenges</h2>
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
              {[1, 2].map((i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[280px] flex-shrink-0 space-y-3">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:grid md:grid-cols-2 md:gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  variants={fadeInUp}
                  whileHover={cardHover}
                  whileTap={cardTap}
                  className="min-w-[85vw] md:min-w-0 flex-shrink-0"
                >
                  <Card
                    variant="elevated"
                    className="p-4 cursor-pointer h-full"
                    onClick={() => router.push(`/dashboard/challenge/${challenge.id}`)}
                  >
                    <div className="bg-gradient-to-br from-primary/20 to-purple-100 rounded-xl h-48 mb-3 relative overflow-hidden">
                      {challenge.icon ? (
                        <Image
                          src={challenge.icon}
                          alt={challenge.title}
                          fill
                          sizes="280px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🏆
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{challenge.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{challenge.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{challenge.participants_count.toLocaleString()} joined</span>
                      <span>• {challenge.duration_days} days</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Courses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Courses</h2>
            <button className="text-primary text-sm font-medium">See all</button>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Empower yourself through our science-backed courses. Explore a diverse range of topics and acquire practical strategies for your journey!
          </p>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[85vw] md:min-w-[280px] flex-shrink-0">
                  <Skeleton className="w-full h-52 rounded-t-2xl" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-16 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:grid md:grid-cols-2 md:gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  variants={fadeInUp}
                  whileHover={cardHover}
                  whileTap={cardTap}
                  className="min-w-[85vw] md:min-w-0 flex-shrink-0"
                >
                  <Card
                    variant="elevated"
                    className="cursor-pointer h-full"
                    onClick={() => router.push(`/dashboard/lesson/${course.id}`)}
                  >
                    <div className="rounded-t-2xl h-52 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
                      {course.icon?.startsWith('http') ? (
                        <Image
                          src={course.icon}
                          alt={course.title}
                          fill
                          sizes="280px"
                          className="object-contain p-5"
                          unoptimized
                        />
                      ) : (
                        <span className="text-7xl">{course.icon || '📖'}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-600 mb-1">{course.category}</p>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                      <div className="flex items-center gap-2 text-xs mb-2">
                        <span className="flex items-center text-gray-600">
                          ⏱ {course.duration_minutes} min
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Day {course.order}</span>
                        <div className="flex items-center bg-secondary px-2 py-1 rounded">
                          <span className="font-medium text-primary">Start</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Tips from Coaches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Tips from Coaches</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-md">
                  <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {tips.map((tip) => (
                <motion.div
                  key={tip.id}
                  variants={fadeInUp}
                  whileHover={cardHover}
                  whileTap={cardTap}
                >
                  <Card
                    variant="elevated"
                    className="p-4 cursor-pointer"
                    onClick={() => router.push(`/dashboard/tip/${tip.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex-shrink-0 relative overflow-hidden">
                        {tip.icon ? (
                          <Image
                            src={tip.icon}
                            alt={tip.title}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            💡
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                        <p className="text-xs text-primary mb-2">by {tip.coach_name}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {tip.content.split('\n').find(line => !line.startsWith('#') && line.trim().length > 0)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{tip.category}</span>
                          <span>•</span>
                          <span>{tip.duration_minutes} min read</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}


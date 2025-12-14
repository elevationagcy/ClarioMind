'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fadeInUp, staggerContainer, cardHover, cardTap } from '@/lib/animations'
import { useMindfulnessTools, useCopingTools } from '@/lib/queries/toolkit'

export default function ToolkitPage() {
  const router = useRouter()

  // Use React Query with caching
  const { data: mindfulnessTools = [], isLoading: mindfulnessLoading } = useMindfulnessTools()
  const { data: copingTools = [], isLoading: copingLoading } = useCopingTools()

  const loading = mindfulnessLoading || copingLoading

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800">Toolkit</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tools and resources to support your journey
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="space-y-6">
            {/* Coping Skills Skeleton */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mindfulness Skeleton */}
            <div>
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full aspect-video rounded-xl" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Coping Skills */}
            {copingTools.length > 0 && (
              <motion.div variants={fadeInUp}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Coping Skills</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                  Practical strategies to help you manage cravings and challenging situations.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {copingTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      variants={fadeInUp}
                      whileHover={cardHover}
                      whileTap={cardTap}
                    >
                      <Card
                        variant="elevated"
                        className="p-4 cursor-pointer h-full bg-white border border-slate-100"
                        onClick={() => router.push(`/dashboard/lesson/${tool.id}`)}
                      >
                        <div className="w-full aspect-video bg-blue-50 rounded-xl flex items-center justify-center text-5xl mb-3 relative overflow-hidden border border-blue-100">
                          {tool.icon?.startsWith('http') ? (
                            <Image
                              src={tool.icon}
                              alt={tool.title}
                              fill
                              sizes="200px"
                              className="object-contain p-3"
                              unoptimized
                            />
                          ) : (
                            <span>{tool.icon || '🛠️'}</span>
                          )}
                        </div>
                        <p className="text-center font-semibold text-slate-800 text-sm line-clamp-2">{tool.title}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Mindfulness Section */}
            {mindfulnessTools.length > 0 && (
              <motion.div variants={fadeInUp}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">Mindfulness & Mental Health</h2>
                </div>
                <p className="text-slate-500 text-sm mb-4">
                  Enhance your daily routine. Practice mindfulness, discover helpful breathing techniques, and more!
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {mindfulnessTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      variants={fadeInUp}
                      whileHover={cardHover}
                      whileTap={cardTap}
                    >
                      <Card
                        variant="elevated"
                        className="p-4 cursor-pointer h-full bg-white border border-slate-100"
                        onClick={() => router.push(`/dashboard/lesson/${tool.id}`)}
                      >
                      <div className="w-full aspect-video bg-purple-50 rounded-xl flex items-center justify-center text-5xl mb-3 relative overflow-hidden border border-purple-100">
                        {tool.icon?.startsWith('http') ? (
                          <Image
                            src={tool.icon}
                            alt={tool.title}
                            fill
                            sizes="200px"
                            className="object-contain p-3"
                            unoptimized
                          />
                        ) : (
                          <span>{tool.icon || '🧘'}</span>
                        )}
                      </div>
                      <p className="text-center font-semibold text-slate-800 text-sm line-clamp-2">{tool.title}</p>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reflections Section */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Reflections</h2>
              <p className="text-slate-500 text-sm">
                Get in touch with your inner self through goals, journaling, and recovery stories.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

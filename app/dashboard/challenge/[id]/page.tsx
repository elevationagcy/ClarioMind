'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import { fadeInUp, fadeInScale } from '@/lib/animations'
import { useChallenge } from '@/lib/queries/discover'

export default function ChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  // Use React Query with caching
  const { data: challenge, isLoading: loading } = useChallenge(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center">
        <p className="text-gray-600">Challenge not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-6 shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-900 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mr-4 relative overflow-hidden">
            {challenge.icon ? (
              <Image
                src={challenge.icon}
                alt={challenge.title}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-4xl">🏆</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{challenge.title}</h1>
            <p className="text-sm text-gray-600">
              {challenge.duration_days} days • {challenge.participants_count.toLocaleString()} joined
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-32">
        {/* Description */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-md mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <p className="text-gray-700 mb-4">{challenge.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-primary/10 px-3 py-1 rounded-full">{challenge.category}</span>
            <span>•</span>
            <span>{challenge.duration_days} days</span>
          </div>
        </motion.div>

        {/* Full Content */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-md prose prose-sm md:prose-base max-w-none"
          variants={fadeInScale}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h3>,
              p: ({ children }) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="ml-2">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {challenge.content}
          </ReactMarkdown>
        </motion.div>
      </div>

      {/* Join Button */}
      <motion.div 
        className="fixed bottom-16 left-0 right-0 p-6 bg-white shadow-lg border-t"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Button size="lg" className="w-full">
          Join Challenge
        </Button>
      </motion.div>
    </div>
  )
}


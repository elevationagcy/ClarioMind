'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { fadeInUp, fadeInScale } from '@/lib/animations'
import { useTip } from '@/lib/queries/discover'

export default function TipPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  
  // Use React Query with caching
  const { data: tip, isLoading: loading } = useTip(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!tip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex items-center justify-center">
        <p className="text-gray-600">Tip not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-6 shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-gray-900 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center mr-4 relative overflow-hidden">
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
              <span className="text-4xl">💡</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{tip.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <User className="w-4 h-4" />
              <span>{tip.coach_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="p-6">
        <motion.div 
          className="bg-white rounded-2xl p-4 shadow-md mb-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 px-3 py-1 rounded-full text-sm font-medium text-primary">
                {tip.category}
              </span>
              <span className="text-sm text-gray-600">
                {tip.duration_minutes} min read
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
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
              code: ({ children }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm">{children}</code>,
            }}
          >
            {tip.content}
          </ReactMarkdown>
        </motion.div>

        {/* Coach Info */}
        <motion.div 
          className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 shadow-md mt-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white mr-3">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{tip.coach_name}</p>
              <p className="text-sm text-gray-600">Expert Coach</p>
            </div>
          </div>
          <p className="text-sm text-gray-700">
            Specializing in {tip.category.toLowerCase()} and helping thousands of people build healthier habits.
          </p>
        </motion.div>
      </div>
    </div>
  )
}


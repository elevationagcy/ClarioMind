'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { MeditationPlayer } from '@/components/meditation/meditation-player'
import { Sparkles, Play } from 'lucide-react'

interface MeditationLessonProps {
  title: string
  audioUrl: string
  duration: number
}

export function MeditationLesson({ title, audioUrl, duration }: MeditationLessonProps) {
  const [showPlayer, setShowPlayer] = useState(false)

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-purple-600 mr-2" />
          <h3 className="text-2xl font-bold text-gray-900">Guided Meditation</h3>
        </div>

        <p className="text-center text-gray-700 mb-6">
          Take {duration} minutes to center yourself with this guided meditation practice.
          Find a quiet space, get comfortable, and let yourself be guided into a state of calm and awareness.
        </p>

        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 10px 30px rgba(147, 51, 234, 0.3)',
                '0 15px 40px rgba(147, 51, 234, 0.5)',
                '0 10px 30px rgba(147, 51, 234, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Play className="w-12 h-12 text-white" fill="white" />
          </motion.div>

          <Button
            onClick={() => setShowPlayer(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
          >
            <Play className="w-5 h-5 mr-2" fill="white" />
            Start Meditation
          </Button>

          <p className="text-sm text-gray-600 text-center max-w-md">
            💡 Tip: Use headphones for the best experience. Find a comfortable seated position or lie down.
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showPlayer && (
          <MeditationPlayer
            audioUrl={audioUrl}
            title={title}
            duration={duration}
            onClose={() => setShowPlayer(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}


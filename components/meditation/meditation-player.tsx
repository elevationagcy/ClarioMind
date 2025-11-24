'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Play, Pause, ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MeditationPlayerProps {
  audioUrl: string
  title: string
  duration: number // in minutes
  onClose: () => void
}

export function MeditationPlayer({ audioUrl, title, duration, onClose }: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration * 60) // Use prop as initial estimate
  const [isMuted, setIsMuted] = useState(false)
  const [gradientIndex, setGradientIndex] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  
  // Smooth audio level animation
  const smoothAudioLevel = useSpring(0, { damping: 20, stiffness: 100 })

  // Meditative gradient themes
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Sunset
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Deep Ocean
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Pastel
    'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)', // Warm
  ]

  // Rotate gradients every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % gradients.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Setup Web Audio API for visualization
  const setupAudioContext = () => {
    if (audioRef.current && !audioContextRef.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaElementSource(audioRef.current)
        
        analyser.fftSize = 256
        source.connect(analyser)
        analyser.connect(audioContext.destination)
        
        audioContextRef.current = audioContext
        analyserRef.current = analyser
        sourceNodeRef.current = source
        
        console.log('✅ Audio context initialized')
      } catch (error) {
        console.error('❌ Error setting up audio context:', error)
        // If Web Audio API fails, still allow regular audio playback
        audioContextRef.current = null
      }
    }
  }

  // Update smooth audio level
  useEffect(() => {
    smoothAudioLevel.set(audioLevel)
  }, [audioLevel, smoothAudioLevel])

  // Analyze audio levels in real-time
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray)
        
        // Calculate average volume (0-1 range)
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255
        
        // Emphasize lower frequencies (calmer, more meditative)
        const lowFreq = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255
        const combined = (average * 0.3 + lowFreq * 0.7)
        
        setAudioLevel(combined)
        animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
      }
    }
    
    updateAudioLevel()
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying])

  // Audio management
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current

      const updateTime = () => {
        if (audio.currentTime && !isNaN(audio.currentTime)) {
          setCurrentTime(audio.currentTime)
          console.log('⏱️ Time:', audio.currentTime.toFixed(1), '/', audio.duration?.toFixed(1))
        }
      }
      audio.addEventListener('timeupdate', updateTime)

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }
      audio.addEventListener('ended', handleEnded)

      // Update total duration when metadata loads
      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setTotalDuration(audio.duration)
          console.log('✅ Audio duration loaded:', audio.duration, 'seconds')
        }
      }
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        audio.removeEventListener('timeupdate', updateTime)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) {
      console.error('❌ Audio element not found')
      return
    }

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Setup audio context on first play (user interaction required)
        if (!audioContextRef.current) {
          setupAudioContext()
        }
        
        // Resume AudioContext if suspended (required by some browsers)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          console.log('Resuming audio context...')
          await audioContextRef.current.resume()
        }
        
        console.log('Playing audio from:', audioUrl)
        await audioRef.current.play()
        setIsPlaying(true)
        console.log('✅ Audio playing')
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error)
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = totalDuration > 0 
    ? Math.min((currentTime / totalDuration) * 100, 100)
    : 0

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated Gradient Background - Reacts to Audio */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: gradients[gradientIndex],
          filter: `brightness(${1 + audioLevel * 0.15}) saturate(${1 + audioLevel * 0.2})`,
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
        }}
      />

      {/* Audio-Reactive Breathing Circle */}
      <motion.div
        className="absolute"
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          opacity: [0.3, 0.5, 0.3],
        }}
        style={{
          scale: isPlaying ? 1 + audioLevel * 0.3 : 1, // Reacts to audio volume
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-white/10 backdrop-blur-sm" />
      </motion.div>
      
      {/* Secondary Audio-Reactive Ring */}
      <motion.div
        className="absolute"
        animate={{
          scale: isPlaying ? [1.3, 1.5, 1.3] : 1.3,
          opacity: [0.15, 0.25, 0.15],
        }}
        style={{
          scale: isPlaying ? 1.3 + audioLevel * 0.4 : 1.3,
          opacity: audioLevel * 0.3,
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-white/5 backdrop-blur-sm" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md p-8 text-white">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-8 left-8 p-2 hover:bg-white/20 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Title */}
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Duration */}
        <motion.p
          className="text-white/80 mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.ceil(totalDuration / 60)} minute meditation
        </motion.p>

        {/* Breathing Guide Text */}
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              key="breathing"
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.p
                className="text-2xl font-light"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Breathe
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play/Pause Button */}
        <motion.button
          onClick={togglePlay}
          className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition mb-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 text-white" fill="white" />
          ) : (
            <Play className="w-10 h-10 text-white ml-1" fill="white" />
          )}
        </motion.button>

        {/* Progress Bar */}
        <div className="w-full mb-4">
          <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-white rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between text-sm text-white/70 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>
        </div>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="p-3 hover:bg-white/20 rounded-full transition"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          preload="auto"
          crossOrigin="anonymous"
          onLoadedMetadata={() => console.log('✅ Audio loaded:', audioUrl)}
          onError={(e) => console.error('❌ Audio error:', e)}
        />
      </div>

      {/* Audio-Reactive Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/30"
            style={{
              width: 2 + audioLevel * 4, // Size reacts to audio
              height: 2 + audioLevel * 4,
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
              opacity: [0, 0.5 + audioLevel * 0.5, 0], // Brightness reacts to audio
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      {/* Audio Level Indicator */}
      <motion.div 
        className="absolute top-24 left-8 text-white/70 text-xs font-medium"
        animate={{ opacity: isPlaying ? 1 : 0.3 }}
      >
        <div className="flex items-center gap-2">
          <span>Audio</span>
          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              animate={{ width: `${audioLevel * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="w-8 text-right">{(audioLevel * 100).toFixed(0)}%</span>
        </div>
      </motion.div>
    </motion.div>
  )
}


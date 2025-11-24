'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { X, BookOpen, Edit, Brain, Mountain, Calendar, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function TutorialPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [userName, setUserName] = useState('there')
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null)
  const totalSteps = 3

  useEffect(() => {
    loadUserName()
  }, [])

  const loadUserName = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name.split(' ')[0])
      }
    } catch (error) {
      console.error('Error loading user name:', error)
    }
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSkip = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-gray-900 font-semibold">Welcome to Reframe</h1>
        <button onClick={handleSkip} className="text-gray-900">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <Progress value={step} max={totalSteps} className="bg-orange-200" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {step === 1 && <Step1 userName={userName} />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 expandedPhase={expandedPhase} setExpandedPhase={setExpandedPhase} />}
      </div>

      {/* Next button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full bg-primary text-white hover:bg-primary-dark"
        >
          {step === 1 ? 'I believe!' : step === 2 ? 'Show me how!' : 'Okay, what comes next?'}
        </Button>
      </div>
    </div>
  )
}

// Step 1: Welcome & Belief
function Step1({ userName }: { userName: string }) {
  return (
    <div className="text-gray-900">
      <h2 className="text-3xl font-bold mb-8">
        Welcome,<br />{userName}!
      </h2>

      {/* Reframe works card */}
      <div className="bg-primary rounded-2xl p-8 mb-6 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">
          Reframe<br />
          <span className="text-white">works.</span>
        </h3>
      </div>

      <p className="text-lg mb-6 leading-relaxed">
        Though Reframe is built on a complex foundation of neuroscience, psychology, and the latest research, none of that matters unless you have one key thing...
      </p>

      <div className="bg-white rounded-2xl p-6 mb-6 shadow-md border border-orange-100">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xl">✓</span>
          </div>
          <h4 className="text-xl font-bold">A belief that this will work.</h4>
        </div>
        <p className="text-gray-700 leading-relaxed">
          We believe deeply in your ability to dramatically change or end your relationship with alcohol. In fact, we've seen it done before, over and over, and many of us on the Reframe team have done it ourselves.
        </p>
      </div>
    </div>
  )
}

// Step 2: Daily Activities
function Step2() {
  return (
    <div className="text-gray-900">
      {/* Activity icons */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
          <Edit className="w-6 h-6 text-primary" />
        </div>
        <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
          <Mountain className="w-6 h-6 text-primary" />
        </div>
        <div className="w-full aspect-square bg-white rounded-xl flex items-center justify-center shadow-md border border-orange-100">
          <Calendar className="w-6 h-6 text-primary" />
        </div>
      </div>

      <p className="text-lg mb-8 leading-relaxed">
        Each day, you'll receive a new set of activities to help you transform your well-being and address all areas of your physical, mental, and emotional health.
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
        <h3 className="text-xl font-bold mb-4">These activities include:</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">Daily readings</span> to learn science-based techniques</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">Cognitive exercises</span> to shift how you think</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">Reflections</span> to capture your most important realizations</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
            <p><span className="font-semibold">Behavioral insights</span> based on your progress</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 3: Roadmap
function Step3({ expandedPhase, setExpandedPhase }: { expandedPhase: number | null; setExpandedPhase: (phase: number | null) => void }) {
  const phases = [
    {
      title: 'The Neuroscience Behind Your Drinking Habits',
      icon: '🧠',
      color: 'bg-pink-100 text-pink-600'
    },
    {
      title: 'Alcohol and Your Body',
      icon: '🏃',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Hacking Your Psychology for Success',
      icon: '💡',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Taking Control for a Healthy Mind',
      icon: '🎯',
      color: 'bg-orange-100 text-orange-600'
    },
  ]

  return (
    <div className="text-gray-900">
      <h2 className="text-3xl font-bold mb-4">
        Your roadmap overview
      </h2>

      <p className="text-lg mb-8 leading-relaxed">
        Everyone's journey is different and that's why your roadmap is personalized to your unique path. Here is a summary of what to expect over the next few weeks!
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100 mb-6">
        <h3 className="text-xl font-bold mb-4">
          Here's a preview of some of the skills you'll build in Phase I — your first 120 days with Reframe.
        </h3>
      </div>

      <div className="space-y-3">
        {phases.map((phase, index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedPhase(expandedPhase === index ? null : index)}
              className="w-full p-4 flex items-center text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${phase.color}`}>
                <span className="text-2xl">{phase.icon}</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{phase.title}</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedPhase === index ? 'rotate-180' : ''}`} />
            </button>
            {expandedPhase === index && (
              <div className="px-4 pb-4 text-gray-700">
                <p className="text-sm">
                  Deep dive into {phase.title.toLowerCase()} with expert-curated content and practical exercises.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


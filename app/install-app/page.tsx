'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { 
  Smartphone, 
  Share, 
  Plus,
  MoreVertical,
  Download,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Platform = 'ios' | 'android' | null

export default function InstallAppPage() {
  const router = useRouter()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null)

  const handleContinue = () => {
    // Mark that user has seen the install guide
    localStorage.setItem('hasSeenInstallGuide', 'true')
    router.push('/onboarding/intro')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
          <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
        {/* Success Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Account Created Successfully!</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Add ClarioMind to Your Home Screen
          </h1>
          <p className="text-slate-500">
            Get the full app experience with quick access from your phone
          </p>
        </motion.div>

        {/* Platform Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={() => setSelectedPlatform('ios')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
              selectedPlatform === 'ios'
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <span className="font-semibold text-slate-800">iPhone</span>
              <span className="text-xs text-slate-500">iOS Safari</span>
            </div>
            {selectedPlatform === 'ios' && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </button>

          <button
            onClick={() => setSelectedPlatform('android')}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
              selectedPlatform === 'android'
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                  <path d="M17.523 15.341a.6.6 0 0 0-.6.6v3.228a.6.6 0 0 0 1.2 0V15.94a.6.6 0 0 0-.6-.6zm-11.046 0a.6.6 0 0 0-.6.6v3.228a.6.6 0 0 0 1.2 0V15.94a.6.6 0 0 0-.6-.6z"/>
                  <path d="M15.477 10.4l1.436-2.588a.3.3 0 0 0-.524-.29l-1.454 2.62a7.287 7.287 0 0 0-2.935-.594c-1.05 0-2.04.215-2.935.594l-1.454-2.62a.3.3 0 0 0-.524.29l1.436 2.588A6.687 6.687 0 0 0 5.4 15.941v.6h13.2v-.6a6.687 6.687 0 0 0-3.123-5.541zM9.177 13.8a.6.6 0 1 1 0-1.2.6.6 0 0 1 0 1.2zm5.646 0a.6.6 0 1 1 0-1.2.6.6 0 0 1 0 1.2z"/>
                  <path d="M5.4 16.541h13.2v3a1.2 1.2 0 0 1-1.2 1.2H6.6a1.2 1.2 0 0 1-1.2-1.2v-3z"/>
                </svg>
              </div>
              <span className="font-semibold text-slate-800">Android</span>
              <span className="text-xs text-slate-500">Chrome</span>
            </div>
            {selectedPlatform === 'android' && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </button>
        </motion.div>

        {/* Instructions */}
        <AnimatePresence mode="wait">
          {selectedPlatform && (
            <motion.div
              key={selectedPlatform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6"
            >
              <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  {selectedPlatform === 'ios' ? 'iPhone Instructions' : 'Android Instructions'}
                </h2>
              </div>
              
              <div className="p-5 space-y-4">
                {selectedPlatform === 'ios' ? (
                  <>
                    {/* Step 1 - iOS */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Tap the Share button
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Share className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm text-slate-600">
                            Find this at the bottom of Safari
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 - iOS */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Scroll and tap "Add to Home Screen"
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5 text-slate-700" />
                          </div>
                          <span className="text-sm text-slate-600">
                            Add to Home Screen
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                        </div>
                      </div>
                    </div>

                    {/* Step 3 - iOS */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Tap "Add" in the top right
                        </p>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            ClarioMind will appear on your home screen!
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 1 - Android */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">1</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Tap the menu button (⋮)
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                            <MoreVertical className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-sm text-slate-600">
                            Find this in the top right of Chrome
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 - Android */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Tap "Add to Home screen" or "Install app"
                        </p>
                        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-slate-700" />
                          </div>
                          <span className="text-sm text-slate-600">
                            Add to Home screen
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                        </div>
                      </div>
                    </div>

                    {/* Step 3 - Android */}
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">3</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-2">
                          Tap "Add" or "Install"
                        </p>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
                          <p className="text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            ClarioMind will appear on your home screen!
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits */}
        {!selectedPlatform && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-6"
          >
            <h3 className="font-semibold text-slate-800 mb-4">Why add to home screen?</h3>
            <ul className="space-y-3">
              {[
                'Quick one-tap access to your recovery tools',
                'Full-screen experience without browser bars',
                'Works offline for emergency moments',
                'Feels like a native app on your device'
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleContinue}
            className="w-full py-5 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform"
          >
            Got it, continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-center text-sm text-slate-400 mt-4">
            You can always do this later from your browser
          </p>
        </motion.div>
      </main>
    </div>
  )
}




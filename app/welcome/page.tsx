'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-96 h-96">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-10 bg-primary/5 rounded-full blur-2xl animate-pulse delay-75" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Reframe
        </h1>
        <p className="text-lg text-gray-700 mb-12 px-4">
          The world's most comprehensive alcohol reduction platform
        </p>

        {/* Flying Man Lottie Animation */}
        <div className="w-64 h-64 mb-12 relative">
          <DotLottieReact
            src="https://lottie.host/25aaa523-59ca-4185-9d8e-7e1ca254968c/770RwUrvID.lottie"
            loop
            autoplay
          />
        </div>

        {/* Action buttons */}
        <div className="w-full space-y-4">
          <Link href="/auth/register" className="block">
            <Button size="lg" className="w-full bg-primary text-white hover:bg-primary-dark">
              Get Started
            </Button>
          </Link>

          <Link href="/auth/login" className="block">
            <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-orange-50">
              Log in
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  )
}


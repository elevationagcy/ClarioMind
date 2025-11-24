'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Check if email confirmation is required
        if (authData.session) {
          // User is automatically logged in (email confirmation disabled)
          router.push('/onboarding/intro')
          router.refresh()
        } else {
          // Email confirmation required - show message
          setShowEmailConfirmation(true)
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  // Show email confirmation message
  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
        <div className="container max-w-md mx-auto px-6 py-8">
          {/* Back button */}
          <Link href="/welcome" className="inline-flex items-center text-primary mb-8">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Link>

          {/* Email Confirmation Message */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-full max-w-[300px] h-[300px] mx-auto mb-4">
              <DotLottieReact
                src="https://lottie.host/ca383446-5e30-450a-b61e-4f64bb6be0c8/EkFKv16aX3.lottie"
                loop
                autoplay
              />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Check your email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a confirmation email to <strong>{email}</strong>. 
              Please click the link in the email to verify your account and get started.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-orange-800">
                💡 <strong>Tip:</strong> Can't find the email? Check your spam folder.
              </p>
            </div>

            <Link href="/auth/login">
              <Button size="lg" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5]">
      <div className="container max-w-md mx-auto px-6 py-8">
        {/* Back button */}
        <Link href="/welcome" className="inline-flex items-center text-primary mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">
            Start your journey to healthier habits
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button 
            type="submit" 
            size="lg" 
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}


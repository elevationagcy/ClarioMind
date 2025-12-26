'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmationSuccess, setShowConfirmationSuccess] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false)

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      setShowConfirmationSuccess(true)
    }
    const errorType = searchParams.get('error')
    const errorMessage = searchParams.get('message')
    const errorReason = searchParams.get('reason')
    
    if (errorType === 'link_expired') {
      setEmailNotConfirmed(true) // Show resend button
      setError(errorMessage || 'This verification link has expired. Please enter your email below and click "Resend confirmation email" to receive a new link.')
    } else if (errorType === 'confirmation_failed') {
      setError(errorReason || errorMessage || 'Email confirmation failed. Please try again or request a new confirmation email.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Check if email is not confirmed
      const isEmailNotConfirmed = err.message?.toLowerCase().includes('email not confirmed') || 
                                  err.message?.toLowerCase().includes('email_not_confirmed') ||
                                  err.status === 400 && err.message?.toLowerCase().includes('confirm')
      
      if (isEmailNotConfirmed) {
        setEmailNotConfirmed(true)
        setError('Please verify your email address before signing in. Check your inbox for the confirmation email.')
      } else {
        setEmailNotConfirmed(false)
        setError(err.message || 'Failed to sign in. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setResendingEmail(true)
    setError('')
    setResendSuccess(false)
    setEmailNotConfirmed(false)

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (resendError) throw resendError

      setResendSuccess(true)
      setError('')
      setEmailNotConfirmed(false)
    } catch (err: any) {
      console.error('Resend error:', err)
      setError(err.message || 'Failed to resend confirmation email. Please try again.')
      setResendSuccess(false)
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/welcome"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
        </Link>
          <Logo size="sm" />
          <div className="w-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
        {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to continue your journey</p>
        </div>

          {/* Success Message */}
          {showConfirmationSuccess && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-700">Email Confirmed!</h3>
                <p className="text-sm text-green-600">Your account is verified. You can now sign in.</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailNotConfirmed) setEmailNotConfirmed(false)
              if (error) setError('')
            }}
            required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="flex-1">{error}</span>
                  </div>
                  {(emailNotConfirmed || searchParams.get('error') === 'link_expired') && (
                    <div className="flex flex-col gap-2 pl-7">
                      {email ? (
                        <>
                          <button
                            type="button"
                            onClick={handleResendConfirmation}
                            disabled={resendingEmail}
                            className="text-left text-sm text-red-700 hover:text-red-800 underline font-medium disabled:opacity-50"
                          >
                            {resendingEmail ? (
                              <>
                                <Loader2 className="w-4 h-4 inline-block animate-spin mr-1" />
                                Sending confirmation email...
                              </>
                            ) : (
                              '📧 Resend confirmation email'
                            )}
                          </button>
                          <p className="text-xs text-red-500">
                            Didn't receive the email? Check your spam folder or click above to resend.
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-red-500">
                          Enter your email address above, then click "Resend confirmation email" to receive a new verification link.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Resend Success Message */}
              {resendSuccess && (
                <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Confirmation email sent! Please check your inbox.</span>
                </div>
              )}

              {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
                className="w-full py-5 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
          </Button>
        </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
          Don't have an account?{' '}
                <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create one
          </Link>
        </p>
      </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}

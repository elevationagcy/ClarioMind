'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(true)
  const [hasPayment, setHasPayment] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const storedEmail = localStorage.getItem('quizEmail')
      
      if (!storedEmail) {
        // No email stored, redirect to quiz
        router.push('/quiz')
        return
      }

      setEmail(storedEmail)

      // Check if payment exists for this email
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('id, status')
        .eq('email', storedEmail)
        .eq('status', 'completed')
        .limit(1)

      if (paymentError) {
        console.error('Error checking payment:', paymentError)
      }

      if (paymentData && paymentData.length > 0) {
        setHasPayment(true)
      } else {
        // No payment found, redirect to checkout
        router.push('/quiz/checkout')
        return
      }

      setCheckingPayment(false)
    }

    checkPaymentStatus()
  }, [router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Double-check payment exists
    if (!hasPayment) {
      setError('Please complete payment first')
      setLoading(false)
      router.push('/quiz/checkout')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      // Create the auth user (profile is created automatically by database trigger)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: name,
          },
        },
      })

      if (signUpError) throw signUpError

      // The trigger creates the profile automatically
      // Now we need to copy ALL subscription data from payments to user_profiles
      if (data.user) {
        // Check for existing payment with this email - get ALL subscription fields
        const { data: paymentData } = await supabase
          .from('payments')
          .select('id, subscription_status, stripe_subscription_id, stripe_customer_id, subscription_ends_at')
          .eq('email', email)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)

        // If payment exists, update the profile with ALL subscription data
        if (paymentData && paymentData.length > 0) {
          // Wait a moment for the trigger to complete
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const payment = paymentData[0]
          
          // Update profile with all subscription data
          await supabase
            .from('user_profiles')
            .update({ 
              has_paid: true,
              subscription_status: payment.subscription_status || 'active',
              stripe_customer_id: payment.stripe_customer_id,
              subscription_ends_at: payment.subscription_ends_at,
            })
            .eq('user_id', data.user.id)

          // Link payment to user
          await supabase
            .from('payments')
            .update({ user_id: data.user.id })
            .eq('id', payment.id)
        }
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking payment
  if (checkingPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Verifying payment...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Check Your Email</h1>
            <p className="text-slate-600 mb-8">
              We've sent a confirmation link to <strong className="text-slate-800">{email}</strong>. 
              Please click the link to verify your account.
            </p>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-sm text-slate-500">
                After confirming your email, you'll be redirected to sign in and start your journey with ClarioMind.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/quiz/upsell"
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
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Your Account</h1>
            <p className="text-slate-500">Start your recovery journey today</p>
          </div>

          {/* Payment Verified Badge */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700">Payment verified for {email}</span>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Email - Read Only */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This is the email you used for payment
                </p>
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Security Note */}
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <Shield className="w-3 h-3" />
                <span>Your data is encrypted and secure</span>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

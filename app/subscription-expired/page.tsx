'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { AlertTriangle, CreditCard, LogOut, Settings, User, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SubscriptionExpiredPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    email: string
    customerId: string | null
    userId: string
  } | null>(null)

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Get stripe customer ID from profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('stripe_customer_id')
        .eq('user_id', user.id)
        .single()

      setUserInfo({
        email: user.email || '',
        customerId: profile?.stripe_customer_id || null,
        userId: user.id,
      })
    }
  }

  const handleResubscribe = async () => {
    if (!userInfo) return

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userInfo.userId,
          email: userInfo.email,
          customerId: userInfo.customerId,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL received')
      }
    } catch (error) {
      console.error('Resubscribe error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoToSettings = () => {
    router.push('/dashboard/settings')
  }

  const handleGoToProfile = () => {
    router.push('/dashboard/profile')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/welcome')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-center">
          <button onClick={() => router.push('/')} className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Subscription Expired
          </h1>

          {/* Message */}
          <p className="text-slate-600 mb-8">
            Your subscription has ended. Renew now to continue your recovery journey and keep your progress.
          </p>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-slate-800 mb-4">What you're missing:</h2>
            <ul className="text-left space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                Daily personalized lessons
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                Progress tracking & insights
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                Community support
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500">✗</span>
                Expert-designed tools
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleResubscribe}
              disabled={loading || !userInfo}
              className="w-full py-5 rounded-xl text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Renew Subscription - $29.99/mo
                </>
              )}
            </Button>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleGoToSettings}
                className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleGoToProfile}
                className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 text-slate-500 hover:text-slate-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}


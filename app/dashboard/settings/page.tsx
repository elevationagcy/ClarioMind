'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConfirmModal, AlertModal } from '@/components/ui/modal'
import { ArrowLeft, Bell, Lock, Palette, Mail, Trash2, Save, ExternalLink, CreditCard, AlertTriangle, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface UserSettings {
  id: string
  user_id: string
  daily_reminder: boolean
  reminder_time: string
  achievement_notifications: boolean
  weekly_summary: boolean
  profile_visibility: 'private' | 'friends' | 'public'
  show_progress: boolean
  anonymous_mode: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
  units: 'metric' | 'imperial'
  marketing_emails: boolean
  newsletter: boolean
}

interface SubscriptionInfo {
  id: string
  payment_type: 'one_time' | 'subscription'
  subscription_status: string | null
  stripe_subscription_id: string | null
  amount: number
  currency: string
  created_at: string
  subscription_ends_at: string | null
  billing_interval_count: number | null
  next_billing_date: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cancelingSubscription, setCancelingSubscription] = useState(false)
  const [resumingSubscription, setResumingSubscription] = useState(false)
  const [resubscribing, setResubscribing] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)

  // Modal states
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    variant: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const showAlert = (title: string, message: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setAlertModal({ isOpen: true, title, message, variant })
  }

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || '')
        setUserId(user.id)

        // Load stripe customer id from profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('stripe_customer_id')
          .eq('user_id', user.id)
          .single()
        
        if (profileData?.stripe_customer_id) {
          setStripeCustomerId(profileData.stripe_customer_id)
        }

        // Load settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (error) {
          // If settings don't exist, create them
          const { data: newSettings, error: insertError } = await supabase
            .from('user_settings')
            .insert({ user_id: user.id })
            .select()
            .single()

          if (!insertError && newSettings) {
            setSettings(newSettings)
          }
        } else {
          setSettings(data)
        }

        // Load subscription info
        const { data: paymentData } = await supabase
          .from('payments')
          .select('id, payment_type, subscription_status, stripe_subscription_id, amount, currency, created_at, subscription_ends_at, billing_interval_count, next_billing_date')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (paymentData) {
          setSubscription(paymentData)
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value })
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('user_settings')
        .update({
          daily_reminder: settings.daily_reminder,
          reminder_time: settings.reminder_time,
          achievement_notifications: settings.achievement_notifications,
          weekly_summary: settings.weekly_summary,
          profile_visibility: settings.profile_visibility,
          show_progress: settings.show_progress,
          anonymous_mode: settings.anonymous_mode,
          theme: settings.theme,
          language: settings.language,
          units: settings.units,
          marketing_emails: settings.marketing_emails,
          newsletter: settings.newsletter,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', settings.user_id)

      if (!error) {
        showAlert('Success', 'Your settings have been saved successfully.', 'success')
      } else {
        showAlert('Error', 'Failed to save settings. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      showAlert('Error', 'An error occurred while saving settings.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelSubscriptionClick = () => {
    if (!subscription?.stripe_subscription_id) {
      showAlert('Error', 'No active subscription found.', 'error')
      return
    }
    setShowCancelModal(true)
  }

  const handleCancelSubscriptionConfirm = async () => {
    setShowCancelModal(false)
    
    if (!subscription?.stripe_subscription_id) return

    setCancelingSubscription(true)
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
          userId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscription({
          ...subscription,
          subscription_status: 'canceling',
          subscription_ends_at: data.currentPeriodEnd || subscription.subscription_ends_at,
        })
        const endDateText = data.currentPeriodEnd 
          ? formatDate(data.currentPeriodEnd) 
          : 'the end of your billing period'
        showAlert(
          'Subscription Canceled',
          `Your subscription has been canceled. You will retain access until ${endDateText}.`,
          'success'
        )
      } else {
        showAlert('Error', data.error || 'Failed to cancel subscription.', 'error')
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      showAlert('Error', 'Failed to cancel subscription. Please try again or contact support.', 'error')
    } finally {
      setCancelingSubscription(false)
    }
  }

  const handleResumeSubscriptionClick = () => {
    setShowResumeModal(true)
  }

  const handleResubscribeClick = async () => {
    setResubscribing(true)
    try {
      const response = await fetch('/api/stripe/resubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          email: userEmail,
          customerId: stripeCustomerId,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        showAlert('Error', data.error || 'Failed to create checkout session.', 'error')
      }
    } catch (error) {
      console.error('Resubscribe error:', error)
      showAlert('Error', 'Failed to start resubscription. Please try again.', 'error')
    } finally {
      setResubscribing(false)
    }
  }

  const handleResumeSubscriptionConfirm = async () => {
    setShowResumeModal(false)
    
    if (!subscription?.stripe_subscription_id) return

    setResumingSubscription(true)
    try {
      const response = await fetch('/api/stripe/resume-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
          userId: userId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubscription({
          ...subscription,
          subscription_status: 'active',
          subscription_ends_at: null,
        })
        const billingText = getBillingPeriodText(subscription.billing_interval_count)
        showAlert(
          'Subscription Resumed',
          `Your subscription has been resumed. You will continue to be billed every ${billingText}.`,
          'success'
        )
      } else {
        showAlert('Error', data.error || 'Failed to resume subscription.', 'error')
      }
    } catch (error) {
      console.error('Error resuming subscription:', error)
      showAlert('Error', 'Failed to resume subscription. Please try again or contact support.', 'error')
    } finally {
      setResumingSubscription(false)
    }
  }

  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteAccountFirstConfirm = () => {
    setShowDeleteModal(false)
    setShowDeleteConfirmModal(true)
  }

  const handleDeleteAccountFinalConfirm = async () => {
    setShowDeleteConfirmModal(false)

    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/welcome')
    } catch (error) {
      console.error('Error deleting account:', error)
      showAlert('Error', 'Failed to delete account. Please contact support.', 'error')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getPlanName = (intervalCount: number | null) => {
    switch (intervalCount) {
      case 1:
        return '1-Month Plan'
      case 3:
        return '3-Month Plan'
      case 6:
        return '6-Month Plan'
      case 12:
        return 'Annual Plan'
      default:
        return 'Monthly Plan'
    }
  }

  const getBillingPeriodText = (intervalCount: number | null) => {
    switch (intervalCount) {
      case 1:
        return 'month'
      case 3:
        return '3 months'
      case 6:
        return '6 months'
      case 12:
        return 'year'
      default:
        return 'month'
    }
  }

  const getSubscriptionStatusBadge = (status: string | null) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        )
      case 'trialing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" />
            Trial
          </span>
        )
      case 'canceling':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            <AlertTriangle className="w-3 h-3" />
            Canceling
          </span>
        )
      case 'canceled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            Canceled
          </span>
        )
      case 'past_due':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            Past Due
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-6 pb-24">
        <p className="text-center text-slate-500 mt-12">Loading settings...</p>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 p-6 pb-24">
        <p className="text-center text-slate-500 mt-12">Failed to load settings.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 pb-24">
      {/* Modals */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscriptionConfirm}
        title="Cancel Subscription?"
        message="Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period."
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        variant="warning"
      />

      <ConfirmModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        onConfirm={handleResumeSubscriptionConfirm}
        title="Resume Subscription?"
        message="Would you like to resume your subscription? Your billing will continue as normal and you won't lose access."
        confirmText="Yes, Resume"
        cancelText="Keep Canceled"
        variant="default"
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccountFirstConfirm}
        title="Delete Account?"
        message="Are you sure you want to delete your account? This action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteAccountFinalConfirm}
        title="Final Confirmation"
        message="This will permanently delete all your data, including progress, lessons, and personal information. Are you absolutely sure?"
        confirmText="Delete Forever"
        cancelText="Cancel"
        variant="danger"
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        variant={alertModal.variant}
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-6 sticky top-0 z-10">
        <button onClick={() => router.back()} className="text-slate-800 mb-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">{userEmail}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Subscription Section */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Subscription</h2>
          </div>

          {subscription ? (
            <div className="space-y-4">
              {/* Subscription Status */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Status</span>
                {getSubscriptionStatusBadge(subscription.subscription_status)}
              </div>

              {/* Plan Type */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Plan</span>
                <span className="font-medium text-slate-800">
                  {subscription.payment_type === 'subscription' 
                    ? getPlanName(subscription.billing_interval_count) 
                    : 'Lifetime'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Price</span>
                <span className="font-medium text-slate-800">
                  ${(subscription.amount / 100).toFixed(2)}/{subscription.payment_type === 'subscription' 
                    ? getBillingPeriodText(subscription.billing_interval_count) 
                    : 'one-time'}
                </span>
              </div>

              {/* Member Since */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Member Since</span>
                <span className="font-medium text-slate-800">
                  {formatDate(subscription.created_at)}
                </span>
              </div>

              {/* Next Billing Date (only for active subscriptions) */}
              {subscription.payment_type === 'subscription' && subscription.subscription_status === 'active' && subscription.next_billing_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Next Billing Date</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(subscription.next_billing_date)}
                  </span>
                </div>
              )}

              {/* Cancellation Notice with Resume Option */}
              {subscription.subscription_status === 'canceling' && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                  <p className="text-sm text-amber-700">
                    Your subscription has been canceled. You will retain full access until{' '}
                    <span className="font-semibold">
                      {subscription.subscription_ends_at 
                        ? formatDate(subscription.subscription_ends_at)
                        : 'the end of your billing period'}
                    </span>.
                  </p>
                  <Button
                    onClick={handleResumeSubscriptionClick}
                    disabled={resumingSubscription}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {resumingSubscription ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Resuming...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Resume Subscription
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Fully Canceled - Resubscribe Option */}
              {subscription.subscription_status === 'canceled' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
                  <p className="text-sm text-red-700">
                    Your subscription has expired. Resubscribe to regain access to all features.
                  </p>
                  <Button
                    onClick={handleResubscribeClick}
                    disabled={resubscribing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {resubscribing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Resubscribe - $29.99/mo
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Cancel Button (only for active subscriptions) */}
              {subscription.payment_type === 'subscription' && 
               subscription.stripe_subscription_id && 
               ['active', 'trialing'].includes(subscription.subscription_status || '') && (
                <Button
                  onClick={handleCancelSubscriptionClick}
                  disabled={cancelingSubscription}
                  variant="outline"
                  className="w-full mt-2 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  {cancelingSubscription ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Canceling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-500 mb-3">No active subscription found</p>
              <Link href="/quiz/checkout">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Subscribe Now
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Notifications Section */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Daily Reminders</p>
                <p className="text-xs text-slate-500">Get reminded to complete your daily lesson</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.daily_reminder}
                  onChange={(e) => updateSetting('daily_reminder', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            {settings.daily_reminder && (
              <div className="ml-4 pl-4 border-l-2 border-blue-200">
                <label className="block text-sm text-slate-600 mb-2">Reminder Time</label>
                <input
                  type="time"
                  value={settings.reminder_time}
                  onChange={(e) => updateSetting('reminder_time', e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Achievement Notifications</p>
                <p className="text-xs text-slate-500">Celebrate milestones and streaks</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.achievement_notifications}
                  onChange={(e) => updateSetting('achievement_notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Weekly Summary</p>
                <p className="text-xs text-slate-500">Receive weekly progress reports</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.weekly_summary}
                  onChange={(e) => updateSetting('weekly_summary', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Privacy Section */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <div className="flex items-center mb-4">
            <Lock className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Privacy</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-slate-800 mb-2">Profile Visibility</label>
              <select
                value={settings.profile_visibility}
                onChange={(e) => updateSetting('profile_visibility', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="private">Private</option>
                <option value="friends">Friends Only</option>
                <option value="public">Public</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Show Progress</p>
                <p className="text-xs text-slate-500">Display your progress to others</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.show_progress}
                  onChange={(e) => updateSetting('show_progress', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Anonymous Mode</p>
                <p className="text-xs text-slate-500">Hide your name and use anonymous avatar</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.anonymous_mode}
                  onChange={(e) => updateSetting('anonymous_mode', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <div className="flex items-center mb-4">
            <Palette className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium text-slate-800 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
                <option value="auto">Auto (Coming Soon)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-800 mb-2">Units</label>
              <select
                value={settings.units}
                onChange={(e) => updateSetting('units', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="metric">Metric (kg, cm)</option>
                <option value="imperial">Imperial (lbs, inches)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Email Preferences */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <div className="flex items-center mb-4">
            <Mail className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-bold text-slate-800">Email Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Marketing Emails</p>
                <p className="text-xs text-slate-500">Receive updates and special offers</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.marketing_emails}
                  onChange={(e) => updateSetting('marketing_emails', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Newsletter</p>
                <p className="text-xs text-slate-500">Monthly tips and insights</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.newsletter}
                  onChange={(e) => updateSetting('newsletter', e.target.checked)}
                  className="sr-only peer"
                />
                <span className="absolute inset-0 bg-slate-300 rounded-full peer-checked:bg-blue-600 transition cursor-pointer"></span>
                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-6"></span>
              </label>
            </div>
          </div>
        </Card>

        {/* Legal Links */}
        <Card variant="elevated" className="p-6 bg-white border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Legal & Support</h2>
          <div className="space-y-3">
            <Link
              href="/terms"
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition"
            >
              <span className="text-slate-800">Terms of Service</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/privacy"
              className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition"
            >
              <span className="text-slate-800">Privacy Policy</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </Card>

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center"
        >
          {saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </Button>

        {/* Danger Zone */}
        <Card variant="elevated" className="p-6 border-2 border-red-200 bg-white">
          <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-500 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            onClick={handleDeleteAccountClick}
            className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  )
}

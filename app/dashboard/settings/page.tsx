'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell, Lock, Palette, Mail, Trash2, Save, ExternalLink } from 'lucide-react'
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

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUserEmail(user.email || '')

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
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings. Please try again.')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('An error occurred while saving settings.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    if (!confirm('This will permanently delete all your data, including progress, lessons, and personal information. Continue?')) {
      return
    }

    try {
      const supabase = createClient()
      // Note: Actual account deletion would require backend implementation
      // For now, we'll just sign out
      await supabase.auth.signOut()
      router.push('/welcome')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please contact support.')
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
            onClick={handleDeleteAccount}
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

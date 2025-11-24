'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUserName(user.user_metadata?.full_name || 'User')
        setEmail(user.email || '')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/welcome')
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <button 
            onClick={() => router.push('/dashboard/settings')}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mr-4">
            👤
          </div>
          <div>
            <h2 className="text-xl font-bold">{userName}</h2>
            <p className="text-white/80 text-sm">{email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Stats Card */}
        <Card variant="elevated" className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-gray-600">Current Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">1</p>
              <p className="text-xs text-gray-600">Day</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">0</p>
              <p className="text-xs text-gray-600">Lessons</p>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <div className="space-y-3">
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/dashboard/settings')}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Settings</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/privacy')}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>

          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/terms')}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Terms of Service</span>
              <span className="text-gray-400">→</span>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="lg"
          className="w-full mt-6"
          disabled={loading}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {loading ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    </div>
  )
}


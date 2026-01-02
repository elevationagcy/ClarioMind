'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdmin } from '@/lib/auth/check-admin'
import { Logo } from '@/components/ui/logo'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Target, MessageSquare, Music, Users, BarChart3 } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    const admin = await isAdmin()
    if (!admin) {
      router.push('/dashboard')
      return
    }
    setAuthorized(true)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking permissions...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null

  const adminCards = [
    {
      title: 'Lessons',
      description: 'Create and manage daily lessons',
      icon: BookOpen,
      href: '/admin/lessons/new',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Challenges',
      description: 'Add guided challenges',
      icon: Target,
      href: '/admin/challenges/new',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Quizzes',
      description: 'Create quiz questions',
      icon: MessageSquare,
      href: '/admin/quizzes/new',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Meditations',
      description: 'Upload meditation audio',
      icon: Music,
      href: '/admin/meditations/new',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Analytics',
      description: 'View app statistics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white shadow-lg flex items-center justify-between">
        <div>
          <Logo size="md" className="brightness-0 invert mb-1" />
        <p className="text-white/80">Manage your app content and users</p>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
          Admin
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">30</div>
            <div className="text-sm text-gray-600">Lessons</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-sm text-gray-600">Challenges</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-sm text-gray-600">Meditations</div>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminCards.map((card) => {
            const Icon = card.icon
            return (
              <Card
                key={card.title}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(card.href)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Manage
                </Button>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}


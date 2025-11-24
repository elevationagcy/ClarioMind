'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, BookOpen, Play, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: 'Daily Task',
      href: '/dashboard',
      icon: Sun,
      activePattern: /^\/dashboard(\/lesson)?/,
    },
    {
      name: 'Toolkit',
      href: '/dashboard/toolkit',
      icon: BookOpen,
      activePattern: /^\/dashboard\/toolkit/,
    },
    {
      name: 'Discover',
      href: '/dashboard/discover',
      icon: Play,
      activePattern: /^\/dashboard\/discover/,
    },
    {
      name: 'Me',
      href: '/dashboard/profile',
      icon: User,
      activePattern: /^\/dashboard\/profile/,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.activePattern.test(pathname)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}


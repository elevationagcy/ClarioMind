'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-16',
  xl: 'h-20',
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('relative', sizeClasses[size], className)} style={{ aspectRatio: '1.5' }}>
      <Image
        src="/assets/clariomind.png"
        alt="ClarioMind"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}

export function LogoIcon({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('relative', sizeClasses[size], className)} style={{ aspectRatio: '1.5' }}>
      <Image
        src="/assets/clariomind.png"
        alt="ClarioMind"
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}

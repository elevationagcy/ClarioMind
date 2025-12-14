'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-10 w-24',
  md: 'h-12 w-32',
  lg: 'h-16 w-40',
  xl: 'h-20 w-52',
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <Image
        src="/assets/clariomind.png"
        alt="ClarioMind"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  )
}

export function LogoIcon({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <Image
        src="/assets/clariomind.png"
        alt="ClarioMind"
        fill
        className="object-contain object-left"
        priority
      />
    </div>
  )
}

'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'value'> {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, value, onChange, min = 0, max = 100, step = 1, suffix = '', ...props }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              ref={ref}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className={cn(
                'w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6',
                '[&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md',
                '[&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6',
                '[&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:rounded-full',
                '[&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0',
                className
              )}
              style={{
                background: `linear-gradient(to right, #2563EB 0%, #2563EB ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
              }}
              {...props}
            />
          </div>
          <div className="min-w-[80px] text-right">
            <span className="text-xl font-bold text-primary">
              {value}{suffix}
            </span>
          </div>
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }


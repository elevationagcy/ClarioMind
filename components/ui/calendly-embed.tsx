'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CalendlyEmbedProps {
  url?: string
  className?: string
}

export function CalendlyEmbed({ 
  url = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/anna-clariomind/15min",
  className = ""
}: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load Calendly script
    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
    
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }

    // Give Calendly time to initialize
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`relative bg-white ${className}`} style={{ minHeight: '750px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 rounded-2xl">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading calendar...</p>
        </div>
      )}
      <div 
        className="calendly-inline-widget" 
        data-url={url}
        style={{ minWidth: '320px', height: '750px', position: 'relative' }}
      />
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CalendlyEmbedProps {
  className?: string
}

export function CalendlyEmbed({ className = "" }: CalendlyEmbedProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  const baseUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/anna-clariomind/15min"
  const iframeUrl = `${baseUrl}?hide_event_type_details=1&hide_gdpr_banner=1&embed_domain=${typeof window !== 'undefined' ? window.location.host : ''}&embed_type=Inline`

  return (
    <div className={`relative bg-white ${className}`} style={{ minHeight: '700px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading calendar...</p>
        </div>
      )}
      <iframe
        src={iframeUrl}
        width="100%"
        height="700"
        frameBorder="0"
        title="Schedule a meeting"
        onLoad={() => setIsLoading(false)}
        style={{ border: 'none', minWidth: '320px' }}
      />
    </div>
  )
}


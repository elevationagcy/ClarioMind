'use client'

import { useEffect, useCallback, useState } from 'react'
import { X, Calendar, Loader2 } from 'lucide-react'

interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  url?: string
  title?: string
}

export function CalendlyModal({ 
  isOpen, 
  onClose, 
  url = "https://calendly.com/anna-clariomind/30min",
  title = "Book a Session"
}: CalendlyModalProps) {
  const [isLoading, setIsLoading] = useState(true)

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      setIsLoading(true)

      // Load Calendly script
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
      
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://assets.calendly.com/assets/external/widget.js'
        script.async = true
        document.body.appendChild(script)
      }

      // Give Calendly time to initialize
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h3>
              <p className="text-sm text-slate-500">Select a time that works for you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/80 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Calendly Widget Container */}
        <div className="relative bg-white" style={{ minHeight: '650px' }}>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10">
              <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
              <p className="text-sm text-slate-500">Loading calendar...</p>
            </div>
          )}
          <div 
            className="calendly-inline-widget" 
            data-url={url}
            style={{ minWidth: '320px', height: '650px' }}
          />
        </div>
      </div>
    </div>
  )
}

// Convenience button component
interface BookingButtonProps {
  children?: React.ReactNode
  className?: string
  calendlyUrl?: string
  modalTitle?: string
}

export function BookingButton({ 
  children = "Book a Session",
  className = "",
  calendlyUrl,
  modalTitle
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-all duration-200 active:scale-95 ${className}`}
      >
        <Calendar className="w-4 h-4" />
        {children}
      </button>
      <CalendlyModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        url={calendlyUrl}
        title={modalTitle}
      />
    </>
  )
}

// Hook for custom implementations
export function useCalendlyModal() {
  const [isOpen, setIsOpen] = useState(false)
  
  return {
    isOpen,
    openModal: () => setIsOpen(true),
    closeModal: () => setIsOpen(false),
    CalendlyModalComponent: (props: Omit<CalendlyModalProps, 'isOpen' | 'onClose'>) => (
      <CalendlyModal isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
    )
  }
}


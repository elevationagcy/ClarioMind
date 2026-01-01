import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const error_description = searchParams.get('error_description')
  const error_code = searchParams.get('error_code')

  // Check for expired token error from Supabase redirect
  if (error_code === 'otp_expired' || error_description?.toLowerCase().includes('expired')) {
    console.error('Auth callback error: Link expired', { error_code, error_description })
    return NextResponse.redirect(`${origin}/auth/login?error=link_expired&message=${encodeURIComponent('This verification link has expired. Please request a new confirmation email.')}`)
  }

  // If there's any other error from Supabase, redirect with error
  if (error_description || error_code) {
    console.error('Auth callback error:', { error_code, error_description })
    return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed&reason=${encodeURIComponent(error_description || error_code || 'unknown')}`)
  }

  const supabase = await createClient()

  // Method 1: PKCE code exchange (when code param is present - this is the modern flow)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.session) {
      // User is now authenticated - redirect to onboarding or dashboard
      // Check if they've completed onboarding by checking their profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', data.session.user.id)
        .single()
      
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        return NextResponse.redirect(`${origin}/onboarding/intro`)
    }
    }
    
    if (error) {
    console.error('Code exchange error:', error)
      // If token expired, redirect with helpful message
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        return NextResponse.redirect(`${origin}/auth/login?error=link_expired&message=${encodeURIComponent('This verification link has expired. Please request a new one.')}`)
      }
      return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed&reason=${encodeURIComponent(error.message)}`)
    }
  }

  // Method 2: Token hash verification (legacy email confirmation flow)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })
    
    if (!error && data.session) {
      // User is now authenticated
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('user_id', data.session.user.id)
        .single()
      
      if (profile?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        return NextResponse.redirect(`${origin}/onboarding/intro`)
    }
    }
    
    if (error) {
    console.error('OTP verification error:', error)
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        return NextResponse.redirect(`${origin}/auth/login?error=link_expired&message=${encodeURIComponent('This verification link has expired. Please request a new one.')}`)
      }
      return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed&reason=${encodeURIComponent(error.message)}`)
    }
  }

  // No code or token_hash provided
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed&reason=missing_parameters`)
}


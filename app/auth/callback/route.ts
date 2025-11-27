import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const error_description = searchParams.get('error_description')

  // If there's an error from Supabase, redirect with error
  if (error_description) {
    return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`)
  }

  const supabase = await createClient()

  // Method 1: PKCE code exchange (when code param is present)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/auth/login?confirmed=true`)
    }
    console.error('Code exchange error:', error)
  }

  // Method 2: Token hash verification (email/signup confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })
    
    if (!error) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/auth/login?confirmed=true`)
    }
    console.error('OTP verification error:', error)
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`)
}


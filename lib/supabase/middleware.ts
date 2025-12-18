import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define route types
  const pathname = request.nextUrl.pathname
  const publicRoutes = ['/welcome', '/auth/login', '/auth/register', '/privacy', '/terms', '/quiz']
  const apiRoutes = ['/api/stripe']
  const authCallbackRoute = '/auth/callback'
  const subscriptionExpiredRoute = '/subscription-expired'
  // Allow these routes for canceled users to manage their subscription
  const allowedForCanceledUsers = ['/dashboard/settings', '/dashboard/profile']
  const isRootPath = pathname === '/'
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isApiRoute = apiRoutes.some(route => pathname.startsWith(route))
  const isAuthCallback = pathname.startsWith(authCallbackRoute)
  const isSubscriptionExpired = pathname.startsWith(subscriptionExpiredRoute)
  const isAllowedForCanceled = allowedForCanceledUsers.some(route => pathname === route)

  // Allow auth callback to process (needed for email confirmation flow)
  if (isAuthCallback) {
    return supabaseResponse
  }

  // Allow API routes (like Stripe webhooks) to pass through
  if (isApiRoute) {
    return supabaseResponse
  }

  // Root path "/" - redirect to welcome (let page.tsx handle it)
  if (isRootPath && !user) {
    return supabaseResponse
  }

  // If user is logged in and on root or public routes, redirect to dashboard
  if (user && (isRootPath || isPublicRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // If user is not signed in and trying to access protected route, redirect to welcome
  if (!user && !isPublicRoute && !isRootPath && !isApiRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/welcome'
    return NextResponse.redirect(url)
  }

  // If user is signed in, check onboarding and subscription status
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('completed_onboarding, has_paid, subscription_status')
      .eq('user_id', user.id)
      .single()

    // Check subscription status - redirect to expired page if subscription is canceled
    // But allow access to settings and profile pages so user can manage/resubscribe
    if (profile && 
        profile.has_paid === false && 
        profile.subscription_status === 'canceled' &&
        !isSubscriptionExpired && 
        !isAllowedForCanceled &&
        !pathname.startsWith('/onboarding') &&
        !pathname.startsWith('/tutorial')) {
      const url = request.nextUrl.clone()
      url.pathname = '/subscription-expired'
      return NextResponse.redirect(url)
    }

    // If user is on subscription-expired page but has active subscription, redirect to dashboard
    if (profile && profile.has_paid === true && isSubscriptionExpired) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // If no profile exists or onboarding not completed, redirect to install-app first
    if ((!profile || !profile.completed_onboarding) && 
        !pathname.startsWith('/onboarding') &&
        !pathname.startsWith('/tutorial') &&
        !pathname.startsWith('/install-app') &&
        !isSubscriptionExpired) {
      const url = request.nextUrl.clone()
      url.pathname = '/install-app'
      return NextResponse.redirect(url)
    }

    // If onboarding completed and trying to access onboarding or install-app, redirect to dashboard
    if (profile && profile.completed_onboarding && 
        (pathname.startsWith('/onboarding') || pathname.startsWith('/tutorial') || pathname.startsWith('/install-app'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}


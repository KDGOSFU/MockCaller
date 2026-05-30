import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute  = createRouteMatcher(['/login(.*)', '/sign-up(.*)'])
const isManagerRoute = createRouteMatcher(['/managers-dashboard(.*)', '/feedback-analytics(.*)', '/call-scenarios(.*)'])
const isTraineeRoute = createRouteMatcher(['/trainee(.*)'])
const isRootRoute    = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  if (!isPublicRoute(request) && !userId) {
    return redirectToSignIn({ returnBackUrl: request.url })
  }

  const role = (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role

  if (!role) return NextResponse.next()

  // After login, route to the correct dashboard based on role
  if (isRootRoute(request)) {
    const dest = role === 'manager' ? '/managers-dashboard' : '/trainee/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (isManagerRoute(request) && role !== 'manager') {
    return NextResponse.redirect(new URL('/trainee/dashboard', request.url))
  }

  if (isTraineeRoute(request) && role !== 'trainee') {
    return NextResponse.redirect(new URL('/managers-dashboard', request.url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}

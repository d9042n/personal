import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Token storage keys to prevent typos and ensure consistency
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Get the token from the cookies
  const accessToken = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value
  const refreshToken = request.cookies.get(STORAGE_KEYS.REFRESH_TOKEN)?.value

  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/register'

  // Check if the path requires authentication (e.g., dashboard)
  const isProtectedPath = path.startsWith('/dashboard')

  // If the path is public and user is authenticated, redirect to dashboard
  if (isPublicPath && accessToken) {
    const user = request.cookies.get(STORAGE_KEYS.USER)?.value
    const username = user ? JSON.parse(user).username : ''
    return NextResponse.redirect(new URL(`/dashboard/${username}`, request.url))
  }

  // If the path requires authentication and user is not authenticated
  if (isProtectedPath && !accessToken && !refreshToken) {
    const searchParams = new URLSearchParams({
      error: 'Please log in to continue',
      callbackUrl: path,
    })
    return NextResponse.redirect(new URL(`/login?${searchParams}`, request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
} 
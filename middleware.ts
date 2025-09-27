import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define role-based route access
const roleBasedRoutes = {
  '/draft': ['Law', 'Management', 'Internal'],
  '/validation': ['Law', 'Management', 'Internal'],
  '/dashboard': ['Management', 'Internal'],
  '/vault': ['Law', 'Management', 'Internal'],
  '/admin': ['Internal'], 
} as const

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/unauthorized', '/not-found']

// Get user role from session/cookies (you'll need to implement based on your auth system)
function getUserRole(request: NextRequest): string | null {
  // For now, we'll use a cookie or header to get the role
  // In a real app, you'd validate a JWT token or check session
  const userRole = request.cookies.get('userRole')?.value || 
                   request.headers.get('x-user-role')
  
  return userRole
}

function getUserId(request: NextRequest): string | null {
  const userId = request.cookies.get('userId')?.value || 
                 request.headers.get('x-user-id')
  
  return userId
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Get user authentication info
  const userRole = getUserRole(request)
  const userId = getUserId(request)
  
  // If user is not authenticated, redirect to home/login
  if (!userId || !userRole) {
    const loginUrl = new URL('/', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Check if the route requires role-based access
  const requiredRoles = roleBasedRoutes[pathname as keyof typeof roleBasedRoutes]
  
  if (requiredRoles) {
    // Check if user's role has access to this route
    const hasAccess = requiredRoles.includes(userRole as any)
    
    if (!hasAccess) {
      // Redirect to unauthorized page
      const unauthorizedUrl = new URL('/unauthorized', request.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
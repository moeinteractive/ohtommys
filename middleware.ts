import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add the Permissions-Policy header
  response.headers.set(
    'Permissions-Policy',
    'private-state-token-redemption=(), private-state-token-issuance=(), browsing-topics=()'
  )

  return response
}

export const config = {
  matcher: '/:path*',
} 
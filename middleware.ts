import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/full-menu',
  '/specials',
  '/events',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
  '/api/menu(.*)',
  '/api/content(.*)',
  '/api/events(.*)',
  '/api/facebook-posts(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  // If the request is not for a public route, protect it
  if (!isPublicRoute(request)) {
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip all static files, public assets, and images
    '/((?!_next/static|_next/image|images|favicon.ico).*)',
    '/',
    '/(api|trpc)/:path*',
  ],
};

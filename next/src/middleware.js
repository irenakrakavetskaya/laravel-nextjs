import { NextResponse } from 'next/server'

export function middleware(request) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
}

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    //matcher option specify that it should run on specific paths.
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
// define Middleware in the root of your project, at the same level as pages or app, or inside src
import { NextResponse } from 'next/server'

export function middleware(request) {
    // Getting cookies from the request using the `RequestCookies` API
    let cookie = request.cookies.get('laravel_session')
    // !!! all console.log info can be checked on terminal where npm run dev
    console.log(cookie)
    const allCookies = request.cookies.getAll()
    console.log(allCookies)

    request.cookies.has('laravel_session') // => true
    request.cookies.delete('laravel_session')
    request.cookies.has('laravel_session') // => false

    // Setting cookies on the response using the `ResponseCookies` API
    const response = NextResponse.next()
    response.cookies.set('test', '1')
    response.cookies.set({
        name: 'test',
        value: '2',
        path: '/',
    })
    cookie = response.cookies.get('test')
    console.log(cookie) // => { name: 'test', value: '2', Path: '/' }
    // The outgoing response will have a `Set-Cookie:test=fast;path=/` header.

    // Clone the request headers and set a new header `x-next-app-version`
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-next-app-version', '1.0');

    // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-laravel-app-version', '3.0');

    //only for training
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        //return NextResponse.rewrite(new URL('/invoices', request.url))
        //or
        //return NextResponse.redirect(new URL('/invoices', request.url))
    }
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
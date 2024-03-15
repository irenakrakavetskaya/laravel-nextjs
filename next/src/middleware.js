// define Middleware in the root of your project, at the same level as pages or app, or inside src
import { NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['en', 'ru']
let defaultLocale = 'en'

function getLocale(request) {
    const negotiatorHeaders = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages() // from browser => Array(5) [ru-BY,  ru, en-US, en, ru-RU]
    const locale = match(languages, locales, defaultLocale) // => en-US

    return locale
}

export function middleware(request) {
    //only for training
    /*
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
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        //return NextResponse.rewrite(new URL('/invoices', request.url))
        //or
        //return NextResponse.redirect(new URL('/invoices', request.url))
    }
    */

    // Check if there is any supported locale in the pathname
    const { pathname } = request.nextUrl // => /dashboard
    if (pathname.startsWith(`/blog`)) return
    const pathnameHasLocale = locales.some(
        locale =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    ) //false
    if (pathnameHasLocale) return
    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`

    // e.g. incoming request is /products
    // The new URL is now /en-US/products

    return NextResponse.redirect(request.nextUrl)
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
}

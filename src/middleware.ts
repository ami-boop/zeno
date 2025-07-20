import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const PUBLIC_PATHS = ['/login', '/']

function isPublicPath(pathname: string): boolean {
	const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')

	return PUBLIC_PATHS.some(publicPath => {
		if (publicPath === '/') {
			return cleanPath === '/' || cleanPath === ''
		}
		return cleanPath === publicPath || cleanPath.startsWith(publicPath + '/')
	})
}

function getLocaleFromPath(pathname: string): string {
	const match = pathname.match(/^\/([a-z]{2})(\/|$)/)
	return match ? match[1] : 'en'
}

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!

if (!FIREBASE_PROJECT_ID) {
	throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set')
}

const JWKS = createRemoteJWKSet(
	new URL(
		'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
	)
)

export async function validateFirebaseIdToken(token: string): Promise<boolean> {
	try {
		const { payload } = await jwtVerify(token, JWKS, {
			issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
			audience: FIREBASE_PROJECT_ID,
		})
		return true
	} catch (error) {
		return false
	}
}

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const idToken = request.cookies.get('idToken')?.value

	if (isPublicPath(pathname)) {
		return createMiddleware(routing)(request)
	}

	if (!idToken) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		return NextResponse.redirect(loginUrl)
	}

	const isValidToken = await validateFirebaseIdToken(idToken)

	if (!isValidToken) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.nextUrl.origin)
		const response = NextResponse.redirect(loginUrl)
		response.cookies.delete('idToken')
		return response
	}

	return createMiddleware(routing)(request)
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
	],
}

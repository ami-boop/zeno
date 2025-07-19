import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'

const PUBLIC_PATHS = ['/login', '/']

function isPublicPath(pathname: string): boolean {
	const cleanPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/')

	// Проверяем точное совпадение или начало пути
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

const JWKS = createRemoteJWKSet(
	new URL(
		'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
	)
)

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!

export async function validateFirebaseIdToken(token: string): Promise<boolean> {
	try {
		await jwtVerify(token, JWKS, {
			issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
			audience: FIREBASE_PROJECT_ID,
		})
		return true
	} catch (e) {
		return false
	}
}

export default async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const intlResponse = createMiddleware(routing)(request)
	const idToken = request.cookies.get('idToken')?.value

	if (isPublicPath(pathname)) {
		return intlResponse
	}

	if (!idToken || !(await validateFirebaseIdToken(idToken))) {
		const locale = getLocaleFromPath(pathname)
		const loginUrl = new URL(`/${locale}/login`, request.url)
		return NextResponse.redirect(loginUrl)
	}

	// Если пользователь аутентифицирован, возвращаем интернационализацию
	return intlResponse
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
	],
}

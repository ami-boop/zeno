import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/']

function isPublicPath(pathname: string): boolean {
	// Удаляем локаль из пути для проверки
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

export default async function middleware(request: NextRequest) {
	// TODO: create cookie validation
	const { pathname } = request.nextUrl

	// Сначала применяем интернационализацию
	const intlResponse = createMiddleware(routing)(request)

	// Получаем токен из оригинального запроса
	const idToken = request.cookies.get('idToken')?.value

	if (isPublicPath(pathname)) {
		return intlResponse
	}

	// Если путь не публичный, проверяем аутентификацию
	if (!idToken) {
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

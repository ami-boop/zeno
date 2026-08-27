import { headers } from 'next/headers'
import { getSessionToken } from './getSessionToken'

export type UserRole = 'student' | 'parent' | 'admin'

type TokenPayload = {
	role?: unknown
	user_id?: string
	sub?: string
}

export const decodeIdTokenPayload = (token: string): TokenPayload | null => {
	try {
		const [, payload] = token.split('.')
		if (!payload) return null
		const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
		const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
		return JSON.parse(atob(padded)) as TokenPayload
	} catch {
		return null
	}
}

export const getRoleFromToken = (token: string): UserRole | null => {
	const payload = decodeIdTokenPayload(token)
	if (!payload || typeof payload.role !== 'string') return null

	switch (payload.role) {
		case 'student':
			return 'student'
		case 'parent':
			return 'parent'
		case 'admin':
			return 'admin'
		default:
			return null
	}
}

export const getUidFromToken = (token: string): string | null => {
	const payload = decodeIdTokenPayload(token)
	return payload?.user_id || payload?.sub || null
}

export async function getUserRole(): Promise<UserRole | null> {
	const token = await getSessionToken()
	if (!token) return null
	return getRoleFromToken(token)
}

export async function getSessionUid(): Promise<string | null> {
	const header = (await headers()).get('authorization')
	if (!header?.toLowerCase().startsWith('bearer ')) return null
	return getUidFromToken(header.slice(7).trim())
}

export const dashboardPathForRole = (role: UserRole | null, locale: string): string =>
	role === 'parent' ? `/${locale}/parent/dashboard` : `/${locale}/dashboard`

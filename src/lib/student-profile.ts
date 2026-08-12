import { API_URL } from '@/constants'
import type { Parent, StudentProfile } from '@/components/profile/types'

const isNullableString = (value: unknown): value is string | null =>
	value === null || typeof value === 'string'

const isParent = (value: unknown): value is Parent => {
	if (!value || typeof value !== 'object') return false

	const parent = value as Record<string, unknown>
	return (
		typeof parent.name === 'string' &&
		typeof parent.phone === 'string' &&
		typeof parent.relationship === 'string' &&
		typeof parent.isPrimary === 'boolean'
	)
}

const isStudentProfile = (value: unknown): value is StudentProfile => {
	if (!value || typeof value !== 'object') return false

	const profile = value as Record<string, unknown>
	return (
		typeof profile.name === 'string' &&
		isNullableString(profile.classId) &&
		isNullableString(profile.routeId) &&
		isNullableString(profile.stopId) &&
		Array.isArray(profile.parents) &&
		profile.parents.every(isParent) &&
		typeof profile.byBus === 'boolean' &&
		isNullableString(profile.time)
	)
}

export async function fetchStudentProfile(
	session: string | undefined
): Promise<StudentProfile | null> {
	try {
		const response = await fetch(`${API_URL}/students`, {
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${session ?? ''}`,
			},
			cache: 'no-store',
		})

		if (!response.ok) return null

		const payload: unknown = await response.json()
		return isStudentProfile(payload) ? payload : null
	} catch {
		return null
	}
}

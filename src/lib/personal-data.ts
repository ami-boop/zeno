import { createHash } from 'node:crypto'
import { revalidateTag, unstable_cache } from 'next/cache'
import { API_URL } from '@/constants'

export type PersonalEndpoint = 'students' | 'report-time' | 'route-stops' | 'lessons'

const hashSession = (session: string) =>
	createHash('sha256').update(session).digest('hex')

const getTag = (endpoint: PersonalEndpoint, session: string) =>
	`zeno:${endpoint}:${hashSession(session)}`

async function fetchPersonalData(endpoint: PersonalEndpoint, session: string): Promise<unknown | null> {
	try {
		const response = await fetch(`${API_URL}/${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${session}`,
			},
			cache: 'no-store',
		})

		if (!response.ok) return null
		return await response.json()
	} catch {
		return null
	}
}

export function getPersonalData(endpoint: PersonalEndpoint, session: string | undefined) {
	if (!session) return fetchPersonalData(endpoint, '')

	const tag = getTag(endpoint, session)
	const cachedFetch = unstable_cache(
		() => fetchPersonalData(endpoint, session),
		['zeno-personal-data', endpoint, hashSession(session)],
		{ revalidate: 30, tags: [tag] }
	)

	return cachedFetch()
}

export async function invalidatePersonalData(session: string | undefined) {
	if (!session) return

	await Promise.all(
		(['students', 'report-time', 'route-stops', 'lessons'] as PersonalEndpoint[]).map(endpoint =>
			revalidateTag(getTag(endpoint, session))
		)
	)
}

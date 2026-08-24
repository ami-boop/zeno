import { createHash } from 'node:crypto'
import { revalidateTag, unstable_cache } from 'next/cache'
import { API_URL } from '@/constants'

export type PersonalEndpoint = 'students' | 'report-time' | 'route-stops' | 'lessons' | 'friend-students'

const hashSession = (session: string) => createHash('sha256').update(session).digest('hex')

const getTag = (endpoint: PersonalEndpoint, session: string) => `zeno:${endpoint}:${hashSession(session)}`

const buildUrl = (endpoint: PersonalEndpoint, params?: Record<string, string | number | undefined>) => {
	const url = new URL(`${API_URL}/${endpoint}`)
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

async function fetchPersonalData(
	endpoint: PersonalEndpoint,
	session: string,
	params?: Record<string, string | number | undefined>,
): Promise<unknown> {
	const response = await fetch(buildUrl(endpoint, params), {
		headers: {
			'Content-Type': 'application/json',
			Cookie: `sessionCookie=${session}`,
		},
		cache: 'no-store',
	})

	if (!response.ok) {
		throw new Error(`personal data ${endpoint} failed: ${response.status}`)
	}
	return response.json()
}

export async function getPersonalData(
	endpoint: PersonalEndpoint,
	session: string | undefined,
	params?: Record<string, string | number | undefined>,
): Promise<unknown | null> {
	if (!session) {
		try {
			return await fetchPersonalData(endpoint, '', params)
		} catch {
			return null
		}
	}

	const paramsKey = JSON.stringify(params ?? {})
	const tag = getTag(endpoint, session)
	const cachedFetch = unstable_cache(
		() => fetchPersonalData(endpoint, session, params),
		['zeno-personal-data', endpoint, hashSession(session), paramsKey],
		{ revalidate: 30, tags: [tag] },
	)

	try {
		return await cachedFetch()
	} catch {
		try {
			return await fetchPersonalData(endpoint, session, params)
		} catch {
			return null
		}
	}
}

export async function invalidatePersonalData(session: string | undefined) {
	if (!session) return

	await Promise.all(
		(['students', 'report-time', 'route-stops', 'lessons', 'friend-students'] as PersonalEndpoint[]).map((endpoint) =>
			revalidateTag(getTag(endpoint, session)),
		),
	)
}

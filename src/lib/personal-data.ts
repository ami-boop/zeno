import { revalidateTag, unstable_cache } from 'next/cache'
import { API_URL } from '@/constants'

export type PersonalEndpoint = 'students' | 'report-time' | 'route-stops' | 'lessons' | 'friend-students'

type TokenPayload = { user_id?: string; sub?: string }

const decodeTokenUid = (token: string): string | undefined => {
	try {
		const [, payload] = token.split('.')
		if (!payload) return undefined
		const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload
		return decoded.user_id || decoded.sub
	} catch {
		return undefined
	}
}

const getTag = (endpoint: PersonalEndpoint, token: string) => `zeno:${endpoint}:${decodeTokenUid(token) ?? 'anon'}`

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
	token: string,
	params?: Record<string, string | number | undefined>,
): Promise<unknown> {
	const response = await fetch(buildUrl(endpoint, params), {
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
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
	token: string | undefined,
	params?: Record<string, string | number | undefined>,
): Promise<unknown | null> {
	if (!token) return null

	const paramsKey = JSON.stringify(params ?? {})
	const tag = getTag(endpoint, token)
	const cachedFetch = unstable_cache(
		() => fetchPersonalData(endpoint, token, params),
		['zeno-personal-data', endpoint, decodeTokenUid(token) ?? 'anon', paramsKey],
		{ revalidate: 30, tags: [tag] },
	)

	try {
		return await cachedFetch()
	} catch {
		try {
			return await fetchPersonalData(endpoint, token, params)
		} catch {
			return null
		}
	}
}

export async function invalidatePersonalData(token: string | undefined) {
	if (!token) return

	await Promise.all(
		(['students', 'report-time', 'route-stops', 'lessons', 'friend-students'] as PersonalEndpoint[]).map((endpoint) =>
			revalidateTag(getTag(endpoint, token)),
		),
	)
}

import { revalidateTag, unstable_cache } from 'next/cache'
import { apiGet } from './client'

export type PersonalEndpoint = 'students' | 'report-time' | 'route-stops' | 'lessons' | 'students/friends'

const PERSONAL_ENDPOINTS: PersonalEndpoint[] = [
	'students',
	'report-time',
	'route-stops',
	'lessons',
	'students/friends',
]

type TokenPayload = { user_id?: string; sub?: string }

const decodeTokenUid = (token: string): string => {
	try {
		const [, payload] = token.split('.')
		if (!payload) return 'anon'
		const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TokenPayload
		return decoded.user_id || decoded.sub || 'anon'
	} catch {
		return 'anon'
	}
}

export const getPersonalDataTag = (endpoint: PersonalEndpoint, token: string): string =>
	`zeno:${endpoint}:${decodeTokenUid(token)}`

export async function getPersonalData(
	endpoint: PersonalEndpoint,
	token: string | undefined,
	params?: Record<string, string | number | undefined>,
): Promise<unknown | null> {
	if (!token) return null

	const uid = decodeTokenUid(token)
	const paramsKey = JSON.stringify(params ?? {})
	const tag = getPersonalDataTag(endpoint, token)
	const cachedFetch = unstable_cache(
		() => apiGet(endpoint, token, { params }),
		['zeno-personal-data', endpoint, uid, paramsKey],
		{ revalidate: 30, tags: [tag] },
	)

	try {
		return await cachedFetch()
	} catch {
		try {
			return await apiGet(endpoint, token, { params })
		} catch {
			return null
		}
	}
}

export async function invalidatePersonalData(token: string | undefined): Promise<void> {
	if (!token) return

	await Promise.all(
		PERSONAL_ENDPOINTS.map((endpoint) => revalidateTag(getPersonalDataTag(endpoint, token))),
	)
}

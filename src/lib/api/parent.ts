import {
	parseParentDashboard,
	parseBusTracking,
	type ParentDashboard,
	type BusTracking,
} from '@/lib/api-contracts'
import { apiGet, apiPost } from './client'
import { getUidFromToken } from '@/utils/auth-roles'
import { revalidateTag, unstable_cache } from 'next/cache'

export const getParentDataTag = (uid: string): string => `zeno:parent:${uid}`

export async function fetchParentDashboard(token: string | undefined): Promise<ParentDashboard | null> {
	if (!token) return null

	const uid = getUidFromToken(token)
	if (!uid) return null

	const tag = getParentDataTag(uid)
	const cachedFetch = unstable_cache(
		() => apiGet('parent', token),
		['zeno-parent-dashboard', uid],
		{ revalidate: 30, tags: [tag] },
	)

	try {
		return parseParentDashboard(await cachedFetch())
	} catch {
		try {
			return parseParentDashboard(await apiGet('parent', token))
		} catch {
			return null
		}
	}
}

export type ApproveAction = 'approve' | 'reject'

export async function approveChildFriendTrip(
	token: string,
	childUid: string,
	action: ApproveAction,
): Promise<{ ok: boolean; status: number; alreadyResponded: boolean; managerDecided: boolean }> {
	const { ok, status, data } = await apiPost(`parent/friend-requests/${childUid}`, token, { action })
	const payload = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>
	return {
		ok,
		status,
		alreadyResponded: payload.alreadyResponded === true,
		managerDecided: status === 409,
	}
}

export async function invalidateParentData(token: string): Promise<void> {
	const uid = getUidFromToken(token)
	if (!uid) return
	revalidateTag(getParentDataTag(uid))
}

export async function fetchParentChildBusTracking(
	token: string | undefined,
	childUid: string,
): Promise<BusTracking | null> {
	if (!token || !childUid) return null

	try {
		const payload = await apiGet(`parent/children/${childUid}/bus-tracking`, token)
		return parseBusTracking(payload)
	} catch {
		return null
	}
}

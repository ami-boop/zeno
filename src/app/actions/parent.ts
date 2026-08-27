'use server'

import { revalidatePath } from 'next/cache'
import { getSessionToken } from '@/utils/getSessionToken'
import { approveChildFriendTrip, invalidateParentData, fetchParentChildBusTracking, type ApproveAction } from '@/lib/api/parent'
import type { BusTracking } from '@/lib/api-contracts'

export type ApproveResult =
	| { success: true }
	| { success: false; error: 'unauthorized' | 'conflict' | 'requestFailed' }

const isAction = (value: string): value is ApproveAction => value === 'approve' || value === 'reject'

export async function submitFriendApproval(childUid: string, action: string): Promise<ApproveResult> {
	if (!childUid || !isAction(action)) {
		return { success: false, error: 'requestFailed' }
	}

	try {
		const token = await getSessionToken()
		if (!token) return { success: false, error: 'unauthorized' }

		const result = await approveChildFriendTrip(token, childUid, action)

		if (!result.ok && result.status === 401) {
			return { success: false, error: 'unauthorized' }
		}
		if (result.managerDecided) {
			return { success: false, error: 'conflict' }
		}
		if (!result.ok && !result.alreadyResponded) {
			return { success: false, error: 'requestFailed' }
		}

		await invalidateParentData(token)
		revalidatePath('/parent/dashboard', 'layout')
		return { success: true }
	} catch {
		return { success: false, error: 'requestFailed' }
	}
}

export async function loadParentChildBusTracking(childUid: string): Promise<BusTracking | null> {
	try {
		const token = await getSessionToken()
		if (!token) return null
		return fetchParentChildBusTracking(token, childUid)
	} catch {
		return null
	}
}

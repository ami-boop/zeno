'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { postReturnStatus } from '@/lib/api/submissions'
import { invalidatePersonalData } from '@/lib/api/personal-data'

export type ReturnStatusInput = {
	byBus: boolean
	selectedTime: string
	friendUid?: string
	sleepover?: boolean
	note?: string
}

export type ReturnStatusResult = {
	success: boolean
	status: number
}

export async function submitReturnStatus(input: ReturnStatusInput): Promise<ReturnStatusResult> {
	try {
		const token = await getSessionToken()
		if (!token) return { success: false, status: 401 }

		const { ok, status } = await postReturnStatus(token, { ...input })
		if (ok) await invalidatePersonalData(token)

		return { success: ok, status }
	} catch {
		return { success: false, status: 500 }
	}
}

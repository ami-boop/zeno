'use server'

import { API_URL } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'
import { invalidatePersonalData } from '@/lib/personal-data'

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

const MAX_NOTE_LENGTH = 200

export async function submitReturnStatus(input: ReturnStatusInput): Promise<ReturnStatusResult> {
	try {
		const session = await getSessionToken()
		if (!session) return { success: false, status: 401 }

		const response = await fetch(`${API_URL}/return-status/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session}`,
			},
			body: JSON.stringify({ ...input, note: input.note?.slice(0, MAX_NOTE_LENGTH) }),
			cache: 'no-store',
		})

		if (response.ok) await invalidatePersonalData(session)

		return { success: response.ok, status: response.status }
	} catch {
		return { success: false, status: 500 }
	}
}

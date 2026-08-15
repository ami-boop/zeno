'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

type FeedbackResult =
	| { success: true }
	| { success: false; error: string }

export async function submitFeedback(question: string): Promise<FeedbackResult> {
	const sanitizedQuestion = question.trim()

	if (!sanitizedQuestion) {
		return { success: false, error: 'Question is required' }
	}

	if (sanitizedQuestion.length > 150) {
		return { success: false, error: 'Question is too long' }
	}

	try {
		const sessionCookie = await getSessionToken()
		if (!sessionCookie) {
			return { success: false, error: 'Unauthorized' }
		}

		const response = await fetch(`${API_URL}/feedback`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${sessionCookie}`,
			},
			body: JSON.stringify({ question: sanitizedQuestion }),
			cache: 'no-store',
		})

		if (response.ok) return { success: true }

		const body = (await response.json().catch(() => null)) as
			| { error?: string; message?: string }
			| null

		return {
			success: false,
			error: body?.error || body?.message || 'Failed to submit feedback',
		}
	} catch {
		return { success: false, error: 'Failed to submit feedback' }
	}
}

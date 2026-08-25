'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

export type FeedbackError = 'required' | 'tooLong' | 'unauthorized' | 'requestFailed'

type FeedbackResult = { success: true } | { success: false; error: FeedbackError }

const MAX_QUESTION_LENGTH = 150

export async function submitFeedback(question: string): Promise<FeedbackResult> {
	const sanitizedQuestion = question.trim()

	if (!sanitizedQuestion) {
		return { success: false, error: 'required' }
	}

	if (sanitizedQuestion.length > MAX_QUESTION_LENGTH) {
		return { success: false, error: 'tooLong' }
	}

	try {
		const sessionCookie = await getSessionToken()
		if (!sessionCookie) {
			return { success: false, error: 'unauthorized' }
		}

		const response = await fetch(`${API_URL}/feedback/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${sessionCookie}`,
			},
			body: JSON.stringify({ question: sanitizedQuestion }),
			cache: 'no-store',
		})

		return response.ok ? { success: true } : { success: false, error: 'requestFailed' }
	} catch {
		return { success: false, error: 'requestFailed' }
	}
}

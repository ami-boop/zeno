'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { postFeedback } from '@/lib/api/submissions'

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
		const token = await getSessionToken()
		if (!token) {
			return { success: false, error: 'unauthorized' }
		}

		const { ok } = await postFeedback(token, sanitizedQuestion)
		return ok ? { success: true } : { success: false, error: 'requestFailed' }
	} catch {
		return { success: false, error: 'requestFailed' }
	}
}

'use server'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)

export async function submitFeedback(question: string) {
	try {
		// Проверка аутентификации на сервере
		const sessionCookie = getSessionToken()

		if (!sessionCookie) {
			throw new Error('Unauthorized')
		}

		if (!question || question.trim().length === 0) {
			throw new Error('Question is required')
		}

		if (question.length > 250) {
			throw new Error('Question is too long')
		}

		// Санитизация данных
		const sanitizedQuestion = question.trim()

		// Сохранение в базу данных
		const response = await fetch(
			`${API_URL}/feedback`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: `sessionCookie=${sessionCookie}`,
				},
				body: JSON.stringify({
					question: sanitizedQuestion,
					createdAt: dayjs().tz('Asia/Jerusalem').format('HH:mm'),
				}),
			}
		)

		if (!response.ok) {
			throw new Error('Failed to submit feedback')
		}

		return { success: true }
	} catch {
		return {
			success: false,
		}
	}
}

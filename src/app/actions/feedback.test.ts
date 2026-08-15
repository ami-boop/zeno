import { API_URL } from '@/constants'
import { submitFeedback } from './feedback'

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

describe('submitFeedback', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('posts only question to the v2.1 feedback endpoint', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200 })

		await expect(submitFeedback('  Bus feedback  ')).resolves.toEqual({ success: true })
		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/feedback`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: 'sessionCookie=session-token',
			},
			body: JSON.stringify({ question: 'Bus feedback' }),
			cache: 'no-store',
		})
	})

	it.each(['error', 'message'])('returns backend %s errors', async field => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: false,
			status: 400,
			json: async () => ({ [field]: 'Backend validation failed' }),
		})

		await expect(submitFeedback('Question')).resolves.toEqual({
			success: false,
			error: 'Backend validation failed',
		})
	})

	it('rejects questions over the backend limit', async () => {
		await expect(submitFeedback('a'.repeat(151))).resolves.toEqual({
			success: false,
			error: 'Question is too long',
		})
		expect(global.fetch).not.toHaveBeenCalled()
	})
})

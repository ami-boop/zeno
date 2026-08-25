import { API_URL } from '@/constants'
import { submitFeedback } from '../feedback'

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
		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/feedback/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer session-token',
			},
			body: JSON.stringify({ question: 'Bus feedback' }),
			cache: 'no-store',
		})
	})

	it.each([400, 401, 500])('maps backend failure %i to a stable error key', async (status) => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: false,
			status,
			json: async () => ({ error: 'Backend validation failed' }),
		})

		await expect(submitFeedback('Question')).resolves.toEqual({
			success: false,
			error: 'requestFailed',
		})
	})

	it('rejects empty questions without calling the backend', async () => {
		await expect(submitFeedback('   ')).resolves.toEqual({
			success: false,
			error: 'required',
		})
		expect(global.fetch).not.toHaveBeenCalled()
	})

	it('rejects questions over the limit without calling the backend', async () => {
		await expect(submitFeedback('a'.repeat(151))).resolves.toEqual({
			success: false,
			error: 'tooLong',
		})
		expect(global.fetch).not.toHaveBeenCalled()
	})
})

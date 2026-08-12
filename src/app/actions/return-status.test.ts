import { API_URL } from '@/constants'
import { submitReturnStatus } from './return-status'

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

describe('submitReturnStatus', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('posts the v2.1 payload through the backend API', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: true, status: 200 })

		await expect(
			submitReturnStatus({ byBus: true, selectedTime: '15:35' })
		).resolves.toEqual({ success: true, status: 200 })

		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/return-status/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: 'sessionCookie=session-token',
			},
			body: JSON.stringify({ byBus: true, selectedTime: '15:35' }),
			cache: 'no-store',
		})
	})

	it('returns the deadline status without converting it to success', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 403 })

		await expect(
			submitReturnStatus({ byBus: true, selectedTime: '15:35' })
		).resolves.toEqual({ success: false, status: 403 })
	})
})

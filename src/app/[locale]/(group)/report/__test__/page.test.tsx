import { render, screen } from '@testing-library/react'
import { API_URL } from '@/constants'
import ReportPage from '../page'

jest.mock('next-intl/server', () => ({
	getTranslations: jest.fn(async () => (key: string) => key),
}))

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

describe('Report page contract flow', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('shows a localized error state for an unavailable report-time response', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 503 })

		const page = await ReportPage()
		render(page)

		expect(screen.getByRole('alert')).toHaveTextContent('loadErrorTitle')
		expect(screen.getByRole('button', { name: 'retry' })).toBeInTheDocument()
		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/report-time`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer session-token',
			},
			cache: 'no-store',
		})
	})
})

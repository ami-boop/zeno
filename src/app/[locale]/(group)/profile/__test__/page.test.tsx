import { render, screen } from '@testing-library/react'
import { API_URL } from '@/constants'
import { fetchStudentProfile } from '@/lib/student-profile'
import StudentProfilePage from '../page'

jest.mock('next-intl/server', () => ({
	getTranslations: jest.fn(async () => (key: string) => key),
}))

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

jest.mock('@/lib/student-profile', () => {
	const actual = jest.requireActual('@/lib/student-profile')
	return {
		...actual,
		fetchStudentProfile: jest.fn(actual.fetchStudentProfile),
	}
})

const validProfile = {
	name: 'Mikhail Sakhnenko',
	classId: 'yud_alef_9',
	routeId: 'route_A',
	stopId: 'stop_kfar_tavor',
	parents: [
		{
			name: 'Parent First',
			phone: '051-382-3759',
			relationship: 'father',
			isPrimary: true,
		},
	],
	byBus: true,
	time: '15:35',
}

describe('fetchStudentProfile', () => {
	beforeEach(() => {
		jest.clearAllMocks()
		;(fetchStudentProfile as jest.Mock).mockImplementation(
			jest.requireActual('@/lib/student-profile').fetchStudentProfile
		)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('accepts the v2.1 student profile response shape', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => validProfile,
		})

		await expect(fetchStudentProfile('session-token')).resolves.toEqual(validProfile)
		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/students`, {
			headers: {
				'Content-Type': 'application/json',
				Cookie: 'sessionCookie=session-token',
			},
			cache: 'no-store',
		})
	})

	it('renders the v2.1 profile and its status badge', async () => {
		;(fetchStudentProfile as jest.Mock).mockResolvedValue(validProfile)

		const page = await StudentProfilePage()
		const { container } = render(page)

		expect(screen.getByRole('heading', { level: 2, name: 'busYes' })).toBeInTheDocument()
		expect(screen.getByText('statusOn')).toBeInTheDocument()
		expect(container).toHaveTextContent('15:35')
	})

	it.each([401, 404])('returns null for HTTP %s responses', async status => {
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: false, status })

		await expect(fetchStudentProfile('session-token')).resolves.toBeNull()
	})

	it('returns null for an invalid response shape', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({ students: [validProfile] }),
		})

		await expect(fetchStudentProfile('session-token')).resolves.toBeNull()
	})

	it('returns null when the request fails', async () => {
		;(global.fetch as jest.Mock).mockRejectedValue(new Error('network error'))

		await expect(fetchStudentProfile('session-token')).resolves.toBeNull()
	})
})

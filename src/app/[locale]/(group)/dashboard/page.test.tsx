import { render, screen } from '@testing-library/react'
import { API_URL } from '@/constants'
import DashboardPage from './page'

jest.mock('next-intl/server', () => ({
	getTranslations: jest.fn(async () => (key: string) => key),
}))

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

const student = {
	name: 'Student',
	classId: 'class_A',
	routeId: 'route_A',
	stopId: 'student-stop',
	parents: [],
	byBus: false,
	time: null,
}

const reportTime = {
	times: ['15:35'],
	defaultTime: '15:35',
	submitted: true,
	submittedTime: '15:35',
}

const routeStops = {
	routeId: 'route_A',
	name: 'Route A',
	stopsMorning: [{ stopId: 'morning-stop', order: 1, durationMin: 10 }],
	stopsAfternoon: [
		{ stopId: 'other-stop', order: 1, durationMin: 10 },
		{ stopId: 'student-stop', order: 2, durationMin: 15 },
	],
}

const response = (body: unknown, ok = true) => ({
	ok,
	json: async () => body,
})

const mockDashboardResponses = (studentPayload: unknown = student) => {
	;(global.fetch as jest.Mock).mockImplementation((url: string) => {
		if (url === `${API_URL}/students`) return Promise.resolve(response(studentPayload))
		if (url === `${API_URL}/report-time`) return Promise.resolve(response(reportTime))
		return Promise.resolve(response(routeStops))
	})
}

describe('Dashboard contract flow', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('uses the object student response, route name, stop order, and submitted time without byBus', async () => {
		mockDashboardResponses()

		const page = await DashboardPage()
		render(page)

		expect(screen.getAllByText('Route A')).toHaveLength(2)
		expect(screen.getByText('submittedTime: 15:35')).toBeInTheDocument()
		expect(screen.getByText('2 / 2')).toBeInTheDocument()
		expect(screen.queryByText('byBus')).not.toBeInTheDocument()
		expect((global.fetch as jest.Mock).mock.calls.every(([, options]) => options.cache === 'no-store')).toBe(true)
	})

	it('shows an error state for the old students array shape instead of no bus data', async () => {
		mockDashboardResponses({ students: [student] })

		const page = await DashboardPage()
		render(page)

		expect(screen.getByRole('alert')).toHaveTextContent('loadErrorTitle')
		expect(screen.queryByText('noBus')).not.toBeInTheDocument()
	})
})

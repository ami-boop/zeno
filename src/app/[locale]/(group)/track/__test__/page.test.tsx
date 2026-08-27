import { render, screen } from '@testing-library/react'
import { API_URL } from '@/constants'
import TrackPage from '../page'

jest.mock('next-intl/server', () => ({
	getTranslations: jest.fn(async () => (key: string) => key),
}))

jest.mock('@/utils/getSessionToken', () => ({
	getSessionToken: jest.fn(async () => 'session-token'),
}))

jest.mock('@/components/track/TrackMap', () => ({
	__esModule: true,
	default: () => <div data-testid='track-map' />,
}))

jest.mock('@/app/actions/bus-tracking', () => ({
	fetchBusTracking: jest.fn(async () => null),
}))

const trackingPayload = {
	trip: {
		tripId: '2026-08-25_route_A_1535',
		routeId: 'route_A',
		scheduledTime: '15:35',
		scheduledAtISO: '2026-08-25T12:35:00.000Z',
		status: 'scheduled',
	},
	bus: {
		licensePlate: '12-345-67',
		capacity: 55,
		driverName: 'Dudu Cohen',
		driverPhone: '050-1234567',
	},
	stops: [
		{ stopId: 'stop_school', name: 'School Gate', order: 1, lat: 32.72, lng: 35.29 },
		{ stopId: 'stop_home', name: 'Kaduri Center', order: 2, lat: 32.71, lng: 35.28 },
	],
	studentStopId: 'stop_home',
	live: null,
	serverTimeISO: '2026-08-25T12:30:00.000Z',
}

const response = (body: unknown, ok = true) => ({
	ok,
	status: ok ? 200 : 404,
	json: async () => body,
})

describe('Track page contract flow', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('renders trip status, departure time, driver and stops from a valid payload', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue(response(trackingPayload))

		const page = await TrackPage()
		render(page)

		expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/bus-tracking`, expect.objectContaining({ cache: 'no-store' }))
		expect(screen.getByTestId('track-map')).toBeInTheDocument()
		expect(screen.getByText('15:35')).toBeInTheDocument()
		expect(screen.getByText('Dudu Cohen')).toBeInTheDocument()
		expect(screen.getAllByText('status.scheduled').length).toBeGreaterThan(0)
		expect(screen.getByText('12-345-67')).toBeInTheDocument()
		expect(screen.getByText(/Kaduri Center/)).toHaveTextContent('yourStop')
	})

	it('shows the no-trip state when the backend has no trip today', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue(response({ error: 'No trip today' }, false))

		const page = await TrackPage()
		render(page)

		expect(screen.getByText('noTripTitle')).toBeInTheDocument()
		expect(screen.queryByTestId('track-map')).not.toBeInTheDocument()
	})

	it('falls back to the no-trip state when the payload fails the contract guard', async () => {
		;(global.fetch as jest.Mock).mockResolvedValue(response({ trip: { tripId: 'broken' } }))

		const page = await TrackPage()
		render(page)

		expect(screen.getByText('noTripTitle')).toBeInTheDocument()
	})
})

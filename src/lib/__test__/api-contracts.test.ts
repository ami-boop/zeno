import { isRouteStops, parseReportTime } from '../api-contracts'

describe('API contracts', () => {
	it('normalizes the canonical and legacy report submitted fields', () => {
		const payload = {
			times: ['15:35'],
			defaultTime: '15:35',
			submited: true,
			submittedTime: '15:35',
		}

		expect(parseReportTime(payload)).toEqual({
			times: ['15:35'],
			defaultTime: '15:35',
			submitted: true,
			submittedTime: '15:35',
		})
	})

	it('rejects an error payload and malformed report-time data', () => {
		expect(parseReportTime({ error: 'unavailable' })).toBeNull()
		expect(parseReportTime({ times: [], defaultTime: null, submittedTime: null })).toBeNull()
	})

	it('normalizes backend friend statuses into the frontend friend trip status', () => {
		const base = { times: ['15:35'], defaultTime: null, submitted: true, submittedTime: '15:35' }

		expect(parseReportTime({ ...base, friendTrip: { status: 'pending' } })).toEqual({
			...base,
			friendTrip: 'pending',
		})
		expect(
			parseReportTime({ ...base, friendTrip: { status: 'manager_approved' } })?.friendTrip,
		).toBe('approved')
		expect(
			parseReportTime({ ...base, friendTrip: { status: 'manager_rejected' } })?.friendTrip,
		).toBe('rejected')

		expect(parseReportTime(base)?.friendTrip).toBeUndefined()
		expect(parseReportTime({ ...base, friendTrip: { status: 'nonsense' } })?.friendTrip).toBeUndefined()
	})

	it('accepts route stops by name and preserves the API order', () => {
		const route = {
			routeId: 'route_A',
			name: 'Route A',
			stopsMorning: [{ stopId: 'morning', order: 1, durationMin: 10 }],
			stopsAfternoon: [{ stopId: 'student', order: 2, durationMin: 15 }],
		}

		expect(isRouteStops(route)).toBe(true)
		expect(route.stopsAfternoon[0].order).toBe(2)
	})
})

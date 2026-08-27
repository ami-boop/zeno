import {
	isRouteStops,
	parseBusTracking,
	parseParentDashboard,
	parseReportTime,
} from '../api-contracts'

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
		{ stopId: 'stop_school', name: 'School', order: 1, lat: 32.72, lng: 35.29 },
		{ stopId: 'stop_home', name: 'Home', order: 2, lat: 32.71, lng: 35.28 },
	],
	studentStopId: 'stop_home',
	live: { lat: 32.715, lng: 35.285, heading: 180, speedKmh: 40, updatedAtMs: 1724588100000 },
	serverTimeISO: '2026-08-25T12:30:00.000Z',
}

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

	it('parses a full bus-tracking payload including live position', () => {
		const parsed = parseBusTracking(trackingPayload)

		expect(parsed?.trip.tripId).toBe('2026-08-25_route_A_1535')
		expect(parsed?.bus?.driverName).toBe('Dudu Cohen')
		expect(parsed?.stops).toHaveLength(2)
		expect(parsed?.studentStopId).toBe('stop_home')
		expect(parsed?.live).toEqual(trackingPayload.live)
	})

	it('keeps bus and live null when the backend has none', () => {
		const parsed = parseBusTracking({
			...trackingPayload,
			bus: null,
			live: null,
		})

		expect(parsed?.bus).toBeNull()
		expect(parsed?.live).toBeNull()
	})

	it('drops malformed live positions but keeps the rest', () => {
		const parsed = parseBusTracking({
			...trackingPayload,
			live: { lat: 'not-a-number', lng: 35 },
		})

		expect(parsed?.live).toBeNull()
		expect(parsed?.trip.scheduledTime).toBe('15:35')
	})

	it('filters malformed stops out of the list', () => {
		const parsed = parseBusTracking({
			...trackingPayload,
			stops: [
				{ stopId: 'ok', name: 'Ok', order: 1, lat: 1, lng: 2 },
				{ stopId: 'bad', name: 'Bad' },
				null,
				{ stopId: 'no-coords-ok-too', name: 'No Coords', order: 3, lat: null, lng: null },
			],
		})

		expect(parsed?.stops.map((stop) => stop.stopId)).toEqual(['ok', 'no-coords-ok-too'])
		expect(parsed?.stops[1].lat).toBeNull()
	})

	it('parses the road-following path and rejects broken geometry', () => {
		const parsed = parseBusTracking({
			...trackingPayload,
			path: [
				[35.39, 32.69],
				[35.35, 32.66],
			],
		})
		expect(parsed?.path).toEqual([
			[35.39, 32.69],
			[35.35, 32.66],
		])

		expect(parseBusTracking({ ...trackingPayload, path: null })?.path).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, path: [] })?.path).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, path: [[35.3]] })?.path).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, path: [[35.3, 'x']] })?.path).toBeNull()
	})

	it('parses server-side stop etas and rejects malformed values', () => {
		const withEtas = parseBusTracking({ ...trackingPayload, etas: { stop_school: 12, stop_home: 25 } })
		expect(withEtas?.etas).toEqual({ stop_school: 12, stop_home: 25 })

		expect(parseBusTracking({ ...trackingPayload, etas: null })?.etas).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, etas: {} })?.etas).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, etas: { s: 0 } })?.etas).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, etas: { s: 'fast' } })?.etas).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, etas: [12] })?.etas).toBeNull()
	})

	it('rejects payloads without a valid trip or server time', () => {
		expect(parseBusTracking(null)).toBeNull()
		expect(parseBusTracking({ error: 'No trip today' })).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, trip: null })).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, serverTimeISO: 'not-a-date' })).toBeNull()
		expect(parseBusTracking({ ...trackingPayload, trip: { ...trackingPayload.trip, scheduledAtISO: 'oops' } })).toBeNull()
	})
})

describe('parseParentDashboard', () => {
	const pendingFriendRoute = {
		toRouteId: 'route_B',
		toStopId: 'stop_b1',
		note: 'Back by 20:00',
		parentStatus: 'pending',
		parentRespondedAt: null,
		managerRespondedAt: null,
		sleepover: true,
		friendUid: 'friend-9',
		friendName: 'Ariel Mizrahi',
	}

	const dashboardPayload = {
		parent: {
			uid: 'parent-1',
			firstName: 'David',
			lastName: 'Cohen',
			email: 'parent@example.com',
		},
		children: [
			{
				uid: 'child-1',
				firstName: 'Maya',
				lastName: 'Cohen',
				classId: 'yud_alef_1',
				defaultRouteId: 'route_A',
				defaultStopId: 'stop_center',
				today: {
					status: 'going',
					time: '15:35',
					origin: 'friend_route',
					tripId: '2026-08-27_route_B_1535',
					stopId: 'stop_b1',
					friendRoute: pendingFriendRoute,
					friendApprovalUrl: 'https://zeno.example/he/friend-approve/token123',
				},
				tracking: { status: 'in_transit', live: true, etaToStop: 7 },
			},
			{
				uid: 'child-2',
				firstName: 'Ariel',
				lastName: 'Mizrahi',
				classId: null,
				defaultRouteId: null,
				defaultStopId: null,
				today: null,
			},
		],
	}

	it('parses the full parent dashboard payload', () => {
		const parsed = parseParentDashboard(dashboardPayload)
		expect(parsed).not.toBeNull()
		expect(parsed?.parent.uid).toBe('parent-1')
		expect(parsed?.children).toHaveLength(2)

		const withFriend = parsed?.children[0]
		expect(withFriend?.today?.friendRoute?.parentStatus).toBe('pending')
		expect(withFriend?.today?.friendRoute?.sleepover).toBe(true)
		expect(withFriend?.today?.friendRoute?.note).toBe('Back by 20:00')
		expect(withFriend?.today?.friendRoute?.friendUid).toBe('friend-9')
		expect(withFriend?.today?.friendRoute?.friendName).toBe('Ariel Mizrahi')
		expect(withFriend?.tracking?.status).toBe('in_transit')
		expect(withFriend?.tracking?.live).toBe(true)
		expect(withFriend?.tracking?.etaToStop).toBe(7)

		const withoutReport = parsed?.children[1]
		expect(withoutReport?.today).toBeNull()
		expect(withoutReport?.tracking).toBeNull()
	})

	it('degrades malformed tracking summary to null', () => {
		const parsed = parseParentDashboard({
			...dashboardPayload,
			children: [
				{
					...dashboardPayload.children[0],
					tracking: { status: 42, live: 'yes', etaToStop: 'soon' },
				},
			],
		})
		const child = parsed?.children[0]
		expect(child?.tracking).not.toBeNull()
		expect(child?.tracking?.status).toBeNull()
		expect(child?.tracking?.live).toBe(false)
		expect(child?.tracking?.etaToStop).toBeNull()
	})

	it('keeps today without friend route and normalizes optional fields', () => {
		const parsed = parseParentDashboard({
			...dashboardPayload,
			children: [
				{
					...dashboardPayload.children[0],
					today: {
						status: 'going',
						time: '16:00',
						origin: 'system_default',
						tripId: 'trip-1',
						stopId: 'stop_center',
					},
				},
			],
		})

		expect(parsed?.children[0].today?.friendRoute).toBeNull()
		expect(parsed?.children[0].today?.status).toBe('going')
	})

	it('maps all five parent statuses', () => {
		for (const parentStatus of ['pending', 'approved', 'rejected', 'manager_approved', 'manager_rejected']) {
			const parsed = parseParentDashboard({
				...dashboardPayload,
				children: [
					{
						...dashboardPayload.children[0],
						today: {
							status: 'going',
							time: '15:35',
							origin: 'friend_route',
							tripId: 'trip-1',
							stopId: 'stop_b1',
							friendRoute: { ...pendingFriendRoute, parentStatus },
							friendApprovalUrl: null,
						},
					},
				],
			})
			expect(parsed?.children[0].today?.friendRoute?.parentStatus).toBe(parentStatus)
		}
	})

	it('degrades unknown friend statuses to no friend route, keeps the child', () => {
		const parsed = parseParentDashboard({
			...dashboardPayload,
			children: [
				dashboardPayload.children[0],
				{
					...dashboardPayload.children[1],
					today: {
						status: 'going',
						time: null,
						origin: null,
						tripId: null,
						stopId: null,
						friendRoute: { ...pendingFriendRoute, parentStatus: 'hacked' },
						friendApprovalUrl: null,
					},
				},
			],
		})

		expect(parsed?.children).toHaveLength(2)
		expect(parsed?.children[0].today?.friendRoute?.parentStatus).toBe('pending')
		expect(parsed?.children[1].uid).toBe('child-2')
		expect(parsed?.children[1].today?.friendRoute).toBeNull()
		expect(parsed?.children[1].today?.status).toBe('going')
	})

	it('returns null on malformed payloads', () => {
		expect(parseParentDashboard(null)).toBeNull()
		expect(parseParentDashboard({})).toBeNull()
		expect(parseParentDashboard({ ...dashboardPayload, parent: null })).toBeNull()
		expect(parseParentDashboard({ ...dashboardPayload, parent: { uid: 1 } })).toBeNull()
	})
})

import type { RouteStops, LessonsSchedule } from '@/components/schedule/types'
import {
	isString,
	isNullableString,
	isNullableNumber,
	isRecord,
	isNonNegativeNumber,
	parseISODateString,
} from '@/utils/type-guards'

// ----------------------------------------------------------------------------
// Shared contract types
// ----------------------------------------------------------------------------

export type FriendStudent = {
	uid: string
	firstName: string
	lastName: string
	classId: string | null
	routeId: string | null
	routeName: string | null
	stopId: string | null
	stopName: string | null
	sameClass: boolean
	sameParallel: boolean
}

export type FriendTripStatus = 'pending' | 'approved' | 'rejected'

export type ReportTime = {
	times: string[]
	defaultTime: string | null
	submitted: boolean
	submittedTime: string | null
	friendTrip?: FriendTripStatus
}

export type FriendStudentsPage = {
	students: FriendStudent[]
	total: number
	offset: number
	limit: number
}

export type LiveBusPosition = {
	lat: number
	lng: number
	heading: number | null
	speedKmh: number | null
	updatedAtMs: number | null
}

export type TrackingStop = {
	stopId: string
	name: string
	order: number
	lat: number | null
	lng: number | null
}

export type TrackingBus = {
	licensePlate: string
	capacity: number
	driverName: string | null
	driverPhone: string | null
}

export type BusTracking = {
	trip: {
		tripId: string
		routeId: string
		scheduledTime: string
		scheduledAtISO: string
		status: string
	}
	bus: TrackingBus | null
	stops: TrackingStop[]
	path: Array<[number, number]> | null
	etas: Record<string, number> | null
	studentStopId: string | null
	latenessMin: number | null
	latenessState: LatenessState | null
	lateDepartureMinutes?: number | null
	live: LiveBusPosition | null
	serverTimeISO: string
}

export type LatenessState = 'early' | 'on-time' | 'late' | 'very-late'

const LATENESS_STATES: readonly string[] = ['early', 'on-time', 'late', 'very-late']

const parseLatenessMin = (value: unknown): number | null =>
	typeof value === 'number' && Number.isInteger(value) ? value : null

const parseLatenessState = (value: unknown): LatenessState | null =>
	typeof value === 'string' && (LATENESS_STATES as readonly string[]).includes(value)
		? (value as LatenessState)
		: null

export type ParentFriendStatus =
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'manager_approved'
	| 'manager_rejected'

export type ParentFriendRouteInfo = {
	toRouteId: string | null
	toStopId: string | null
	note: string | null
	parentStatus: ParentFriendStatus
	parentRespondedAt: string | null
	managerRespondedAt: string | null
	sleepover: boolean
	friendUid: string | null
	friendName: string | null
}

export type ParentChildToday = {
	status: string | null
	time: string | null
	origin: string | null
	tripId: string | null
	stopId: string | null
	friendRoute: ParentFriendRouteInfo | null
	friendApprovalUrl: string | null
}

export type ParentChildTracking = {
	status: string | null
	live: boolean
	etaToStop: number | null
	latenessMin: number | null
	latenessState: LatenessState | null
	lateDepartureMinutes?: number | null
}

export type ParentChild = {
	uid: string
	firstName: string
	lastName: string
	classId: string | null
	defaultRouteId: string | null
	defaultStopId: string | null
	today: ParentChildToday | null
	tracking: ParentChildTracking | null
}

export type ParentDashboard = {
	parent: {
		uid: string
		firstName: string
		lastName: string
		email: string
	}
	children: ParentChild[]
}

// ----------------------------------------------------------------------------
// Friend trip status
// ----------------------------------------------------------------------------

const parseFriendTripStatus = (value: unknown): FriendTripStatus | undefined => {
	switch (value) {
		case 'pending':
			return 'pending'
		case 'approved':
		case 'manager_approved':
			return 'approved'
		case 'rejected':
		case 'manager_rejected':
			return 'rejected'
		default:
			return undefined
	}
}

// ----------------------------------------------------------------------------
// Report time
// ----------------------------------------------------------------------------

export const parseReportTime = (value: unknown): ReportTime | null => {
	if (!isRecord(value)) return null

	const submitted = value.submitted ?? value.submited
	if (
		!(
			Array.isArray(value.times) &&
			value.times.every(isString) &&
			isNullableString(value.defaultTime) &&
			typeof submitted === 'boolean' &&
			isNullableString(value.submittedTime)
		)
	)
		return null

	const friendTripStatus = parseFriendTripStatus(
		isRecord(value.friendTrip) ? value.friendTrip.status : undefined,
	)

	return {
		times: value.times,
		defaultTime: value.defaultTime,
		submitted,
		submittedTime: value.submittedTime,
		...(friendTripStatus ? { friendTrip: friendTripStatus } : {}),
	}
}

export const isReportTime = (value: unknown): value is ReportTime => parseReportTime(value) !== null

// ----------------------------------------------------------------------------
// Schedule
// ----------------------------------------------------------------------------

export const isRouteStops = (value: unknown): value is RouteStops => {
	if (!isRecord(value)) return false

	const isStops = (stops: unknown) =>
		Array.isArray(stops) &&
		stops.every((stop) => {
			if (!isRecord(stop)) return false
			return (
				isString(stop.stopId) &&
				typeof stop.order === 'number' &&
				Number.isFinite(stop.order) &&
				typeof stop.durationMin === 'number' &&
				Number.isFinite(stop.durationMin)
			)
		})

	return isString(value.routeId) && isString(value.name) && isStops(value.stopsMorning) && isStops(value.stopsAfternoon)
}

export const isLessonsSchedule = (value: unknown): value is LessonsSchedule => {
	if (!isRecord(value)) return false
	if (!value.endTimes || typeof value.endTimes !== 'object') return false
	return Object.values(value.endTimes).every(isString)
}

// ----------------------------------------------------------------------------
// Bus tracking
// ----------------------------------------------------------------------------

const MAX_PATH_POINTS = 10_000

const parsePath = (value: unknown): Array<[number, number]> | null => {
	if (!Array.isArray(value) || value.length < 2 || value.length > MAX_PATH_POINTS) return null

	const path: Array<[number, number]> = []
	for (const point of value) {
		if (!Array.isArray(point) || point.length < 2) return null
		// The API sends [lng, lat] pairs; both must be finite numbers.
		const lng = point[0]
		const lat = point[1]
		if (typeof lng !== 'number' || typeof lat !== 'number') return null
		if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null
		path.push([lng, lat])
	}
	return path
}

const parseEtas = (value: unknown): Record<string, number> | null => {
	if (!isRecord(value)) return null

	const etas: Record<string, number> = {}
	for (const [stopId, minutes] of Object.entries(value)) {
		if (!stopId) return null
		if (!isNonNegativeNumber(minutes) || minutes < 1) return null
		etas[stopId] = minutes
	}
	return Object.keys(etas).length > 0 ? etas : null
}

const parseLivePosition = (value: unknown): LiveBusPosition | null => {
	if (!isRecord(value)) return null
	// Coordinates may be negative; require finite numbers, not ≥ 0.
	if (typeof value.lat !== 'number' || !Number.isFinite(value.lat)) return null
	if (typeof value.lng !== 'number' || !Number.isFinite(value.lng)) return null
	if (!isNullableNumber(value.heading) || !isNullableNumber(value.speedKmh)) return null
	if (!isNullableNumber(value.updatedAtMs)) return null

	return {
		lat: value.lat,
		lng: value.lng,
		heading: value.heading,
		speedKmh: value.speedKmh,
		updatedAtMs: value.updatedAtMs,
	}
}

export const parseBusTracking = (value: unknown): BusTracking | null => {
	if (!isRecord(value)) return null
	const trip = isRecord(value.trip) ? value.trip : null
	if (!trip) return null

	if (
		!isString(trip.tripId) ||
		!isString(trip.routeId) ||
		!isString(trip.scheduledTime) ||
		!isString(trip.scheduledAtISO) ||
		parseISODateString(trip.scheduledAtISO) === null ||
		!isString(trip.status)
	)
		return null

	const stops = Array.isArray(value.stops)
		? value.stops.filter((stop): stop is TrackingStop => {
				if (!isRecord(stop)) return false
				return (
					isString(stop.stopId) &&
					isString(stop.name) &&
					typeof stop.order === 'number' &&
					Number.isFinite(stop.order) &&
					isNullableNumber(stop.lat) &&
					isNullableNumber(stop.lng)
				)
			})
		: []

	let bus: TrackingBus | null = null
	if (isRecord(value.bus) && isString(value.bus.licensePlate) && typeof value.bus.capacity === 'number') {
		bus = {
			licensePlate: value.bus.licensePlate,
			capacity: value.bus.capacity,
			driverName: isNullableString(value.bus.driverName) ? value.bus.driverName : null,
			driverPhone: isNullableString(value.bus.driverPhone) ? value.bus.driverPhone : null,
		}
	}

	if (!isString(value.serverTimeISO) || parseISODateString(value.serverTimeISO) === null) return null

	return {
		trip: {
			tripId: trip.tripId,
			routeId: trip.routeId,
			scheduledTime: trip.scheduledTime,
			scheduledAtISO: trip.scheduledAtISO,
			status: trip.status,
		},
		bus,
		stops,
		path: parsePath(value.path),
		etas: parseEtas(value.etas),
		studentStopId: isNullableString(value.studentStopId) ? value.studentStopId : null,
		latenessMin: parseLatenessMin(value.latenessMin),
		latenessState: parseLatenessState(value.latenessState),
		lateDepartureMinutes: parseLatenessMin(value.lateDepartureMinutes),
		live: parseLivePosition(value.live),
		serverTimeISO: value.serverTimeISO,
	}
}

// ----------------------------------------------------------------------------
// Friend students
// ----------------------------------------------------------------------------

export const parseFriendStudentsPage = (value: unknown): FriendStudentsPage | null => {
	if (!isRecord(value)) return null

	if (
		!Array.isArray(value.students) ||
		typeof value.total !== 'number' ||
		typeof value.offset !== 'number' ||
		typeof value.limit !== 'number'
	)
		return null

	const students = value.students.filter((item): item is FriendStudent => {
		if (!isRecord(item)) return false
		return isString(item.uid) && isString(item.firstName) && isString(item.lastName)
	})

	return {
		students,
		total: value.total,
		offset: value.offset,
		limit: value.limit,
	}
}

// ----------------------------------------------------------------------------
// Parent dashboard
// ----------------------------------------------------------------------------

const FRIEND_STATUSES = new Set<ParentFriendStatus>([
	'pending',
	'approved',
	'rejected',
	'manager_approved',
	'manager_rejected',
])

const parseParentFriendRoute = (value: unknown): ParentFriendRouteInfo | null => {
	if (!isRecord(value)) return null
	if (!isString(value.parentStatus) || !FRIEND_STATUSES.has(value.parentStatus as ParentFriendStatus))
		return null

	return {
		toRouteId: isNullableString(value.toRouteId) ? value.toRouteId : null,
		toStopId: isNullableString(value.toStopId) ? value.toStopId : null,
		note: isNullableString(value.note) ? value.note : null,
		parentStatus: value.parentStatus as ParentFriendStatus,
		parentRespondedAt: parseISODateString(value.parentRespondedAt),
		managerRespondedAt: parseISODateString(value.managerRespondedAt),
		sleepover: value.sleepover === true,
		friendUid: isNullableString(value.friendUid) ? value.friendUid : null,
		friendName: isNullableString(value.friendName) ? value.friendName : null,
	}
}

export const parseParentChildToday = (value: unknown): ParentChildToday | null => {
	if (!isRecord(value)) return null

	return {
		status: isNullableString(value.status) ? value.status : null,
		time: isNullableString(value.time) ? value.time : null,
		origin: isNullableString(value.origin) ? value.origin : null,
		tripId: isNullableString(value.tripId) ? value.tripId : null,
		stopId: isNullableString(value.stopId) ? value.stopId : null,
		friendRoute: parseParentFriendRoute(value.friendRoute),
		friendApprovalUrl:
			isNullableString(value.friendApprovalUrl) && value.friendApprovalUrl ? value.friendApprovalUrl : null,
	}
}

const parseParentChildTracking = (value: unknown): ParentChildTracking | null => {
	if (!isRecord(value)) return null

	return {
		status: isNullableString(value.status) ? value.status : null,
		live: value.live === true,
		etaToStop: isNonNegativeNumber(value.etaToStop) ? value.etaToStop : null,
		latenessMin: parseLatenessMin(value.latenessMin),
		latenessState: parseLatenessState(value.latenessState),
		lateDepartureMinutes: parseLatenessMin(value.lateDepartureMinutes),
	}
}

const parseParentChild = (value: unknown): ParentChild | null => {
	if (!isRecord(value)) return null
	if (!isString(value.uid) || !isString(value.firstName) || !isString(value.lastName)) return null

	return {
		uid: value.uid,
		firstName: value.firstName,
		lastName: value.lastName,
		classId: isNullableString(value.classId) ? value.classId : null,
		defaultRouteId: isNullableString(value.defaultRouteId) ? value.defaultRouteId : null,
		defaultStopId: isNullableString(value.defaultStopId) ? value.defaultStopId : null,
		today: value.today == null ? null : parseParentChildToday(value.today),
		tracking: value.tracking == null ? null : parseParentChildTracking(value.tracking),
	}
}

export const parseParentDashboard = (value: unknown): ParentDashboard | null => {
	if (!isRecord(value)) return null
	const parent = isRecord(value.parent) ? value.parent : null
	if (!parent || !isString(parent.uid) || !isString(parent.firstName) || !isString(parent.lastName)) return null

	const children = Array.isArray(value.children)
		? value.children.flatMap((item): ParentChild[] => {
				const child = parseParentChild(item)
				return child ? [child] : []
			})
		: []

	return {
		parent: {
			uid: parent.uid,
			firstName: parent.firstName,
			lastName: parent.lastName,
			email: isString(parent.email) ? parent.email : '',
		},
		children,
	}
}

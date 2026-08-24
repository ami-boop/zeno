import type { RouteStops, LessonsSchedule } from '@/components/schedule/types'

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

const isNullableString = (value: unknown): value is string | null => value === null || typeof value === 'string'

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

export const parseReportTime = (value: unknown): ReportTime | null => {
	if (!value || typeof value !== 'object') return null

	const report = value as Record<string, unknown>
	const submitted = report.submitted ?? report.submited

	if (!(
		Array.isArray(report.times) &&
		report.times.every((time) => typeof time === 'string') &&
		isNullableString(report.defaultTime) &&
		typeof submitted === 'boolean' &&
		isNullableString(report.submittedTime)
	))
		return null

	const friendTripStatus = parseFriendTripStatus((report.friendTrip as Record<string, unknown> | undefined)?.status)

	return {
		times: report.times,
		defaultTime: report.defaultTime,
		submitted,
		submittedTime: report.submittedTime,
		...(friendTripStatus ? { friendTrip: friendTripStatus } : {}),
	}
}

export const isReportTime = (value: unknown): value is ReportTime => parseReportTime(value) !== null

export const isRouteStops = (value: unknown): value is RouteStops => {
	if (!value || typeof value !== 'object') return false

	const route = value as Record<string, unknown>
	const isStops = (stops: unknown) =>
		Array.isArray(stops) &&
		stops.every((stop) => {
			if (!stop || typeof stop !== 'object') return false
			const item = stop as Record<string, unknown>
			return (
				typeof item.stopId === 'string' &&
				typeof item.order === 'number' &&
				Number.isFinite(item.order) &&
				typeof item.durationMin === 'number' &&
				Number.isFinite(item.durationMin)
			)
		})

	return (
		typeof route.routeId === 'string' &&
		typeof route.name === 'string' &&
		isStops(route.stopsMorning) &&
		isStops(route.stopsAfternoon)
	)
}

const isString = (value: unknown): value is string => typeof value === 'string'

export const isLessonsSchedule = (value: unknown): value is LessonsSchedule => {
	if (!value || typeof value !== 'object') return false

	const schedule = value as Record<string, unknown>
	if (!schedule.endTimes || typeof schedule.endTimes !== 'object') return false

	return Object.values(schedule.endTimes).every(isString)
}

export type FriendStudentsPage = {
	students: FriendStudent[]
	total: number
	offset: number
	limit: number
}

export const parseFriendStudentsPage = (value: unknown): FriendStudentsPage | null => {
	if (!value || typeof value !== 'object') return null

	const page = value as Record<string, unknown>
	if (
		!Array.isArray(page.students) ||
		typeof page.total !== 'number' ||
		typeof page.offset !== 'number' ||
		typeof page.limit !== 'number'
	)
		return null

	const students = page.students.filter((item): item is FriendStudent => {
		if (!item || typeof item !== 'object') return false
		const s = item as Record<string, unknown>
		return typeof s.uid === 'string' && typeof s.firstName === 'string' && typeof s.lastName === 'string'
	})

	return {
		students,
		total: page.total,
		offset: page.offset,
		limit: page.limit,
	}
}

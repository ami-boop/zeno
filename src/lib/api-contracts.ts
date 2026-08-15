import type { RouteStops } from '@/components/schedule/types'

export type ReportTime = {
	times: string[]
	defaultTime: string | null
	submitted: boolean
	submittedTime: string | null
}

const isNullableString = (value: unknown): value is string | null =>
	value === null || typeof value === 'string'

export const parseReportTime = (value: unknown): ReportTime | null => {
	if (!value || typeof value !== 'object') return null

	const report = value as Record<string, unknown>
	const submitted = report.submitted ?? report.submited

	if (!(
		Array.isArray(report.times) &&
		report.times.every(time => typeof time === 'string') &&
		isNullableString(report.defaultTime) &&
		typeof submitted === 'boolean' &&
		isNullableString(report.submittedTime)
	)) return null

	return {
		times: report.times,
		defaultTime: report.defaultTime,
		submitted,
		submittedTime: report.submittedTime,
	}
}

export const isReportTime = (value: unknown): value is ReportTime =>
	parseReportTime(value) !== null

export const isRouteStops = (value: unknown): value is RouteStops => {
	if (!value || typeof value !== 'object') return false

	const route = value as Record<string, unknown>
	const isStops = (stops: unknown) =>
		Array.isArray(stops) &&
		stops.every(stop => {
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

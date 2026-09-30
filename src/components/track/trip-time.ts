import { getTodayDate, parseIsraelTime } from '@/lib/time'

export const DEPARTURE_GRACE_MINUTES = 5

// TODO: утренний рейс захардкожен на 08:00 — заменить на данные из trips/schedules, когда бэкенд начнёт отдавать утренний рейс
export const MORNING_DEPARTURE_TIME = '08:00'

export type RemainingState = 'minutes' | 'minute' | 'departing' | 'past'

export function classifyRemaining(remainingMs: number): RemainingState {
	if (remainingMs >= 60_000) return 'minutes'
	if (remainingMs > 0) return 'minute'
	if (remainingMs > -DEPARTURE_GRACE_MINUTES * 60_000) return 'departing'
	return 'past'
}

/** Момент ближайшего выезда в указанное время по Израилю (DST-безопасно, та же конвенция, что parseIsraelTime на бэке). */
export function nextIsraelDepartureISO(hhmm: string, clockOffsetMs: number): string {
	const parsed = parseIsraelTime(getTodayDate(Date.now() + clockOffsetMs), hhmm)
	if (Number.isNaN(parsed.getTime())) return ''
	return parsed.toISOString()
}

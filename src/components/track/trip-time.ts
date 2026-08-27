export const DEPARTURE_GRACE_MINUTES = 5

// TODO: утренний рейс захардкожен на 08:00 — заменить на данные из trips/schedules, когда бэкенд начнёт отдавать утренний рейс
export const MORNING_DEPARTURE_TIME = '08:00'
const ISRAEL_TZ = 'Asia/Jerusalem'

export type RemainingState = 'minutes' | 'minute' | 'departing' | 'past'

export function classifyRemaining(remainingMs: number): RemainingState {
	if (remainingMs >= 60_000) return 'minutes'
	if (remainingMs > 0) return 'minute'
	if (remainingMs > -DEPARTURE_GRACE_MINUTES * 60_000) return 'departing'
	return 'past'
}

type IsraelParts = Record<string, string>

const israelDateStr = (date: Date): string =>
	new Intl.DateTimeFormat('en-CA', {
		timeZone: ISRAEL_TZ,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(date)

const israelPartsOf = (date: Date): IsraelParts =>
	new Intl.DateTimeFormat('en-US', {
		timeZone: ISRAEL_TZ,
		hourCycle: 'h23',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	})
		.formatToParts(date)
		.reduce<IsraelParts>((acc, part) => {
			if (part.type !== 'literal') acc[part.type] = part.value
			return acc
		}, {})

/** Момент ближайшего выезда в указанное время по Израилю (DST-безопасно, см. parseIsraelTime на бэке). */
export function nextIsraelDepartureISO(hhmm: string, clockOffsetMs: number): string {
	const shiftedNow = new Date(Date.now() + clockOffsetMs)
	const naiveUtc = Date.parse(`${israelDateStr(shiftedNow)}T${hhmm}:00Z`)
	if (Number.isNaN(naiveUtc)) return ''

	const parts = israelPartsOf(new Date(naiveUtc))
	const asUtc = Date.UTC(
		+parts.year,
		+parts.month - 1,
		+parts.day,
		+parts.hour,
		+parts.minute,
		+parts.second,
	)
	return new Date(naiveUtc - (asUtc - naiveUtc)).toISOString()
}

export function formatClock(iso: string, locale: string): string {
	return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

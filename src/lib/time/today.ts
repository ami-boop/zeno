import { ISRAEL_TZ, israelDateStr } from './israel'

export function getTodayDate(nowMs: number = Date.now()): string {
	return israelDateStr(new Date(nowMs))
}

export function getTodayDayOfWeek(nowMs: number = Date.now()): number {
	const weekday = new Intl.DateTimeFormat('en-US', {
		timeZone: ISRAEL_TZ,
		weekday: 'short',
	}).format(new Date(nowMs))
	const order = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	const dayIndex = order.indexOf(weekday)
	return dayIndex === -1 ? 0 : dayIndex
}

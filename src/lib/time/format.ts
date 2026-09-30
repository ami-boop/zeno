import { ISRAEL_TZ, israelNow } from './israel'

export const getIsraelTime = () => israelNow().format('HH:mm')

export function formatClockHHMM(value: string | number, locale: string): string {
	const date = new Date(value)
	if (Number.isNaN(date.getTime())) return String(value)
	return new Intl.DateTimeFormat(locale, {
		timeZone: ISRAEL_TZ,
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

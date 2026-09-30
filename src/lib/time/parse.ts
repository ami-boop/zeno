import { SUMMER_OFFSET_MS, WINTER_OFFSET_MS, wallKey } from './israel'

export function parseIsraelTime(dateStr: string, timeStr: string): Date {
	const naiveUtc = new Date(`${dateStr}T${timeStr}:00Z`)
	if (Number.isNaN(naiveUtc.getTime())) return naiveUtc
	const key = `${dateStr}T${timeStr}`
	const summer = naiveUtc.getTime() - SUMMER_OFFSET_MS
	if (wallKey(summer) === key) return new Date(summer)
	return new Date(naiveUtc.getTime() - WINTER_OFFSET_MS)
}

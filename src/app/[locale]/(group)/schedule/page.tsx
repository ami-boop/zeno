import { getTranslations } from 'next-intl/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import DayScheduleClient from '@/components/schedule/DayScheduleClient'
import type { LessonsSchedule, RouteStops, WeekDay } from '@/components/schedule/types'
import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)

const israelTz = 'Asia/Jerusalem'

const isString = (value: unknown): value is string => typeof value === 'string'

const isRouteStops = (value: unknown): value is RouteStops => {
	if (!value || typeof value !== 'object') return false
	const route = value as Record<string, unknown>
	const isStops = (stops: unknown) =>
		Array.isArray(stops) &&
		stops.every(stop => {
			if (!stop || typeof stop !== 'object') return false
			const item = stop as Record<string, unknown>
			return isString(item.stopId) && typeof item.order === 'number' && typeof item.durationMin === 'number'
		})

	return isString(route.routeId) && isString(route.name) && isStops(route.stopsMorning) && isStops(route.stopsAfternoon)
}

const isLessonsSchedule = (value: unknown): value is LessonsSchedule => {
	if (!value || typeof value !== 'object') return false
	const schedule = value as Record<string, unknown>
	if (!schedule.endTimes || typeof schedule.endTimes !== 'object') return false

	return Object.values(schedule.endTimes).every(isString)
}

async function fetchJson(url: string, session: string | undefined): Promise<unknown | null> {
	try {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/json',
				Cookie: `sessionCookie=${session ?? ''}`,
			},
			cache: 'no-store',
		})
		if (!response.ok) return null
		return await response.json()
	} catch {
		return null
	}
}

export default async function SchedulePage() {
	const t = await getTranslations('Schedule')
	const session = await getSessionToken()

	const [lessonsPayload, routeStopsPayload] = await Promise.all([
		fetchJson(`${API_URL}/lessons`, session),
		fetchJson(`${API_URL}/route-stops`, session),
	])

	const lessons =
		lessonsPayload && typeof lessonsPayload === 'object' && 'schedule' in lessonsPayload
			? (lessonsPayload.schedule as unknown)
			: null
	const routeStops = isRouteStops(routeStopsPayload) ? routeStopsPayload : null

	const days: WeekDay[] = [
		{ index: 0, key: 'Sunday', name: t('days.sunday'), shortName: t('daysShort.sun') },
		{ index: 1, key: 'Monday', name: t('days.monday'), shortName: t('daysShort.mon') },
		{ index: 2, key: 'Tuesday', name: t('days.tuesday'), shortName: t('daysShort.tue') },
		{ index: 3, key: 'Wednesday', name: t('days.wednesday'), shortName: t('daysShort.wed') },
		{ index: 4, key: 'Thursday', name: t('days.thursday'), shortName: t('daysShort.thu') },
		{ index: 5, key: 'Friday', name: t('days.friday'), shortName: t('daysShort.fri') },
		{ index: 6, key: 'Saturday', name: t('days.saturday'), shortName: t('daysShort.sat') },
	]

	const now = dayjs().tz(israelTz)
	const currentTime = now.format('HH:mm')
	const defaultDay = now.format('dddd')
	const schedule: LessonsSchedule | null = isLessonsSchedule(lessons) ? lessons : null

	return (
		<div className='min-h-screen bg-[#f5f7f8]'>
			<main className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
				<div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#74818a]'>{t('eyebrow')}</p>
						<h1 className='mt-2 text-3xl font-bold tracking-tight text-[#15232d]'>{t('title')}</h1>
					</div>
					{routeStops && <div className='rounded-xl bg-[#15232d] px-4 py-2 text-sm font-semibold text-[#f4b860] shadow-sm'>{routeStops.name}</div>}
				</div>

				<DayScheduleClient
					days={days}
					defaultDay={defaultDay}
					routeStops={routeStops}
					lessons={schedule}
					today={defaultDay}
					currentTime={currentTime}
				/>
			</main>
		</div>
	)
}

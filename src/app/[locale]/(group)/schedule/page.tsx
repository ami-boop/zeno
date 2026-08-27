import { getTranslations } from 'next-intl/server'
import DayScheduleClient from '@/components/schedule/DayScheduleClient'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import type { LessonsSchedule, WeekDay } from '@/components/schedule/types'
import { isRouteStops, isLessonsSchedule } from '@/lib/api-contracts'
import { israelNow } from '@/lib/time'
import { getSessionToken } from '@/utils/getSessionToken'
import { getPersonalData } from '@/lib/api/personal-data'

export default async function SchedulePage() {
	const t = await getTranslations('Schedule')
	const token = await getSessionToken()

	const [lessonsPayload, routeStopsPayload] = await Promise.all([
		getPersonalData('lessons', token),
		getPersonalData('route-stops', token),
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

	const now = israelNow()
	const currentTime = now.format('HH:mm')
	const defaultDay = now.format('dddd')
	const schedule: LessonsSchedule | null = isLessonsSchedule(lessons) ? lessons : null

	return (
		<PageShell width="md">
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<PageHeader eyebrow={t('eyebrow')} title={t('title')} />
				{routeStops && (
					<div className="rounded-xl bg-zeno-night px-4 py-2 text-sm font-semibold text-zeno-amber shadow-sm">
						{routeStops.name}
					</div>
				)}
			</div>

			<DayScheduleClient
				days={days}
				defaultDay={defaultDay}
				routeStops={routeStops}
				lessons={schedule}
				today={defaultDay}
				currentTime={currentTime}
			/>
		</PageShell>
	)
}

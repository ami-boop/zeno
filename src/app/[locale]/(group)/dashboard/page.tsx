import { getSessionToken } from '@/utils/getSessionToken'
import { getTranslations } from 'next-intl/server'
import TodayTicket from '@/components/dashboard/TodayTicket'
import RouteCard from '@/components/dashboard/RouteCard'
import QuickActions from '@/components/dashboard/QuickActions'
import DataErrorState from '@/components/ui/DataErrorState'
import type { RouteStops } from '@/components/schedule/types'
import type { StudentProfile } from '@/components/profile/types'
import { isStudentProfile } from '@/lib/student-profile'
import { parseReportTime, isRouteStops, type ReportTime } from '@/lib/api-contracts'
import { getPersonalData } from '@/lib/personal-data'

export default async function DashboardPage() {
	const t = await getTranslations('Dashboard')
	const sessionToken = await getSessionToken()

	const [studentRes, reportTimeRes, routeStopsRes] = await Promise.all([
		getPersonalData('students', sessionToken),
		getPersonalData('report-time', sessionToken),
		getPersonalData('route-stops', sessionToken),
	])

	const student: StudentProfile | null = isStudentProfile(studentRes) ? studentRes : null
	const reportTime: ReportTime | null = parseReportTime(reportTimeRes)
	const routeStops: RouteStops | null = isRouteStops(routeStopsRes) ? routeStopsRes : null

	if (!student || !reportTime || !routeStops) {
		return (
			<div className='zeno-page'>
				<div className='mx-auto max-w-xl px-4 py-8 sm:px-6'>
					<DataErrorState
						eyebrow={t('errorEyebrow')}
						title={t('loadErrorTitle')}
						description={t('loadErrorDescription')}
						actionLabel={t('retry')}
					/>
				</div>
			</div>
		)
	}

	const myStopOrder = student.stopId
		? routeStops.stopsAfternoon.find(stop => stop.stopId === student.stopId)?.order ?? null
		: null

	return (
		<div className='zeno-page'>
			<div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
				<div className='mb-8 max-w-2xl lg:mb-10'>
					<p className='zeno-kicker'>{t('ticketTitle')}</p>
					<h1 className='mt-3 text-4xl font-bold tracking-tight text-zeno-ink sm:text-5xl'>{t('welcome')}</h1>
					<p className='mt-3 text-base leading-7 text-zeno-ink-soft'>{t('desc')}</p>
				</div>

				<div className='grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]'>
					<div className='flex min-w-0 flex-col gap-6'>
						<TodayTicket
							time={reportTime.defaultTime}
							routeName={routeStops.name}
							byBus={student.byBus}
							submittedTime={reportTime.submittedTime}
						/>
						<QuickActions />
					</div>
					<RouteCard
						routeName={routeStops.name}
						morningCount={routeStops.stopsMorning.length}
						afternoonCount={routeStops.stopsAfternoon.length}
						myStopOrder={myStopOrder}
					/>
				</div>
			</div>
		</div>
	)
}

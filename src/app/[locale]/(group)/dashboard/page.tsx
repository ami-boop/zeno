import { getSessionToken } from '@/utils/getSessionToken'
import { getTranslations } from 'next-intl/server'
import TodayTicket from '@/components/dashboard/TodayTicket'
import RouteCard from '@/components/dashboard/RouteCard'
import QuickActions from '@/components/dashboard/QuickActions'
import DataErrorState from '@/components/ui/DataErrorState'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import type { RouteStops } from '@/components/schedule/types'
import type { StudentProfile } from '@/components/profile/types'
import { isStudentProfile } from '@/lib/student-profile'
import { parseReportTime, isRouteStops, type ReportTime } from '@/lib/api-contracts'
import { getPersonalData } from '@/lib/personal-data'

export default async function DashboardPage() {
	const t = await getTranslations('Dashboard')
	const token = await getSessionToken()

	const [studentRes, reportTimeRes, routeStopsRes] = await Promise.all([
		getPersonalData('students', token),
		getPersonalData('report-time', token),
		getPersonalData('route-stops', token),
	])

	const student: StudentProfile | null = isStudentProfile(studentRes) ? studentRes : null
	const reportTime: ReportTime | null = parseReportTime(reportTimeRes)
	const routeStops: RouteStops | null = isRouteStops(routeStopsRes) ? routeStopsRes : null

	if (!student || !reportTime) {
		return (
			<PageShell width="narrow">
				<DataErrorState
					eyebrow={t('errorEyebrow')}
					title={t('loadErrorTitle')}
					description={t('loadErrorDescription')}
					actionLabel={t('retry')}
				/>
			</PageShell>
		)
	}

	const myStopOrder =
		student.stopId && routeStops
			? (routeStops.stopsAfternoon.find((stop) => stop.stopId === student.stopId)?.order ?? null)
			: null

	return (
		<PageShell width="lg" className="lg:py-12">
			<PageHeader
				eyebrow={t('ticketTitle')}
				title={t('welcome')}
				description={t('desc')}
				size="lg"
				className="mb-8 lg:mb-10"
			/>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
				<div className="flex min-w-0 flex-col gap-6">
					<TodayTicket
						time={reportTime.defaultTime}
						routeName={routeStops?.name ?? null}
						byBus={student.byBus}
						submittedTime={reportTime.submittedTime}
					/>
					<QuickActions />
				</div>
				<RouteCard
					routeName={routeStops?.name ?? null}
					morningCount={routeStops?.stopsMorning.length ?? 0}
					afternoonCount={routeStops?.stopsAfternoon.length ?? 0}
					myStopOrder={myStopOrder}
				/>
			</div>
		</PageShell>
	)
}

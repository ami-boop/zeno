import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'
import { getTranslations } from 'next-intl/server'
import TodayTicket from '@/components/dashboard/TodayTicket'
import RouteCard from '@/components/dashboard/RouteCard'
import QuickActions from '@/components/dashboard/QuickActions'

type Student = {
	name: string
	byBus: boolean
	time: string | null
	stopId: string
	routeId: string
	classId: string
	parents: string[]
}

type ReportTime = {
	times: string[]
	defaultTime: string | null
	submited: boolean
	submittedTime: string | null
}

type RouteStops = {
	routeName: string | null
	stopsMorning: { stopId: string; order: number }[]
	stopsAfternoon: { stopId: string; order: number }[]
}

const safeFetch = async (url: string, headers: Record<string, string>) => {
	try {
		const res = await fetch(url, { headers, cache: 'no-store' })
		return res.ok ? res.json() : null
	} catch {
		return null
	}
}

export default async function DashboardPage() {
	const t = await getTranslations('Dashboard')
	const sessionToken = await getSessionToken()

	const headers = {
		'Content-Type': 'application/json',
		Cookie: `sessionCookie=${sessionToken}`,
	}

	const [studentRes, reportTimeRes, routeStopsRes] = await Promise.all([
		safeFetch(`${API_URL}/students`, headers),
		safeFetch(`${API_URL}/report-time`, headers),
		safeFetch(`${API_URL}/route-stops`, headers),
	])

	const student: Student | undefined = studentRes?.students?.[0]
	const reportTime: ReportTime | undefined = reportTimeRes
	const routeStops: RouteStops | undefined = routeStopsRes

	const myAfternoonStop =
		student && routeStops?.stopsAfternoon
			? routeStops.stopsAfternoon.findIndex(s => s.stopId === student.stopId)
			: -1
	const myStopOrder = myAfternoonStop >= 0 ? myAfternoonStop : null

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='mx-auto max-w-xl px-4 sm:px-6 py-8 flex flex-col gap-6'>
				<div>
					<h1 className='text-2xl font-bold text-[#111518]'>{t('welcome')}</h1>
					<p className='text-gray-500 mt-1'>{t('desc')}</p>
				</div>

				<TodayTicket
					time={reportTime?.defaultTime ?? null}
					routeName={routeStops?.routeName ?? null}
					byBus={student?.byBus ?? false}
					submittedTime={reportTime?.submittedTime ?? null}
				/>

				<RouteCard
					routeName={routeStops?.routeName ?? null}
					morningCount={routeStops?.stopsMorning?.length ?? 0}
					afternoonCount={routeStops?.stopsAfternoon?.length ?? 0}
					myStopOrder={myStopOrder}
				/>

				<QuickActions />
			</div>
		</div>
	)
}
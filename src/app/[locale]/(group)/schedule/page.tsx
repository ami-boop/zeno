import { getTranslations } from 'next-intl/server'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import DayScheduleClient from '@/components/schedule/DayScheduleClient'
import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

dayjs.extend(utc)
dayjs.extend(timezone)

export type WeekDay = {
	name: string
	key: string
	shortName: string
}

export type Stop = {
	type: 'stop' | 'school'
	time: string
	label: string
	address?: string
	duration?: number
}

export default async function SchedulePage() {
	const t = await getTranslations('Schedule')
	const sessionCookie = await getSessionToken()

	const days: WeekDay[] = [
		{ key: 'Sunday', name: t('days.sunday'), shortName: t('daysShort.sun') },
		{ key: 'Monday', name: t('days.monday'), shortName: t('daysShort.mon') },
		{ key: 'Tuesday', name: t('days.tuesday'), shortName: t('daysShort.tue') },
		{
			key: 'Wednesday',
			name: t('days.wednesday'),
			shortName: t('daysShort.wed'),
		},
		{
			key: 'Thursday',
			name: t('days.thursday'),
			shortName: t('daysShort.thu'),
		},
		{ key: 'Friday', name: t('days.friday'), shortName: t('daysShort.fri') },
		{
			key: 'Saturday',
			name: t('days.saturday'),
			shortName: t('daysShort.sat'),
		},
	]

	let scheduleData: Record<string, { morning: Stop[]; afternoon: Stop[] }>
	try {
		const response = await fetch(
			`${API_URL}/schedule`,
			{
				headers: {
					'Content-Type': 'application/json',
					Cookie: `sessionCookie=${sessionCookie}`,
				},
				cache: 'force-cache',
			}
		)
		scheduleData = (await response.json()).schedule || {}
	} catch {
		scheduleData = {}
	}

	const israelTz = 'Asia/Jerusalem'
	const currentTime = dayjs().tz(israelTz).format('HH:mm')
	const today = dayjs().tz(israelTz).format('dddd')
	const defaultDay = days.find(d => d.key === today) ? today : 'Monday'

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600'>
								{t('currentTime')}: {currentTime}
							</p>
						</div>
						<div className='flex items-center space-x-2'>
							<div className='w-2 h-2 bg-green-500 rounded-full'></div>
							<span className='text-sm text-green-600 font-medium'>
								{t('activeRoutes')}
							</span>
						</div>
					</div>
					{/* DayNavigation и DayScheduleClient */}
					<DayScheduleClient
						days={days}
						defaultDay={defaultDay}
						scheduleData={scheduleData}
						currentTime={currentTime}
					/>
				</div>
			</div>
		</div>
	)
}

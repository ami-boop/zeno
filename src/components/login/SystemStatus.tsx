'use client'

import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function SystemStatus() {
	const t = useTranslations('Login')

	const currentTime = dayjs().tz('Asia/Jerusalem').format('HH:mm')

	return (
		<div className='bg-gray-50 rounded-lg p-4 mb-6 space-y-3'>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('currentTime')}</span>
				<span className='text-sm font-medium text-gray-900'>{currentTime}</span>
			</div>
		</div>
	)
}

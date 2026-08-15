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
		<div className='mb-6 space-y-3 rounded-2xl border border-zeno-line bg-zeno-paper-soft p-4'>
			<div className='flex justify-between items-center'>
				<span className='text-sm font-medium text-zeno-ink-soft'>{t('currentTime')}</span>
				<span className='text-sm font-bold tabular-nums text-zeno-ink'>{currentTime}</span>
			</div>
		</div>
	)
}

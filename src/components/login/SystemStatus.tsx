'use client'

import { useTranslations } from 'next-intl'
import { getIsraelTime } from '@/lib/time'

export default function SystemStatus() {
	const t = useTranslations('Login')

	const currentTime = getIsraelTime()

	return (
		<div className='mb-6 space-y-3 rounded-2xl border border-zeno-line bg-zeno-paper-soft p-4'>
			<div className='flex justify-between items-center'>
				<span className='text-sm font-medium text-zeno-ink-soft'>{t('currentTime')}</span>
				<span className='text-sm font-bold tabular-nums text-zeno-ink'>{currentTime}</span>
			</div>
		</div>
	)
}

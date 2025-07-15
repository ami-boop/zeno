'use client'

import { useTranslations } from 'next-intl'
import React from 'react'

export default React.memo(function SystemStatus() {
	const t = useTranslations('Login')

	const currentTime = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})

	return (
		<div className='bg-gray-50 rounded-lg p-4 mb-6 space-y-3'>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('currentTime')}</span>
				<span className='text-sm font-medium text-gray-900'>{currentTime}</span>
			</div>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('systemStatus')}</span>
				<div className='flex items-center gap-2'>
					<div className='w-2 h-2 bg-green-500 rounded-full'></div>
					<span className='text-sm font-medium text-green-600'>
						{t('online')}
					</span>
				</div>
			</div>
		</div>
	)
})

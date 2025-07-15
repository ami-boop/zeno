import { Clock, Bus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

interface ReportStatusProps {
	currentTime: string
	busArrivalTime: string
	reportingAs: string
	studentId: string
}

export default React.memo(function ReportStatus({
	currentTime,
	busArrivalTime,
	reportingAs,
	studentId,
}: ReportStatusProps) {
	const t = useTranslations('Report')
	return (
		<div className='bg-gray-50 rounded-lg p-4 mb-6 space-y-3'>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>
					<Clock className='inline w-4 h-4 mr-1' />
					{t('reportingAs')}
				</span>
				<span className='text-sm font-medium text-gray-900'>
					{t('studentIdLabel')}: {studentId}
				</span>
			</div>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('currentTime')}</span>
				<span className='text-sm font-medium text-gray-900'>{currentTime}</span>
			</div>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('busArrival')}</span>
				<span className='text-sm font-medium text-blue-600'>
					<Bus className='inline w-4 h-4 mr-1' />
					{busArrivalTime}
				</span>
			</div>
		</div>
	)
})

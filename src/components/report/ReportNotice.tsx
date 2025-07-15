import { AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default React.memo(function ReportNotice() {
	const t = useTranslations('Report')
	return (
		<div className='mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md'>
			<div className='flex'>
				<AlertTriangle className='w-5 h-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5' />
				<p className='text-sm text-amber-800'>{t('noticeMessage')}</p>
			</div>
		</div>
	)
})

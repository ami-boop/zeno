'use client'

import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

export default React.memo(function SecurityNotice() {
	const t = useTranslations('Login')

	return (
		<div className='mt-6 rounded-2xl border border-zeno-amber/35 bg-zeno-cream p-4'>
			<div className='flex'>
				<AlertCircle
					className='mr-2 mt-0.5 size-5 flex-shrink-0 text-zeno-amber-deep'
					data-testid='alert-icon'
				/>
				<p className='text-sm leading-6 text-zeno-amber-ink'>{t('securityNotice')}</p>
			</div>
		</div>
	)
})

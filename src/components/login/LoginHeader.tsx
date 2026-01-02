'use client'

import { User } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function LoginHeader() {
	const t = useTranslations('Login')

	return (
		<div className='text-center mb-8'>
			<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
				<User className='w-8 h-8 text-blue-600' data-testid='user-icon' />
			</div>
			<h1 className='text-2xl font-bold text-gray-900 mb-2'>{t('title')}</h1>
			<p className='text-gray-600 text-sm'>{t('subtitle')}</p>
		</div>
	)
}

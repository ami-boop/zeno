'use client'

import { Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AdminAccessButton() {
	const t = useTranslations('Login')

	return (
		<button
			type='button'
			className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200'
		>
			<Shield className='w-4 h-4 mr-2 text-blue-600' />
			{t('adminAccess')}
		</button>
	)
}

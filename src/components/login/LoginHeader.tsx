'use client'

import { useTranslations } from 'next-intl'

export default function LoginHeader() {
	const t = useTranslations('Login')

	return (
		<div className='mb-8'>
			<h1 className='text-3xl font-bold tracking-tight text-zeno-ink'>{t('title')}</h1>
		</div>
	)
}

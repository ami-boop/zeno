'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { HelpCircle, UserRound, Clock3 } from 'lucide-react'

export default function QuickActions() {
	const t = useTranslations('Dashboard')

	const actions = [
		{ href: '/schedule', icon: Clock3, label: t('scheduleTitle') },
		{ href: '/profile', icon: UserRound, label: t('profileTitle') },
		{ href: '/help', icon: HelpCircle, label: t('helpTitle') },
	]

	return (
		<div className='grid grid-cols-3 gap-3'>
			{actions.map(({ href, icon: Icon, label }) => (
				<Link
					key={href}
					href={href}
					className='flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-4 text-center transition hover:bg-gray-50'
				>
					<Icon className='size-5 text-[#111518]' />
					<span className='text-sm font-medium text-gray-700'>{label}</span>
				</Link>
			))}
		</div>
	)
}
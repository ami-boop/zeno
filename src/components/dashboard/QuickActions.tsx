'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, HelpCircle, UserRound, Clock3 } from 'lucide-react'

export default function QuickActions() {
	const t = useTranslations('Dashboard')

	const actions = [
		{ href: '/schedule', icon: Clock3, label: t('scheduleTitle'), description: t('scheduleDesc') },
		{ href: '/profile', icon: UserRound, label: t('profileTitle'), description: t('profileDesc') },
		{ href: '/help', icon: HelpCircle, label: t('helpTitle'), description: t('helpDesc') },
	]

	return (
		<div className='grid grid-cols-3 gap-3'>
			{actions.map(({ href, icon: Icon, label, description }) => (
				<Link
					key={href}
					href={href}
					className='zeno-focus zeno-card group flex min-h-36 flex-col items-start gap-4 p-5 text-start transition hover:-translate-y-1 hover:border-zeno-line-strong hover:bg-zeno-paper-soft'
				>
					<div className='flex w-full items-center justify-between'>
						<span className='flex size-10 items-center justify-center rounded-xl bg-zeno-sage-soft text-zeno-sage'>
							<Icon className='size-5' />
						</span>
						<ArrowUpRight className='size-4 text-zeno-muted transition group-hover:text-zeno-sage' />
					</div>
					<div>
						<span className='block text-sm font-bold text-zeno-ink'>{label}</span>
						<span className='mt-1 block text-xs leading-5 text-zeno-muted'>{description}</span>
					</div>
				</Link>
			))}
		</div>
	)
}

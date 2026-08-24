'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, HelpCircle, UserRound, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'
import IconTile from '@/components/ui/IconTile'

export default function QuickActions() {
	const t = useTranslations('Dashboard')

	const actions = [
		{ href: '/schedule', icon: Clock3, label: t('scheduleTitle'), description: t('scheduleDesc') },
		{ href: '/profile', icon: UserRound, label: t('profileTitle'), description: t('profileDesc') },
		{ href: '/help', icon: HelpCircle, label: t('helpTitle'), description: t('helpDesc') },
	]

	return (
		<div className='grid grid-cols-3 gap-3'>
			{actions.map(({ href, icon: Icon, label, description }, i) => (
				<motion.div
					key={href}
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
					whileHover={{ y: -4 }}
					whileTap={{ scale: 0.98 }}
					className='h-full'
				>
					<Link
						href={href}
						className='zeno-focus zeno-card group flex h-full min-h-32 flex-col items-start gap-3 p-4 transition hover:border-zeno-line-strong hover:bg-zeno-paper-soft sm:min-h-36 sm:gap-4 sm:p-5'
					>
						<div className='flex w-full items-center justify-between'>
							<IconTile>
								<Icon className='size-5' />
							</IconTile>
							<ArrowUpRight className='size-4 text-zeno-muted transition group-hover:text-zeno-sage' />
						</div>
						<div className='min-w-0'>
							<span className='block text-sm font-bold text-zeno-ink'>{label}</span>
							<span className='mt-1 hidden text-xs leading-5 text-zeno-muted sm:block'>{description}</span>
						</div>
					</Link>
				</motion.div>
			))}
		</div>
	)
}

'use client'

import { ArrowUpRight, CalendarClock, ClipboardPenLine } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function ProfileActions() {
	const t = useTranslations('Profile')
	const quickActions = t('Quick Actions')
	const actionsHint = t('actionsHint')
	const reportEmergency = t('updatePlan')
	const viewSchedule = t('View Schedule')

	return (
		<motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24, duration: 0.4 }} className='rounded-zeno border border-zeno-line bg-zeno-surface p-6 shadow-zeno-card'>
			<h2 className='text-lg font-bold text-zeno-ink'>{quickActions}</h2>
			<p className='mt-1 text-sm leading-6 text-zeno-muted'>{actionsHint}</p>
			<div className='mt-5 flex flex-col gap-3'>
				<motion.div whileTap={{ scale: 0.98 }}>
				<Link
					href='/report'
					className='group flex items-center justify-between rounded-2xl bg-zeno-amber px-4 py-3.5 font-semibold text-zeno-amber-fg transition hover:bg-zeno-amber/80 focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2'
				>
					<span className='flex items-center gap-3'>
						<ClipboardPenLine className='size-5' data-testid='report-icon' />
						{reportEmergency}
					</span>
					<ArrowUpRight className='size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
				</Link>
				</motion.div>
				<motion.div whileTap={{ scale: 0.98 }}>
				<Link
					href='/schedule'
					className='group flex items-center justify-between rounded-2xl border border-zeno-line bg-zeno-surface px-4 py-3.5 font-semibold text-zeno-ink transition hover:border-zeno-line-strong hover:bg-zeno-paper-soft focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2'
				>
					<span className='flex items-center gap-3'>
						<CalendarClock className='size-5 text-zeno-sage' data-testid='history-icon' />
						{viewSchedule}
					</span>
					<ArrowUpRight className='size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
				</Link>
				</motion.div>
			</div>
		</motion.div>
	)
}

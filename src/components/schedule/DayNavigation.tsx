'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'
import { useTranslations } from 'next-intl'
import type { WeekDay } from './types'

interface DayNavigationProps {
	days: WeekDay[]
	activeDay: string
	today: string
	onChangeDay: (dayKey: string) => void
}

export default React.memo(function DayNavigation({ days, activeDay, today, onChangeDay }: DayNavigationProps) {
	const t = useTranslations('Schedule')
	const currentDayIndex = days.findIndex(day => day.key === activeDay)
	const canGoPrev = currentDayIndex > 0
	const canGoNext = currentDayIndex < days.length - 1

	return (
		<motion.div
			initial={{ opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className='flex items-center gap-2 rounded-2xl border border-zeno-line bg-zeno-surface p-2 shadow-zeno-card'
		>
			<motion.button
				whileTap={{ scale: 0.9 }}
				type='button'
				aria-label='Previous day'
				onClick={() => canGoPrev && onChangeDay(days[currentDayIndex - 1].key)}
				disabled={!canGoPrev}
				className='hidden rounded-xl p-2 text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 disabled:cursor-not-allowed disabled:opacity-30 sm:block'
			>
				<ChevronLeft className='size-5' />
			</motion.button>

			<div className='grid min-w-0 flex-1 grid-cols-4 gap-1.5 sm:flex sm:gap-1'>
				{days.map(day => (
					<motion.button
						key={day.key}
						type='button'
						aria-current={day.key === activeDay ? 'date' : undefined}
						onClick={() => onChangeDay(day.key)}
						className={`relative rounded-xl px-1.5 py-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-inset sm:min-w-fit sm:flex-1 sm:px-3 sm:py-2 sm:text-sm ${day.key === activeDay ? 'text-white' : 'text-zeno-ink-soft hover:bg-zeno-sage-soft hover:text-zeno-ink'}`}
					>
						{day.key === activeDay && (
							<motion.span
								layoutId='day-pill'
								transition={{ type: 'spring', stiffness: 400, damping: 32 }}
								className='absolute inset-0 rounded-xl bg-zeno-night shadow-sm'
							/>
						)}
						<span className='relative z-10 flex items-center justify-center gap-1'>
							<span className='hidden sm:inline'>{day.name}</span>
							<span className='sm:hidden'>{day.shortName}</span>
							{day.key === today && <span className='inline-flex size-1.5 shrink-0 translate-y-[-1px] rounded-full bg-zeno-amber align-middle' aria-label={t('today')} />}
						</span>
					</motion.button>
				))}
			</div>

			<motion.button
				whileTap={{ scale: 0.9 }}
				type='button'
				aria-label='Next day'
				onClick={() => canGoNext && onChangeDay(days[currentDayIndex + 1].key)}
				disabled={!canGoNext}
				className='hidden rounded-xl p-2 text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 disabled:cursor-not-allowed disabled:opacity-30 sm:block'
			>
				<ChevronRight className='size-5' />
			</motion.button>
		</motion.div>
	)
})

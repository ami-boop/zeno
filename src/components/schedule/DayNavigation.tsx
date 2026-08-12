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
		<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className='flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm'>
			<motion.button whileTap={{ scale: 0.9 }} type='button' aria-label='Previous day' onClick={() => canGoPrev && onChangeDay(days[currentDayIndex - 1].key)} disabled={!canGoPrev} className='rounded-xl p-2 text-[#40515c] transition hover:bg-[#eef3f0] hover:text-[#15232d] focus:outline-none focus:ring-2 focus:ring-[#f4b860] disabled:cursor-not-allowed disabled:opacity-30'>
				<ChevronLeft className='size-5' />
			</motion.button>
			<div className='flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				{days.map(day => (
					<motion.button key={day.key} type='button' aria-current={day.key === activeDay ? 'date' : undefined} onClick={() => onChangeDay(day.key)} className={`relative min-w-fit flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-inset ${day.key === activeDay ? 'bg-[#15232d] text-white shadow-sm' : 'text-[#40515c] hover:bg-[#eef3f0] hover:text-[#15232d]'}`}>
						<span className='relative z-10'>
						<span className='hidden sm:inline'>{day.name}</span>
						<span className='sm:hidden'>{day.shortName}</span>
						{day.key === today && <span className='ms-1.5 inline-flex size-1.5 translate-y-[-1px] rounded-full bg-[#f4b860] align-middle' aria-label={t('today')} />}
						</span>
					</motion.button>
				))}
			</div>
			<motion.button whileTap={{ scale: 0.9 }} type='button' aria-label='Next day' onClick={() => canGoNext && onChangeDay(days[currentDayIndex + 1].key)} disabled={!canGoNext} className='rounded-xl p-2 text-[#40515c] transition hover:bg-[#eef3f0] hover:text-[#15232d] focus:outline-none focus:ring-2 focus:ring-[#f4b860] disabled:cursor-not-allowed disabled:opacity-30'>
				<ChevronRight className='size-5' />
			</motion.button>
		</motion.div>
	)
})

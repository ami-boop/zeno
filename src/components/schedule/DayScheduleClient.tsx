'use client'

import { useState } from 'react'
import { Clock3, Route as RouteIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'
import DayNavigation from './DayNavigation'
import StopTimeline from './StopTimeline'
import type { LessonsSchedule, RouteStops, WeekDay } from './types'

interface DayScheduleClientProps {
	days: WeekDay[]
	defaultDay: string
	routeStops: RouteStops | null
	lessons: LessonsSchedule | null
	today: string
	currentTime: string
}

export default function DayScheduleClient({
	days,
	defaultDay,
	routeStops,
	lessons,
	today,
	currentTime,
}: DayScheduleClientProps) {
	const [activeDay, setActiveDay] = useState(defaultDay)
	const t = useTranslations('Schedule')
	const selectedDay = days.find(day => day.key === activeDay) ?? days[0]
	const endTime = lessons?.endTimes[String(selectedDay.index)] ?? null

	return (
		<div className='space-y-4'>
			<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className='mb-10 flex flex-wrap gap-2'>
				<div className='inline-flex items-center gap-2 rounded-lg border border-zeno-line bg-zeno-surface px-2.5 py-1.5 shadow-sm'>
					<span className='text-[9px] font-semibold uppercase tracking-[0.1em] text-zeno-muted'>{t('currentTime')}</span>
					<span className='flex items-center gap-1 text-base font-bold tabular-nums text-zeno-ink'><Clock3 className='size-3.5 text-zeno-sage' />{currentTime}</span>
				</div>
				<div className='inline-flex items-center gap-2 rounded-lg border border-zeno-amber/35 bg-zeno-cream-surface px-2.5 py-1.5 shadow-sm'>
					<span className='text-[9px] font-semibold uppercase tracking-[0.1em] text-zeno-amber-ink'>{t('lessonEndTime')}</span>
					<AnimatePresence mode='wait' initial={false}>
						<motion.span key={activeDay} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18 }} className='text-base font-bold tabular-nums text-zeno-amber-deep'>{lessons ? endTime ?? '—' : '—'}</motion.span>
					</AnimatePresence>
					{!lessons && <span role='status' className='sr-only'>{t('lessonsUnavailable')}</span>}
				</div>
			</motion.div>

			<DayNavigation days={days} activeDay={activeDay} today={today} onChangeDay={setActiveDay} />

			{routeStops ? (
				<AnimatePresence mode='wait' initial={false}>
					<motion.section
						key={activeDay}
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.25, ease: 'easeOut' }}
						className='space-y-6'
					>
						<div className='flex items-center gap-3'>
							<span className='flex size-10 items-center justify-center rounded-xl bg-zeno-sage-soft text-zeno-sage'><RouteIcon className='size-5' /></span>
							<div>
								<h2 className='text-xl font-bold text-zeno-ink'>{t('routeStops')}</h2>
								<p className='text-sm text-zeno-muted'>{t('routeStopsHint')}</p>
							</div>
						</div>
						<div className='grid gap-6 lg:grid-cols-2'>
							<StopTimeline title={t('morningRoute')} stops={routeStops.stopsMorning} tone='morning' />
							<StopTimeline title={t('afternoonRoute')} stops={routeStops.stopsAfternoon} tone='afternoon' />
						</div>
					</motion.section>
				</AnimatePresence>
			) : (
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} role='alert' className='rounded-zeno border border-zeno-line bg-zeno-surface p-6 text-sm text-zeno-muted shadow-zeno-card'>{t('routeUnavailable')}</motion.div>
			)}
		</div>
	)
}

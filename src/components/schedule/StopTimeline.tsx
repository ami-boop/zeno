'use client'

import { Clock3, MapPin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import type { RouteStop } from './types'

interface StopTimelineProps {
	title: string
	stops: RouteStop[]
	tone: 'morning' | 'afternoon'
}

export default function StopTimeline({ title, stops, tone }: StopTimelineProps) {
	const t = useTranslations('Schedule')
	const orderedStops = [...stops].sort((a, b) => a.order - b.order)
	const palette = tone === 'morning'
		? { card: 'border-zeno-amber/35 bg-zeno-cream-surface', header: 'bg-zeno-cream', badge: 'bg-zeno-amber text-zeno-ink' }
		: { card: 'border-zeno-sage/25 bg-zeno-paper-soft', header: 'bg-zeno-sage-soft', badge: 'bg-zeno-sage-soft text-zeno-sage' }

	return (
		<div className={`overflow-hidden rounded-zeno border shadow-zeno-card ${palette.card}`}>
			<div className={`flex items-center justify-between border-b border-black/5 px-5 py-4 ${palette.header}`}>
				<h3 className='font-bold text-zeno-ink'>{title}</h3>
				<span className={`rounded-full px-2.5 py-1 text-xs font-bold ${palette.badge}`}>{orderedStops.length} {t('stopsCount')}</span>
			</div>
			{orderedStops.length > 0 ? (
				<motion.ol initial='hidden' animate='show' variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }} className='divide-y divide-gray-100'>
					{orderedStops.map((stop, index) => (
						<motion.li key={`${stop.stopId}-${stop.order}`} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }} className='flex items-center gap-4 border-b border-zeno-line/60 px-5 py-4 last:border-b-0'>
							<div className={`relative flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${palette.badge}`}>
								{index === 0 ? <MapPin className='size-4' /> : stop.order}
							</div>
							<div className='min-w-0 flex-1'>
								<p className='break-all font-semibold text-zeno-ink'>{stop.stopId}</p>
								<p className='mt-1 flex items-center gap-1 text-xs font-medium text-zeno-ink-soft'><Clock3 className='size-3.5' /> {stop.durationMin} {t('minutes')}</p>
							</div>
							<span className='text-xs font-bold text-zeno-ink-soft'>#{stop.order}</span>
						</motion.li>
					))}
				</motion.ol>
			) : (
				<p className='p-5 text-sm text-zeno-muted'>{t('noStops')}</p>
			)}
		</div>
	)
}

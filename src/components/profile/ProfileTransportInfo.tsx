'use client'

import { Bus, Clock3, MapPin, Route as RouteIcon, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { StudentProfile } from './types'

interface Props {
	info: StudentProfile
}

export default function ProfileTransportInfo({ info }: Props) {
	const t = useTranslations('Profile')
	const busYes = t('busYes')
	const busNo = t('busNo')
	const statusNoBusHint = t('statusNoBusHint')
	const statusBusHint = t('statusBusHint')
	const statusOn = t('statusOn')
	const statusOff = t('statusOff')
	const statusLabel = info.byBus ? busYes : busNo
	const statusHint = info.byBus ? statusBusHint : statusNoBusHint

	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }} className='overflow-hidden rounded-zeno border border-zeno-ink-soft bg-zeno-night text-white shadow-zeno-board'>
			<div className='relative overflow-hidden px-6 pb-8 pt-6 sm:px-8 sm:pt-8'>
				<div className='absolute -right-16 -top-20 size-56 rounded-full border-[24px] border-zeno-amber/10' />
				<div className='relative flex items-start justify-between gap-4'>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.2em] text-zeno-muted'>
							{t('transportTitle')}
						</p>
						<div className='mt-5 flex items-center gap-3'>
							<span className={`flex size-11 items-center justify-center rounded-2xl ${info.byBus ? 'bg-zeno-amber text-zeno-ink' : 'bg-white/10 text-zeno-muted'}`}>
								<Bus className='size-5' data-testid='bus-icon' />
							</span>
							<div>
								<h2 className='text-xl font-bold tracking-tight'>{statusLabel}</h2>
								<p className='mt-1 max-w-sm text-sm text-zeno-muted'>{statusHint}</p>
							</div>
						</div>
					</div>
					<span className='rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zeno-muted'>
						{info.byBus ? statusOn : statusOff}
					</span>
				</div>

				<div className='relative mt-9 flex items-end justify-between gap-4 border-t border-white/10 pt-5'>
					<div>
						<p className='text-xs font-medium uppercase tracking-wider text-zeno-muted'>{t('timeLabel')}</p>
						<p className='mt-1 text-5xl font-bold tracking-[-0.06em] text-zeno-amber tabular-nums'>
							{info.time ?? '—'}
						</p>
					</div>
					<Clock3 className='mb-2 size-7 text-zeno-amber/60' />
				</div>
			</div>

			<div className='grid grid-cols-1 divide-y divide-zeno-line/80 bg-zeno-paper-soft text-zeno-ink sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-zeno-muted'>
						<UserRound className='size-4' data-testid='user-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{t('classLabel')}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.classId ?? '—'}</p>
				</div>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-zeno-muted'>
						<RouteIcon className='size-4' data-testid='route-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{t('routeLabel')}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.routeId ?? '—'}</p>
				</div>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-zeno-muted'>
						<MapPin className='size-4' data-testid='map-pin-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{t('stopLabel')}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.stopId ?? '—'}</p>
				</div>
			</div>
		</motion.div>
	)
}

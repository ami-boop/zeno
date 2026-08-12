'use client'

import { Bus, Clock3, MapPin, Route as RouteIcon, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import type { StudentProfile } from './types'

interface Props {
	info: StudentProfile
	t: string[]
}

export default function ProfileTransportInfo({ info, t }: Props) {
	const [
		transportTitle,
		busYes,
		busNo,
		statusNoBusHint,
		statusBusHint,
		classLabel,
		routeLabel,
		stopLabel,
		timeLabel,
		statusOn,
		statusOff,
	] = t
	const statusLabel = info.byBus ? busYes : busNo
	const statusHint = info.byBus ? statusBusHint : statusNoBusHint

	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.45 }} className='overflow-hidden rounded-3xl border border-[#273b48] bg-[#15232d] text-white shadow-[0_18px_45px_-24px_rgba(21,35,45,0.8)]'>
			<div className='relative overflow-hidden px-6 pb-8 pt-6 sm:px-8 sm:pt-8'>
				<div className='absolute -right-16 -top-20 size-56 rounded-full border-[24px] border-[#f4b860]/10' />
				<div className='relative flex items-start justify-between gap-4'>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#a9bbc4]'>
							{transportTitle}
						</p>
						<div className='mt-5 flex items-center gap-3'>
							<span className={`flex size-11 items-center justify-center rounded-2xl ${info.byBus ? 'bg-[#f4b860] text-[#15232d]' : 'bg-white/10 text-[#a9bbc4]'}`}>
								<Bus className='size-5' data-testid='bus-icon' />
							</span>
							<div>
								<h2 className='text-xl font-bold tracking-tight'>{statusLabel}</h2>
								<p className='mt-1 max-w-sm text-sm text-[#a9bbc4]'>{statusHint}</p>
							</div>
						</div>
					</div>
					<span className='rounded-full border border-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#a9bbc4]'>
						{info.byBus ? statusOn : statusOff}
					</span>
				</div>

				<div className='relative mt-9 flex items-end justify-between gap-4 border-t border-white/10 pt-5'>
					<div>
						<p className='text-xs font-medium uppercase tracking-wider text-[#a9bbc4]'>{timeLabel}</p>
						<p className='mt-1 text-5xl font-bold tracking-[-0.06em] text-[#f4b860] tabular-nums'>
							{info.time ?? '—'}
						</p>
					</div>
					<Clock3 className='mb-2 size-7 text-[#f4b860]/60' />
				</div>
			</div>

			<div className='grid grid-cols-1 divide-y divide-[#d9e1e4]/80 bg-[#f8faf9] text-[#15232d] sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-[#74818a]'>
						<UserRound className='size-4' data-testid='user-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{classLabel}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.classId ?? '—'}</p>
				</div>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-[#74818a]'>
						<RouteIcon className='size-4' data-testid='route-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{routeLabel}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.routeId ?? '—'}</p>
				</div>
				<div className='p-5'>
					<div className='flex items-center gap-2 text-[#74818a]'>
						<MapPin className='size-4' data-testid='map-pin-icon' />
						<span className='text-xs font-semibold uppercase tracking-wider'>{stopLabel}</span>
					</div>
					<p className='mt-2 break-words font-semibold'>{info.stopId ?? '—'}</p>
				</div>
			</div>
		</motion.div>
	)
}

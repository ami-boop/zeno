'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, BusFront, Check, Clock3, Route as RouteIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimatedNumber } from '@/lib/useAnimatedNumber'

type Props = {
	time: string | null
	routeName: string | null
	byBus: boolean
	submittedTime: string | null
}

function useAnimatedTime(time: string | null): string {
	const targetMinutes = time ? time.split(':').map(Number).reduce((h, m) => h * 60 + m, 0) : 0
	const animated = useAnimatedNumber(targetMinutes, 900)
	if (!time) return ''
	const h = Math.floor(animated / 60)
	const m = animated % 60
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function TodayTicket({ time, routeName, byBus, submittedTime }: Props) {
	const t = useTranslations('Dashboard')
	const noBus = !time
	const animatedTime = useAnimatedTime(time)

	return (
		<motion.div
			initial={{ opacity: 0, y: 18, scale: 0.985 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ type: 'spring', stiffness: 240, damping: 24 }}
			className='relative overflow-hidden rounded-zeno-lg bg-zeno-ink text-white shadow-zeno-board'
		>
			<div className='absolute -right-20 -top-24 size-64 rounded-full border border-white/10' />
			<div className='absolute -right-8 -top-12 size-40 rounded-full border border-zeno-amber/20' />

			<motion.div
				aria-hidden
				initial={{ x: '-130%' }}
				animate={{ x: '130%' }}
				transition={{ delay: 0.9, duration: 1.1, ease: 'easeInOut' }}
				className='pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent'
			/>

			<div className='relative px-6 py-7 sm:px-8 sm:py-9'>
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.12, duration: 0.4 }}
					className='flex flex-wrap items-start justify-between gap-4'
				>
					<div>
						<p className='text-[0.68rem] font-bold uppercase tracking-[0.22em] text-zeno-muted'>{t('ticketTitle')}</p>
						<h2 className='mt-2 text-2xl font-bold tracking-tight sm:text-3xl'>{t('todayBoard')}</h2>
					</div>
					{routeName && (
						<span className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-zeno-amber'>
							<RouteIcon className='size-4' />
							{routeName}
						</span>
					)}
				</motion.div>

				{noBus ? (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
						className='mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6'
					>
						<p className='mb-1 text-2xl font-bold'>{t('noBus')}</p>
						<p className='max-w-md text-sm leading-6 text-zeno-line-strong'>{t('noBusHint')}</p>
						{submittedTime && (
							<p className='mt-4 flex items-center gap-2 text-xs text-zeno-amber'>
								<Check className='size-4' />
								{t('submittedTime')}: {submittedTime}
							</p>
						)}
					</motion.div>
				) : (
					<div className='mt-10 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end'>
						<div>
							<p className='flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zeno-muted'>
								<Clock3 className='size-4 text-zeno-amber' />
								{t('ticketTimeLabel')}
							</p>
							<p className='mt-2 text-6xl font-bold tracking-[-0.06em] text-white tabular-nums sm:text-8xl'>
								{animatedTime}
							</p>
							<p className='mt-2 text-sm text-zeno-line-strong'>{t('departureHint')}</p>
						</div>
						<div className='sm:min-w-44 sm:text-right'>
							{byBus && (
								<p className='inline-flex items-center gap-2 rounded-full bg-zeno-amber px-3 py-1.5 text-sm font-bold text-zeno-ink'>
									<BusFront className='size-4' />
									{t('byBus')}
								</p>
							)}
							{submittedTime && (
								<p className='mt-3 flex items-center gap-2 text-xs text-zeno-line-strong sm:justify-end'>
									<Check className='size-4 text-zeno-amber' />
									{t('submittedTime')}: {submittedTime}
								</p>
							)}
						</div>
					</div>
				)}
			</div>

			<div className='relative flex items-center justify-between border-t border-white/10 bg-black/10 px-6 py-4 sm:px-8'>
				<div className='flex items-center gap-2 text-xs font-semibold text-zeno-line-strong'>
					<span className='relative flex size-2'>
						<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-zeno-amber opacity-60' />
						<span className='relative inline-flex size-2 rounded-full bg-zeno-amber' />
					</span>
					{t('boardStatus')}
				</div>
				<Link
					href='/report'
					className='zeno-focus inline-flex items-center gap-2 rounded-xl bg-zeno-amber px-4 py-2.5 text-sm font-bold text-zeno-ink transition hover:bg-zeno-amber/80'
				>
					{t('editStatus')}
					<ArrowUpRight className='size-4' />
				</Link>
			</div>
		</motion.div>
	)
}

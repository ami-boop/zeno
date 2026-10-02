'use client'

import { useLocale, useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import LateDepartureBadge from './LateDepartureBadge'
import type { BusTracking } from '@/lib/api-contracts'
import {
	classifyRemaining,
	nextIsraelDepartureISO,
	MORNING_DEPARTURE_TIME,
} from './trip-time'
import { formatClockHHMM } from '@/lib/time'
import { useOffsetNow } from '../../hooks/useOffsetNow'

const STATUS_CHIP_CLASS: Record<string, string> = {
	scheduled: 'bg-zeno-amber/15 text-zeno-amber-ink',
	boarding: 'bg-zeno-sage-soft text-zeno-sage',
	in_transit: 'bg-zeno-sage text-white',
	completed: 'bg-zeno-paper-soft text-zeno-muted',
	cancelled: 'bg-zeno-danger-soft text-zeno-danger',
}

const LATENESS_CHIP_CLASS: Record<string, string> = {
	'on-time': 'bg-zeno-sage-soft text-zeno-sage',
	late: 'bg-zeno-amber/15 text-zeno-amber-ink',
	'very-late': 'bg-zeno-danger-soft text-zeno-danger',
	early: 'bg-zeno-paper-soft text-zeno-muted',
}

function LatenessPill({
	latenessMin,
	latenessState,
}: {
	latenessMin: number | null
	latenessState: BusTracking['latenessState']
}) {
	const t = useTranslations('Track')
	if (latenessMin === null || latenessState === null) return null

	const text =
		latenessState === 'on-time'
			? t('onTime')
			: latenessState === 'early'
				? t('earlyBy', { count: Math.abs(latenessMin) })
				: t('lateBy', { count: latenessMin })

	return (
		<p
			className={`mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${LATENESS_CHIP_CLASS[latenessState]}`}
		>
			<Timer className="size-4 shrink-0" />
			{text}
		</p>
	)
}

type TripStatusCardProps = {
	tracking: BusTracking
	updatedAt: number | null
	clockOffsetMs: number
}

export default function TripStatusCard({ tracking, updatedAt, clockOffsetMs }: TripStatusCardProps) {
	const t = useTranslations('Track')
	const locale = useLocale()
	const isLive = tracking.live !== null
	const myStopEta = tracking.studentStopId ? (tracking.etas?.[tracking.studentStopId] ?? null) : null

	return (
		<motion.section
			className="zeno-card p-5"
			initial={{ opacity: 0, y: 14 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.08, duration: 0.4 }}
		>
			<div className="flex items-center justify-between gap-3">
				<span
					className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
						STATUS_CHIP_CLASS[tracking.trip.status] ?? STATUS_CHIP_CLASS.scheduled
					}`}
				>
					{t(`status.${tracking.trip.status}`)}
				</span>
				{isLive ? <LiveBadge /> : null}
			</div>

			<div className="mt-5">
				<p className="text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">{t('departureLabel')}</p>
				<div className="mt-2">
					<TripCountdown
						scheduledTime={tracking.trip.scheduledTime}
						scheduledAtISO={tracking.trip.scheduledAtISO}
						clockOffsetMs={clockOffsetMs}
					/>
				</div>
				{myStopEta ? (
					<p className="zeno-focus mt-4 flex items-center gap-2 rounded-xl bg-zeno-amber/15 px-3 py-2 text-sm font-bold text-zeno-amber-ink">
						<Timer className="size-4 shrink-0" />
						{t('etaToYourStop', { count: myStopEta })}
					</p>
				) : null}
				<LatenessPill latenessMin={tracking.latenessMin} latenessState={tracking.latenessState} />
				<LateDepartureBadge minutes={tracking.lateDepartureMinutes} />
			</div>

			<div className="mt-4 border-t border-zeno-line pt-4">
				<p className="text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">
					{t('morningDeparture')}
				</p>
				<MorningDepartureRow clockOffsetMs={clockOffsetMs} />
			</div>

			{updatedAt ? (
				<div className="mt-5 border-t border-zeno-line pt-3">
					<p className="text-xs text-zeno-muted">
						{t('lastUpdated', { time: formatClockHHMM(new Date(updatedAt).toISOString(), locale) })}
					</p>
					{tracking.etas && !myStopEta ? (
						<p className="mt-1 text-[11px] text-zeno-muted">{t('etaDisclaimer')}</p>
					) : null}
				</div>
			) : null}
		</motion.section>
	)
}

function LiveBadge() {
	const t = useTranslations('Track')

	return (
		<span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zeno-sage">
			<span className="relative flex size-2">
				<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zeno-sage opacity-60" />
				<span className="relative inline-flex size-2 rounded-full bg-zeno-sage" />
			</span>
			{t('liveBadge')}
		</span>
	)
}

type CountdownProps = {
	scheduledTime: string
	scheduledAtISO: string
	clockOffsetMs: number
}

function TripCountdown({ scheduledTime, scheduledAtISO, clockOffsetMs }: CountdownProps) {
	const nowMs = useOffsetNow(clockOffsetMs)
	const remainingMs = nowMs === null ? null : Date.parse(scheduledAtISO) - nowMs

	if (remainingMs === null) {
		return <p className="text-sm font-semibold text-zeno-muted">{scheduledTime}</p>
	}

	return (
		<div>
			<p className="text-3xl font-bold tabular-nums tracking-tight text-zeno-ink">{scheduledTime}</p>
			<p className="mt-1 text-sm font-medium text-zeno-ink-soft">
				<RemainingText remainingMs={remainingMs} />
			</p>
		</div>
	)
}

function MorningDepartureRow({ clockOffsetMs }: { clockOffsetMs: number }) {
	const nowMs = useOffsetNow(clockOffsetMs)
	const departureISO = nextIsraelDepartureISO(MORNING_DEPARTURE_TIME, clockOffsetMs)

	if (!departureISO) return <p className="mt-1 text-xl font-bold text-zeno-ink">{MORNING_DEPARTURE_TIME}</p>

	const remainingMs = nowMs === null ? null : Date.parse(departureISO) - nowMs

	return (
		<div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
			<span dir="ltr" className="text-lg font-bold tabular-nums tracking-tight text-zeno-ink">
				{MORNING_DEPARTURE_TIME}
			</span>
			<span className="text-xs font-medium text-zeno-muted">
				<RemainingText remainingMs={remainingMs} />
			</span>
		</div>
	)
}

function RemainingText({ remainingMs }: { remainingMs: number | null }) {
	const t = useTranslations('Track')

	if (remainingMs === null) return null

	switch (classifyRemaining(remainingMs)) {
		case 'minutes':
			return <>{t('minutesLeft', { count: Math.ceil(remainingMs / 60_000) })}</>
		case 'minute':
			return <>{t('minuteLeft')}</>
		case 'departing':
			return <>{t('departing')}</>
		case 'past':
			return <>{t('pastDeparture')}</>
	}
}

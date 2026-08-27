'use client'

import { useTranslations } from 'next-intl'
import { MapPin } from 'lucide-react'
import type { TrackingStop } from '@/lib/api-contracts'

type StopsListProps = {
	stops: TrackingStop[]
	studentStopId: string | null
	etas: Record<string, number> | null
}

export default function StopsList({ stops, studentStopId, etas }: StopsListProps) {
	const t = useTranslations('Track')

	if (stops.length === 0) return null

	return (
		<section className="zeno-card p-5">
			<div className="flex flex-wrap items-baseline justify-between gap-2">
				<h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">{t('stopsTitle')}</h2>
				{etas ? <p className="text-[11px] text-zeno-muted">{t('etaDisclaimer')}</p> : null}
			</div>
			<ol className="mt-4 space-y-1">
				{stops.map((stop) => {
					const isMine = stop.stopId === studentStopId
					const eta = etas?.[stop.stopId]
					return (
						<li
							key={stop.stopId}
							className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
								isMine ? 'bg-zeno-amber/15' : ''
							}`}
						>
							<span className="w-5 shrink-0 text-center text-xs font-bold tabular-nums text-zeno-muted">
								{stop.order}
							</span>
							<span className={`min-w-0 truncate text-sm ${isMine ? 'font-bold text-zeno-amber-ink' : 'font-medium text-zeno-ink-soft'}`}>
								{isMine ? `${stop.name} · ${t('yourStop')}` : stop.name}
							</span>
							{eta ? (
								<span
									dir="ltr"
									className={`ms-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
										isMine ? 'bg-zeno-amber/25 text-zeno-amber-ink' : 'bg-zeno-paper-soft text-zeno-ink-soft'
									}`}
								>
									{t('etaMinutes', { count: eta })}
								</span>
							) : (
								isMine && <MapPin className="ms-auto size-4 shrink-0 text-zeno-amber-deep" />
							)}
						</li>
					)
				})}
			</ol>
		</section>
	)
}

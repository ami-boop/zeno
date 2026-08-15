'use client'

import { useTranslations } from 'next-intl'
import { ArrowUpRight, Bus, Route as RouteIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
	routeName: string | null
	morningCount: number
	afternoonCount: number
	myStopOrder: number | null
}

export default function RouteCard({ routeName, morningCount, afternoonCount, myStopOrder }: Props) {
	const t = useTranslations('Dashboard')

	return (
		<div className='zeno-card h-full p-6 sm:p-7'>
			<div className='flex items-start justify-between gap-4'>
				<div>
					<p className='zeno-kicker'>{t('routeTitle')}</p>
					<h2 className='mt-2 text-2xl font-bold tracking-tight text-zeno-ink'>{routeName ?? t('noRoute')}</h2>
				</div>
				<Bus className='size-6 text-zeno-sage' />
			</div>

			{!routeName ? (
				<p className='mt-8 rounded-2xl bg-zeno-paper-soft p-4 text-sm leading-6 text-zeno-ink-soft'>{t('noRoute')}</p>
			) : (
				<div className='mt-8 flex flex-col gap-6'>
					<div className='grid grid-cols-2 gap-3'>
						<div className='rounded-2xl border border-zeno-amber/35 bg-zeno-cream-surface p-4'>
							<p className='text-3xl font-bold tabular-nums text-zeno-ink'>{morningCount}</p>
							<p className='mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zeno-amber-ink'>{t('morningStops')}</p>
						</div>
						<div className='rounded-2xl border border-zeno-sage/25 bg-zeno-paper-soft p-4'>
							<p className='text-3xl font-bold tabular-nums text-zeno-ink'>{afternoonCount}</p>
							<p className='mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zeno-sage'>{t('afternoonStops')}</p>
						</div>
					</div>

					{myStopOrder !== null && afternoonCount > 0 && (
						<div className='rounded-2xl bg-zeno-paper-soft p-4'>
							<div className='mb-3 flex items-center justify-between text-sm'>
								<span className='inline-flex items-center gap-1.5 text-zeno-ink-soft'>
									<RouteIcon className='size-4 text-zeno-sage' />
									{t('yourStop')}
								</span>
								<span className='text-zeno-muted'>
									{myStopOrder} / {afternoonCount}
								</span>
							</div>
							<div className='h-2 overflow-hidden rounded-full bg-zeno-sage-soft'>
								<div
									className='h-full rounded-full bg-zeno-sage'
									style={{ width: `${Math.min((myStopOrder / afternoonCount) * 100, 100)}%` }}
								/>
							</div>
							<p className='mt-3 text-xs leading-5 text-zeno-muted'>{t('stopOrderHint')}</p>
						</div>
					)}

					<Link href='/schedule' className='zeno-focus flex items-center gap-2 border-t border-zeno-line pt-5 text-sm font-semibold text-zeno-sage'>
						<RouteIcon className='size-4' />
						{t('routeDetail')}
						<ArrowUpRight className='ml-auto size-4' />
					</Link>
				</div>
			)}
		</div>
	)
}

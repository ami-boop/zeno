'use client'

import { useTranslations } from 'next-intl'
import { BusFront, Phone, Users } from 'lucide-react'
import type { TrackingBus } from '@/lib/api-contracts'

type DriverCardProps = {
	bus: TrackingBus | null
}

export default function DriverCard({ bus }: DriverCardProps) {
	const t = useTranslations('Track')

	return (
		<section className="zeno-card p-5">
			<div className="flex items-center gap-4">
				<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-zeno-sage-soft">
					<BusFront className="size-6 text-zeno-sage" />
				</div>
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">{t('driverTitle')}</p>
					<p className="truncate text-base font-bold text-zeno-ink">{bus?.driverName ?? t('noDriverInfo')}</p>
				</div>
			</div>

			{bus?.driverPhone ? (
				<a
					href={`tel:${bus.driverPhone}`}
					className="zeno-focus mt-4 flex items-center gap-2 rounded-xl bg-zeno-paper-soft px-3 py-2 text-sm font-semibold text-zeno-ink transition hover:bg-zeno-sage-soft"
				>
					<Phone className="size-4 text-zeno-sage" />
					<span dir="ltr">{bus.driverPhone}</span>
				</a>
			) : null}

			<dl className="mt-4 grid grid-cols-2 gap-3 border-t border-zeno-line pt-4">
				<div>
					<dt className="text-xs font-medium text-zeno-muted">{t('plateLabel')}</dt>
					<dd dir="ltr" className="mt-0.5 font-mono text-sm font-bold text-zeno-ink">
						{bus?.licensePlate ?? '—'}
					</dd>
				</div>
				<div>
					<dt className="flex items-center gap-1 text-xs font-medium text-zeno-muted">
						<Users className="size-3" />
						{t('capacityLabel')}
					</dt>
					<dd className="mt-0.5 text-sm font-bold text-zeno-ink">
						{bus ? t('capacityValue', { count: bus.capacity }) : '—'}
					</dd>
				</div>
			</dl>
		</section>
	)
}

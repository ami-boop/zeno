'use client'

import { useTranslations } from 'next-intl'
import { BusFront } from 'lucide-react'

export default function NoTripState() {
	const t = useTranslations('Track')

	return (
		<section className="zeno-card flex flex-col items-center gap-4 p-10 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-zeno-paper-soft">
				<BusFront className="size-7 text-zeno-muted" />
			</div>
			<h2 className="text-xl font-bold text-zeno-ink">{t('noTripTitle')}</h2>
			<p className="max-w-md text-sm leading-6 text-zeno-muted">{t('noTripDescription')}</p>
			<button
				type="button"
				onClick={() => window.location.reload()}
				className="zeno-focus rounded-xl bg-zeno-night px-4 py-3 text-sm font-semibold text-white transition hover:bg-zeno-night/90 focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2"
			>
				{t('retry')}
			</button>
		</section>
	)
}

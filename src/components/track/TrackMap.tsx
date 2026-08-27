'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import type { BusTracking } from '@/lib/api-contracts'

const MapCanvas = dynamic(() => import('./MapCanvas'), {
	ssr: false,
	loading: () => <div className="h-[55vh] min-h-[320px] w-full animate-pulse rounded-zeno bg-zeno-paper-soft sm:h-[420px]" />,
})

type Props = {
	tracking: BusTracking
}

export default function TrackMap({ tracking }: Props) {
	const t = useTranslations('Track')
	const [expanded, setExpanded] = useState(false)

	const collapse = useCallback(() => setExpanded(false), [])

	useEffect(() => {
		if (!expanded) return

		document.body.style.overflow = 'hidden'
		window.addEventListener('keydown', collapseOnEscape)

		function collapseOnEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') collapse()
		}

		return () => {
			document.body.style.overflow = ''
			window.removeEventListener('keydown', collapseOnEscape)
		}
	}, [expanded, collapse])

	const hasGeo = tracking.stops.some((stop) => stop.lat !== null && stop.lng !== null)

	if (!hasGeo) {
		return (
			<section className="zeno-card flex h-[55vh] min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center sm:h-[420px]">
				<p className="text-sm font-medium text-zeno-muted">{t('mapUnavailable')}</p>
			</section>
		)
	}

	return (
		<div
			className={
				expanded
					? 'fixed inset-0 z-[900] flex flex-col bg-white'
					: 'relative overflow-hidden rounded-zeno border border-zeno-line shadow-zeno-card'
			}
		>
			<MapCanvas tracking={tracking} expanded={expanded} onToggleExpand={() => setExpanded((value) => !value)} />
		</div>
	)
}

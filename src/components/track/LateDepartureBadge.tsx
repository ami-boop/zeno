'use client'

import { useTranslations } from 'next-intl'
import { CircleAlert } from 'lucide-react'

export default function LateDepartureBadge({ minutes }: { minutes: number | null | undefined }) {
	const t = useTranslations('Track')
	if (minutes === null || minutes === undefined || minutes <= 0) return null

	return (
		<p className="mt-2 flex items-center gap-2 rounded-xl bg-zeno-danger-soft px-3 py-2 text-sm font-bold text-zeno-danger">
			<CircleAlert className="size-4 shrink-0" />
			{t('lateDeparture', { count: minutes })}
		</p>
	)
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import type { BusTracking } from '@/lib/api-contracts'
import { fetchBusTracking } from '@/app/actions/bus-tracking'

const POLL_MS = 20_000
const TERMINAL_STATUSES = new Set(['completed', 'cancelled'])

type TrackingState = {
	tracking: BusTracking | null
	updatedAt: number | null
	clockOffsetMs: number
}

/** Поллинг статуса рейса: пауза в фоне, остановка на терминальном статусе. */
export function useTrackingPoll(initial: BusTracking | null): TrackingState {
	const [tracking, setTracking] = useState<BusTracking | null>(initial)
	const [updatedAt, setUpdatedAt] = useState<number | null>(null)

	useEffect(() => {
		if (!initial || TERMINAL_STATUSES.has(initial.trip.status)) return

		let cancelled = false
		let timer: ReturnType<typeof setTimeout> | undefined

		const tick = async () => {
			if (document.hidden || cancelled) {
				timer = setTimeout(tick, POLL_MS)
				return
			}
			const next = await fetchBusTracking()
			if (cancelled) return
			if (next) {
				setTracking(next)
				setUpdatedAt(Date.now())
			}
			if (!next || !TERMINAL_STATUSES.has(next.trip.status)) {
				timer = setTimeout(tick, POLL_MS)
			}
		}

		timer = setTimeout(tick, POLL_MS)
		return () => {
			cancelled = true
			if (timer) clearTimeout(timer)
		}
	}, [initial])

	const clockOffsetMs = useMemo(
		() => (initial ? Date.parse(initial.serverTimeISO) - Date.now() : 0),
		[initial],
	)

	return { tracking, updatedAt, clockOffsetMs }
}

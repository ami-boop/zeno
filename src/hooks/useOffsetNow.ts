'use client'

import { useEffect, useState } from 'react'

/** Серверное время, тикающее раз в секунду; null до первого тика (гидрация без рассинхрона). */
export function useOffsetNow(clockOffsetMs: number): number | null {
	const [nowMs, setNowMs] = useState<number | null>(null)

	useEffect(() => {
		setNowMs(Date.now() + clockOffsetMs)
		const timer = setInterval(() => setNowMs(Date.now() + clockOffsetMs), 1000)
		return () => clearInterval(timer)
	}, [clockOffsetMs])

	return nowMs
}

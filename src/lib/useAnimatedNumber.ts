'use client'

import { useEffect, useRef, useState } from 'react'

export function useAnimatedNumber(target: number, duration = 800) {
	const [value, setValue] = useState(0)
	const raf = useRef(0)

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setValue(target)
			return
		}
		const start = performance.now()
		const tick = (now: number) => {
			const p = Math.min((now - start) / duration, 1)
			const eased = 1 - Math.pow(1 - p, 3)
			setValue(Math.round(target * eased))
			if (p < 1) raf.current = requestAnimationFrame(tick)
		}
		raf.current = requestAnimationFrame(tick)
		return () => cancelAnimationFrame(raf.current)
	}, [target, duration])

	return value
}

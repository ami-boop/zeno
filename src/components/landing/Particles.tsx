'use client'

import { useEffect, useRef } from 'react'

interface Particle {
	x: number
	y: number
	r: number
	vx: number
	vy: number
	alpha: number
	tw: number
	color: string
}

export default function Particles({ density = 100, className = '' }: { density?: number; className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const colors = ['72, 107, 88', '244, 184, 96']
		let w = 0
		let h = 0
		let parts: Particle[] = []
		let raf = 0

		const spawn = () => {
			parts = Array.from({ length: density }, (_, i) => ({
				x: Math.random() * w,
				y: Math.random() * h,
				r: 1.4 + Math.random() * 3.2,
				vx: (Math.random() - 0.5) * 0.3,
				vy: -(0.2 + Math.random() * 0.5),
				alpha: 0.28 + Math.random() * 0.38,
				tw: Math.random() * Math.PI * 2,
				color: colors[i % 2],
			}))
		}

		const resize = () => {
			w = canvas.parentElement?.clientWidth ?? window.innerWidth
			h = canvas.parentElement?.clientHeight ?? window.innerHeight
			canvas.width = w * dpr
			canvas.height = h * dpr
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
			spawn()
		}

		const tick = (now: number) => {
			ctx.clearRect(0, 0, w, h)
			const t = now / 1000
			for (const p of parts) {
				if (!reduced) {
					p.x += p.vx
					p.y += p.vy
					if (p.y < -6) {
						p.y = h + 6
						p.x = Math.random() * w
					}
					if (p.x < -6) p.x = w + 6
					if (p.x > w + 6) p.x = -6
				}
				const twinkle = 0.55 + 0.45 * Math.sin(t * 1.2 + p.tw)
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(${p.color}, ${(p.alpha * twinkle).toFixed(3)})`
				ctx.fill()
			}
			raf = requestAnimationFrame(tick)
		}

		resize()
		window.addEventListener('resize', resize)
		raf = requestAnimationFrame(tick)
		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', resize)
		}
	}, [density])

	return <canvas ref={canvasRef} className={`h-full w-full ${className}`} />
}

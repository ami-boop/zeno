'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BusFront } from 'lucide-react'

const WORD = 'Zeno'

const curtainEase = [0.76, 0, 0.24, 1] as const

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
	const [phase, setPhase] = useState<'letter' | 'split' | 'done'>('letter')
	const onCompleteRef = useRef(onComplete)
	onCompleteRef.current = onComplete

	useEffect(() => {
		const t1 = setTimeout(() => setPhase('split'), 2150)
		const t2 = setTimeout(() => {
			setPhase('done')
			onCompleteRef.current()
		}, 3000)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
		}
	}, [])

	return (
		<AnimatePresence>
			{phase !== 'done' && (
				<motion.div
					className='fixed inset-0 z-[100] overflow-hidden'
					exit={{ opacity: 0 }}
					transition={{ duration: 0.25 }}
					aria-hidden
				>
					<motion.div
						initial={{ y: 0 }}
						animate={{ y: phase === 'split' ? '-100%' : 0 }}
						transition={{ duration: 0.85, ease: curtainEase }}
						className='absolute inset-x-0 top-0 h-1/2 bg-zeno-night'
					/>
					<motion.div
						initial={{ y: 0 }}
						animate={{ y: phase === 'split' ? '100%' : 0 }}
						transition={{ duration: 0.85, ease: curtainEase }}
						className='absolute inset-x-0 bottom-0 h-1/2 bg-zeno-night'
					/>

					<motion.div
						animate={phase === 'split' ? { opacity: 0, scale: 0.92, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
						transition={{ duration: 0.35, ease: 'easeIn' }}
						className='absolute inset-0 flex flex-col items-center justify-center gap-7'
					>
						<motion.div
							initial={{ scale: 0, rotate: -14 }}
							animate={{ scale: 1, rotate: 0 }}
							transition={{ type: 'spring', stiffness: 240, damping: 17, delay: 0.15 }}
							className='flex size-24 items-center justify-center rounded-zeno bg-zeno-amber shadow-zeno-board'
						>
							<BusFront className='size-12 text-zeno-ink' />
						</motion.div>

						<div className='flex overflow-hidden'>
							{WORD.split('').map((ch, i) => (
								<motion.span
									key={i}
									initial={{ y: '115%' }}
									animate={{ y: 0 }}
									transition={{ delay: 0.4 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
									className='font-display text-6xl font-extrabold tracking-tight text-white sm:text-7xl'
								>
									{ch}
								</motion.span>
							))}
						</div>

						<motion.p
							initial={{ opacity: 0, letterSpacing: '0.2em' }}
							animate={{ opacity: 1, letterSpacing: '0.42em' }}
							transition={{ delay: 1.05, duration: 0.7, ease: 'easeOut' }}
							className='pe-[0.42em] text-xs font-bold uppercase text-zeno-amber'
						>
							School Bus Tracking
						</motion.p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

'use client'

import { useMemo } from 'react'
import { BusFront, CheckCircle, Route as RouteIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import TiltedCard from '@/components/TiltedCard'

const SHOWCASE_KEYS = ['showcase_0', 'showcase_1', 'showcase_2'] as const

function RouteCard() {
	const t = useTranslations('Landing')
	const stops = ['Afula', "Giv'at HaMoreh", 'Center', 'School']

	return (
		<div className='flex h-full w-full flex-col gap-4 rounded-[15px] bg-zeno-night/90 p-6 text-start shadow-zeno-board backdrop-blur-md'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2 text-zeno-amber'>
					<BusFront className='size-5' />
					<span className='text-sm font-bold'>{t('showcase_route')}</span>
				</div>
				<span className='flex items-center gap-1.5 rounded-full bg-zeno-sage/25 px-3 py-1 text-[11px] font-bold text-zeno-sage'>
					<span className='relative flex size-1.5'>
						<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-zeno-sage opacity-75' />
						<span className='relative inline-flex size-1.5 rounded-full bg-zeno-sage' />
					</span>
					Live
				</span>
			</div>

			<div className='relative flex-1'>
				<svg viewBox='0 0 300 140' className='h-full w-full'>
					<path
						d='M20 120 C 90 120, 90 30, 160 30 S 250 90, 280 60'
						fill='none'
						stroke='#f4b860'
						strokeWidth='3'
						strokeDasharray='7 6'
						strokeLinecap='round'
						className='animate-[dashmove_1.2s_linear_infinite]'
					/>
					{stops.map((_, i) => {
						const x = [20, 95, 175, 280][i]
						const y = [120, 42, 48, 60][i]
						return (
							<g key={i}>
								<circle cx={x} cy={y} r='7' fill='#15232d' stroke='#f4b860' strokeWidth='2.5' />
								<circle cx={x} cy={y} r='2.5' fill='#f4b860' />
							</g>
						)
					})}
				</svg>
				<div className='absolute right-4 top-2 flex items-center gap-1.5 rounded-full bg-zeno-amber px-3 py-1 text-[11px] font-bold text-zeno-amber-fg shadow-lg'>
					<RouteIcon className='size-3.5' />
					{stops[0]}
				</div>
			</div>

			<div className='grid grid-cols-2 gap-3'>
				<div className='rounded-xl bg-white/5 p-3'>
					<p className='text-[10px] font-bold uppercase tracking-wider text-zeno-muted'>{t('showcase_time')}</p>
					<p className='mt-1 text-lg font-extrabold text-white'>15:45</p>
				</div>
				<div className='rounded-xl bg-white/5 p-3'>
					<p className='text-[10px] font-bold uppercase tracking-wider text-zeno-muted'>{t('showcase_stop')}</p>
					<p className='mt-1 text-lg font-extrabold text-white'>{stops[2]}</p>
				</div>
			</div>
		</div>
	)
}

export default function ShowcaseSection() {
	const t = useTranslations('Landing')

	const routeImage = useMemo(() => {
		const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='340'>
			<defs>
				<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0' stop-color='#f4b860'/>
					<stop offset='1' stop-color='#486b58'/>
				</linearGradient>
			</defs>
			<rect width='420' height='340' rx='24' fill='url(#g)'/>
		</svg>`
		return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
	}, [])

	return (
		<section className='relative z-10 overflow-hidden py-24'>
			<div className='mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.6 }}
				>
					<p className='mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zeno-amber-deep'>
						{t('showcase_kicker')}
					</p>
					<h2 className='font-display text-3xl font-extrabold tracking-tight text-zeno-ink sm:text-4xl'>
						{t('showcase_title')}
					</h2>
					<p className='mt-4 max-w-md text-lg leading-relaxed text-zeno-ink-soft'>
						{t('showcase_desc')}
					</p>
					<ul className='mt-8 space-y-4'>
						{SHOWCASE_KEYS.map((key, i) => (
							<motion.li
								key={key}
								initial={{ opacity: 0, x: -16 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.15 + i * 0.12 }}
								className='flex items-center gap-3 text-zeno-ink-soft'
							>
								<span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-zeno-sage-soft text-zeno-sage'>
									<CheckCircle className='size-4' />
								</span>
								{t(key)}
							</motion.li>
						))}
					</ul>
				</motion.div>

				<motion.div className='relative mx-auto flex w-full max-w-md justify-center'>
					<motion.div
						initial={{ opacity: 0, scale: 0.94 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, margin: '-60px' }}
						transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
					>
						<TiltedCard
							imageSrc={routeImage}
							altText='Zeno route card'
							captionText='Hover to tilt'
							containerHeight='min(360px, 72vw)'
							containerWidth='min(420px, 86vw)'
							imageHeight='min(340px, 68vw)'
							imageWidth='min(420px, 86vw)'
							rotateAmplitude={16}
							scaleOnHover={1.03}
							showMobileWarning={false}
							displayOverlayContent
							overlayContent={<RouteCard />}
						/>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}

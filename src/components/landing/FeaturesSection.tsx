'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Clock, MapPin, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion } from 'framer-motion'

const featureGradients = [
	['#3b82f6', '#06b6d4'],
	['#22c55e', '#10b981'],
	['#a855f7', '#ec4899'],
	['#f97316', '#ef4444'],
] as const

export default function FeaturesSection() {
	const t = useTranslations('Landing')
	const [activeFeature, setActiveFeature] = useState(0)
	const featureRefs = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		const io = new IntersectionObserver(
			entries => {
				entries.forEach(e => {
					if (e.isIntersecting) {
						const idx = featureRefs.current.indexOf(e.target as HTMLDivElement)
						if (idx !== -1) setActiveFeature(idx)
					}
				})
			},
			{ rootMargin: '-35% 0px -55% 0px', threshold: 0 }
		)
		featureRefs.current.forEach(el => el && io.observe(el))
		return () => io.disconnect()
	}, [])

	const features = [
		{ icon: <MapPin className='size-8' />, title: t('feature_0_title'), description: t('feature_0_desc'), color: t('feature_0_color') },
		{ icon: <Clock className='size-8' />, title: t('feature_1_title'), description: t('feature_1_desc'), color: t('feature_1_color') },
		{ icon: <Bell className='size-8' />, title: t('feature_2_title'), description: t('feature_2_desc'), color: t('feature_2_color') },
		{ icon: <Shield className='size-8' />, title: t('feature_3_title'), description: t('feature_3_desc'), color: t('feature_3_color') },
	]

	return (
		<section id='features' className='relative z-10 py-24'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='grid gap-14 lg:grid-cols-[minmax(24rem,5fr)_minmax(0,7fr)] lg:gap-16'>
					<div className='lg:sticky lg:top-28 lg:self-start'>
						<p className='mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zeno-amber-deep'>
							{t('features_kicker')}
						</p>
						<h2 className='font-display text-4xl font-extrabold leading-tight tracking-tight text-zeno-ink sm:text-5xl'>
							{t('features_title')}
						</h2>

						<AnimatePresence mode='wait'>
							<motion.div
								key={activeFeature}
								initial={{ opacity: 0, y: 16 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -16 }}
								transition={{ duration: 0.3, ease: 'easeOut' }}
								className='mt-10'
							>
								<div
									className='mb-5 flex size-16 items-center justify-center rounded-2xl text-white shadow-lg'
									style={{
										backgroundImage: `linear-gradient(135deg, ${featureGradients[activeFeature][0]}, ${featureGradients[activeFeature][1]})`,
									}}
								>
									{features[activeFeature].icon}
								</div>
								<h3 className='font-display text-2xl font-bold tracking-tight text-zeno-ink'>
									{features[activeFeature].title}
								</h3>
								<p className='mt-4 max-w-md text-lg leading-relaxed text-zeno-ink-soft'>
									{features[activeFeature].description}
								</p>
							</motion.div>
						</AnimatePresence>

						<div className='mt-12 flex items-center gap-2 text-xs font-bold tracking-widest text-zeno-muted'>
							<span className='font-display text-2xl text-zeno-ink'>0{activeFeature + 1}</span>
							<span>/ 04</span>
						</div>
					</div>

					<div className='space-y-8'>
						{features.map((feature, i) => (
							<motion.div
								key={i}
								ref={el => {
									featureRefs.current[i] = el
								}}
								initial={{ opacity: 0, y: 32 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: '-40px' }}
								transition={{ duration: 0.55 }}
								className={`zeno-card min-h-52 p-9 transition-shadow duration-300 ${activeFeature === i ? 'shadow-zeno-board' : ''}`}
							>
								<div className='flex items-start gap-6'>
									<div
										className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
									>
										{feature.icon}
									</div>
									<div>
										<h3 className='mb-2 text-xl font-bold text-zeno-ink'>{feature.title}</h3>
										<p className='max-w-xl leading-relaxed text-zeno-ink-soft'>{feature.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

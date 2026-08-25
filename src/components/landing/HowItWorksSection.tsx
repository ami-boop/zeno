'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function HowItWorksSection() {
	const t = useTranslations('Landing')

	const steps = [
		{ num: '1', chip: 'bg-zeno-amber text-zeno-amber-fg', title: t('how_0_title'), desc: t('how_0_desc') },
		{ num: '2', chip: 'bg-zeno-sage text-white', title: t('how_2_title'), desc: t('how_2_desc') },
	]

	return (
		<section id='how-it-works' className='relative z-10 py-24'>
			<div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.6 }}
					className='mx-auto mb-16 max-w-2xl text-center'
				>
					<p className='mb-3 text-xs font-bold uppercase tracking-[0.25em] text-zeno-amber-deep'>
						{t('how_kicker')}
					</p>
					<h2 className='font-display text-3xl font-extrabold tracking-tight text-zeno-ink sm:text-4xl'>
						{t('how_title')}
					</h2>
					<p className='mt-4 text-lg text-zeno-ink-soft'>{t('how_desc')}</p>
				</motion.div>

				<div className='relative grid gap-10 md:grid-cols-2 md:gap-8'>
					<div className='absolute inset-x-16 top-8 hidden border-t-2 border-dashed border-zeno-line-strong md:block' />
					{steps.map((step, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 34 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-60px' }}
							transition={{ duration: 0.55, delay: i * 0.15 }}
							className='relative text-center'
						>
							<motion.div
								whileHover={{ scale: 1.08, rotate: 6 }}
								transition={{ type: 'spring', stiffness: 300, damping: 15 }}
								className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-zeno-card ${step.chip}`}
							>
								{step.num}
							</motion.div>
							<h3 className='mb-3 text-xl font-bold text-zeno-ink'>{step.title}</h3>
							<p className='mx-auto max-w-xs leading-relaxed text-zeno-ink-soft'>{step.desc}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

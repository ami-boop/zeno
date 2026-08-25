'use client'

import { ArrowRight, Heart } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import Magnet from '@/components/Magnet'
import Particles from '@/components/landing/Particles'
import Waves from '@/components/landing/Waves'

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

type Props = {
	introDone: boolean
}

export default function HeroSection({ introDone }: Props) {
	const t = useTranslations('Landing')

	const { scrollY } = useScroll()
	const heroY = useTransform(scrollY, [0, 700], [0, 150])
	const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.15])

	return (
		<motion.section
			style={{ y: heroY, opacity: heroOpacity }}
			className='relative flex min-h-dvh items-center overflow-hidden px-4 pb-24 pt-28'
		>
			<Waves />
			<div className='pointer-events-none absolute inset-0'>
				<Particles />
			</div>
			<div className='relative mx-auto w-full max-w-5xl text-center'>
				<motion.div
					variants={fadeUp}
					initial='hidden'
					animate={introDone ? 'show' : 'hidden'}
					className='mb-7 inline-flex items-center gap-2 rounded-full border border-zeno-amber/40 bg-zeno-amber/15 px-5 py-2 text-sm font-semibold text-zeno-amber-ink backdrop-blur-sm'
				>
					<Heart className='size-4' />
					{t('hero_tagline')}
				</motion.div>

				<h1 className='font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-zeno-ink sm:text-6xl lg:text-7xl'>
					<motion.span
						variants={fadeUp}
						initial='hidden'
						animate={introDone ? 'show' : 'hidden'}
						transition={{ delay: 0.05 }}
						className='block'
					>
						{t('hero_title1')}
					</motion.span>
					<motion.span
						variants={fadeUp}
						initial='hidden'
						animate={introDone ? 'show' : 'hidden'}
						transition={{ delay: 0.15 }}
						className='block bg-gradient-to-r from-zeno-amber-deep via-zeno-amber to-zeno-sage bg-clip-text text-transparent'
					>
						{t('hero_title2')}
					</motion.span>
				</h1>

				<motion.p
					variants={fadeUp}
					initial='hidden'
					animate={introDone ? 'show' : 'hidden'}
					transition={{ delay: 0.28 }}
					className='mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-zeno-ink-soft sm:text-xl'
				>
					{t('hero_desc')}
				</motion.p>

				<motion.div
					variants={fadeUp}
					initial='hidden'
					animate={introDone ? 'show' : 'hidden'}
					transition={{ delay: 0.4 }}
					className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
				>
					<Magnet padding={60} magnetStrength={4} wrapperClassName='inline-flex'>
						<Link href='/login' className='zeno-primary zeno-focus inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold shadow-zeno-card'>
							{t('hero_start')}
							<ArrowRight className='size-5 rtl:rotate-180' />
						</Link>
					</Magnet>
					<a href='#features' className='zeno-focus inline-flex items-center gap-2 rounded-2xl border border-zeno-line-strong bg-zeno-surface/60 px-8 py-4 text-base font-semibold text-zeno-ink backdrop-blur-sm transition hover:border-zeno-ink/30 hover:bg-zeno-surface'>
						{t('hero_more')}
					</a>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={introDone ? { opacity: 1 } : {}}
				transition={{ delay: 1.2, duration: 0.8 }}
				className='absolute bottom-7 left-1/2 -translate-x-1/2'
			>
				<motion.div
					animate={{ y: [0, 8, 0] }}
					transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
					className='flex h-10 w-6 items-start justify-center rounded-full border-2 border-zeno-ink/30 p-1.5'
				>
					<div className='size-1.5 rounded-full bg-zeno-amber-deep' />
				</motion.div>
			</motion.div>
		</motion.section>
	)
}

'use client'

import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Magnet from '@/components/Magnet'

export default function CtaSection() {
	const t = useTranslations('Landing')

	return (
		<section className='relative z-10 overflow-hidden bg-zeno-night py-24'>
			<div className='pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-zeno-amber/20 blur-3xl' />
			<div className='pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-zeno-sage/30 blur-3xl' />
			<div className='relative mx-auto max-w-3xl px-4 text-center sm:px-6'>
				<motion.h2
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl'
				>
					{t('cta_title')}
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className='mx-auto mt-5 max-w-xl text-lg leading-relaxed text-zeno-line-strong'
				>
					{t('cta_desc')}
				</motion.p>
				<motion.div
					initial={{ opacity: 0, scale: 0.94 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className='mt-10 flex justify-center'
				>
					<Magnet padding={70} magnetStrength={5} wrapperClassName='inline-flex'>
						<Link href='/login' className='zeno-focus inline-flex items-center gap-2 rounded-2xl bg-zeno-amber px-9 py-4 text-base font-bold text-zeno-amber-fg shadow-zeno-board transition hover:bg-zeno-amber/90'>
							{t('cta_login')}
							<ArrowRight className='size-5 rtl:rotate-180' />
						</Link>
					</Magnet>
				</motion.div>
			</div>
		</section>
	)
}

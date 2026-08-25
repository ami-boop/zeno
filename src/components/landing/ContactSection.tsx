'use client'

import { Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function ContactSection() {
	const t = useTranslations('Landing')

	const contacts = [
		{ label: t('contact_admin_label'), phone: t('contact_admin_phone'), email: t('contact_admin_email') },
		{ label: t('contact_support_label'), phone: t('contact_support_phone'), email: t('contact_support_email') },
	]

	return (
		<section id='contact' className='relative z-10 py-20'>
			<div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className='text-center'
				>
					<h2 className='font-display text-2xl font-extrabold tracking-tight text-zeno-ink sm:text-3xl'>
						{t('contact_title')}
					</h2>
					<p className='mt-3 text-zeno-ink-soft'>{t('contact_desc')}</p>
					<div className='mx-auto mt-10 flex max-w-3xl flex-col justify-center gap-5 sm:flex-row'>
						{contacts.map((c, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 22 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: i * 0.12 }}
								whileHover={{ y: -4 }}
								className='zeno-card flex-1 p-7 text-start'
							>
								<div className='mb-3 flex items-center gap-2 text-zeno-amber-deep'>
									{i === 0 ? <Mail className='size-4' /> : <Phone className='size-4' />}
									<h3 className='font-bold text-zeno-ink'>{c.label}</h3>
								</div>
								<p className='text-sm text-zeno-ink-soft'>{c.phone}</p>
								<p className='text-sm text-zeno-ink-soft'>{c.email}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}

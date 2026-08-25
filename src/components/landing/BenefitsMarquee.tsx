'use client'

import { CheckCircle, Heart, Navigation } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function BenefitsMarquee() {
	const t = useTranslations('Landing')

	const benefits = [
		{ icon: <Navigation className='size-5' />, title: t('benefit_0_title'), description: t('benefit_0_desc') },
		{ icon: <Heart className='size-5' />, title: t('benefit_1_title'), description: t('benefit_1_desc') },
		{ icon: <CheckCircle className='size-5' />, title: t('benefit_2_title'), description: t('benefit_2_desc') },
	]

	return (
		<section dir='ltr' className='relative z-10 overflow-hidden bg-zeno-night py-4'>
			<div className='zeno-marquee-track flex w-max items-center gap-10 whitespace-nowrap'>
				{[0, 1].map(dup => (
					<div key={dup} className='flex items-center gap-10'>
						{benefits.map((b, i) => (
							<span key={i} className='flex items-center gap-3 text-sm font-semibold tracking-wide text-zeno-paper'>
								<span className='text-zeno-amber'>{b.icon}</span>
								{b.title}
								<span className='ms-8 text-zeno-amber'>{b.description}</span>
								<span className='ms-8 text-zeno-muted'>✦</span>
							</span>
						))}
					</div>
				))}
			</div>
		</section>
	)
}

'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'
import dayjs from 'dayjs'
import IntroOverlay from '@/components/landing/IntroOverlay'
import DotField from '@/components/DotField'
import LandingHeader from '@/components/landing/LandingHeader'
import HeroSection from '@/components/landing/HeroSection'
import BenefitsMarquee from '@/components/landing/BenefitsMarquee'
import FeaturesSection from '@/components/landing/FeaturesSection'
import ShowcaseSection from '@/components/landing/ShowcaseSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import CtaSection from '@/components/landing/CtaSection'
import ContactSection from '@/components/landing/ContactSection'

const MeshBackground = dynamic(() => import('@/components/landing/MeshBackground'), {
	ssr: false,
	loading: () => null,
})

export default function ZenoLanding() {
	const t = useTranslations('Landing')
	const [introDone, setIntroDone] = useState(false)

	return (
		<div className='zeno-page min-h-dvh'>
			{!introDone && <IntroOverlay onComplete={() => setIntroDone(true)} />}

			<div className='pointer-events-none fixed inset-0 z-0'>
				<MeshBackground
					fallback={
						<DotField
							dotRadius={2.2}
							dotSpacing={16}
							cursorRadius={340}
							cursorForce={0.12}
							bulgeOnly
							bulgeStrength={80}
							glowRadius={200}
							sparkle
							glowColor='#f4b860'
							gradientFrom='rgba(21, 35, 45, 0.09)'
							gradientTo='rgba(72, 107, 88, 0.18)'
						/>
					}
				/>
			</div>

			<LandingHeader />
			<HeroSection introDone={introDone} />
			<BenefitsMarquee />
			<FeaturesSection />
			<ShowcaseSection />
			<HowItWorksSection />
			<CtaSection />
			<ContactSection />

			<footer className='relative z-10 border-t border-zeno-line bg-zeno-paper-soft py-8'>
				<div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-zeno-muted sm:flex-row sm:px-6 lg:px-8'>
					<span className='font-display font-bold text-zeno-ink'>{t('brand')}</span>
					<span>© {dayjs().year()} Zeno</span>
				</div>
			</footer>
		</div>
	)
}

'use client'

import { useState, useEffect } from 'react'
import {
	MapPin,
	Shield,
	Bell,
	Clock,
	Navigation,
	Heart,
	ArrowRight,
	CheckCircle,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import LangSelector from '@/components/LangSelector'

const ZenoLanding = () => {
	const locale = useLocale()
	const t = useTranslations('Landing')
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const features = [
		{
			icon: <MapPin className='w-8 h-8' />,
			title: t('feature_0_title'),
			description: t('feature_0_desc'),
			color: t('feature_0_color'),
		},
		{
			icon: <Clock className='w-8 h-8' />,
			title: t('feature_1_title'),
			description: t('feature_1_desc'),
			color: t('feature_1_color'),
		},
		{
			icon: <Bell className='w-8 h-8' />,
			title: t('feature_2_title'),
			description: t('feature_2_desc'),
			color: t('feature_2_color'),
		},
		{
			icon: <Shield className='w-8 h-8' />,
			title: t('feature_3_title'),
			description: t('feature_3_desc'),
			color: t('feature_3_color'),
		},
	]

	const benefits = [
		{
			icon: <Navigation className='w-6 h-6' />,
			title: t('benefit_0_title'),
			description: t('benefit_0_desc'),
		},
		{
			icon: <Heart className='w-6 h-6' />,
			title: t('benefit_1_title'),
			description: t('benefit_1_desc'),
		},
		{
			icon: <CheckCircle className='w-6 h-6' />,
			title: t('benefit_2_title'),
			description: t('benefit_2_desc'),
		},
	]

	return (
		<div className='zeno-page'>
			{/* Header */}
			<header
				className={`fixed w-full top-0 z-50 transition-all duration-300 ${
							scrolled ? 'bg-zeno-paper/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
				}`}
			>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-3'>
							<span className='text-2xl font-bold tracking-tight text-zeno-ink'>
								{t('brand')}
							</span>
						</div>

						<LangSelector locale={locale} path='/' />

						<Link href='/login'>
							<button className='zeno-primary zeno-focus rounded-xl px-6 py-2.5 font-semibold shadow-sm'>
								{t('login')}
							</button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className='relative pt-24 pb-16 overflow-hidden'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<div className='mb-6 inline-flex items-center rounded-full bg-zeno-amber/25 px-4 py-2 text-sm font-semibold text-zeno-amber-ink'>
							<Heart className='w-4 h-4 mr-2' />
							{t('hero_tagline')}
						</div>

						<h1 className='mb-6 text-4xl font-bold leading-tight tracking-tight text-zeno-ink md:text-6xl'>
							{t('hero_title1')}
							<span className='block text-zeno-sage'>
								{t('hero_title2')}
							</span>
						</h1>

						<p className='mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-zeno-ink-soft md:text-2xl'>
							{t('hero_desc')}
						</p>

						<div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
							<Link href='/login'>
								<button className='zeno-primary zeno-focus inline-flex items-center rounded-2xl px-8 py-4 text-lg font-semibold shadow-sm hover:-translate-y-0.5'>
									{t('hero_start')}
									<ArrowRight className='ml-2 w-5 h-5' />
								</button>
							</Link>
						</div>

						{/* Hero Image */}
						<div className='relative max-w-4xl mx-auto'>
							<div className='rounded-zeno bg-zeno-amber p-1 shadow-xl'>
								<div className='bg-white rounded-xl overflow-hidden'>
									{/* <Image
										width={1200}
										height={600}
										src='https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&h=600&fit=crop'
										alt='school bus'
										className='w-full h-auto'
									/> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Benefits */}
			<section className='bg-white py-12'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-3 gap-8'>
						{benefits.map((benefit, index) => (
							<div key={index} className='text-center'>
								<div className='mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-zeno-sage-soft text-zeno-sage'>
									<div>{benefit.icon}</div>
								</div>
								<h3 className='mb-2 text-lg font-semibold text-zeno-ink'>
									{benefit.title}
								</h3>
								<p className='text-zeno-ink-soft'>{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='bg-zeno-paper py-20'
			>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='mb-4 text-3xl font-bold tracking-tight text-zeno-ink md:text-4xl'>
							{t('features_title')}
						</h2>
						<p className='mx-auto max-w-3xl text-xl text-zeno-ink-soft'>
							{t('features_desc')}
						</p>
					</div>

					<div className='grid md:grid-cols-2 gap-8'>
						{features.map((feature, index) => (
							<div key={index} className='group'>
								<div className='zeno-card h-full p-8 transition hover:-translate-y-1'>
									<div
										className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
									>
										{feature.icon}
									</div>
									<h3 className='mb-4 text-xl font-bold text-zeno-ink'>
										{feature.title}
									</h3>
									<p className='text-lg leading-relaxed text-zeno-ink-soft'>
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section id='how-it-works' className='bg-white py-20'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='mb-4 text-3xl font-bold tracking-tight text-zeno-ink md:text-4xl'>
							{t('how_title')}
						</h2>
						<p className='text-xl text-zeno-ink-soft'>{t('how_desc')}</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<div className='mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-zeno-amber text-2xl font-bold text-zeno-ink'>
								1
							</div>
							<h3 className='mb-4 text-xl font-bold text-zeno-ink'>
								{t('how_0_title')}
							</h3>
							<p className='text-lg text-zeno-ink-soft'>{t('how_0_desc')}</p>
						</div>

						<div className='text-center'>
							<div className='mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-zeno-sage text-2xl font-bold text-white'>
								2
							</div>
							<h3 className='mb-4 text-xl font-bold text-zeno-ink'>
								{t('how_1_title')}
							</h3>
							<p className='text-lg text-zeno-ink-soft'>{t('how_1_desc')}</p>
						</div>

						<div className='text-center'>
							<div className='mb-6 inline-flex size-16 items-center justify-center rounded-2xl bg-zeno-ink text-2xl font-bold text-zeno-amber'>
								3
							</div>
							<h3 className='mb-4 text-xl font-bold text-zeno-ink'>
								{t('how_2_title')}
							</h3>
							<p className='text-lg text-zeno-ink-soft'>{t('how_2_desc')}</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='bg-zeno-ink py-20'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
						{t('cta_title')}
					</h2>
					<p className='mx-auto mb-8 max-w-2xl text-xl text-zeno-line-strong'>
						{t('cta_desc')}
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link href='/login'>
								<button className='inline-flex items-center rounded-2xl bg-zeno-amber px-8 py-4 text-lg font-semibold text-zeno-ink shadow-sm transition hover:-translate-y-0.5 hover:bg-zeno-amber/80'>
								{t('cta_login')}
								<ArrowRight className='ml-2 w-5 h-5' />
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id='contact' className='bg-zeno-paper py-16'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<h2 className='mb-4 text-2xl font-bold text-zeno-ink'>
							{t('contact_title')}
						</h2>
						<p className='mb-6 text-zeno-ink-soft'>{t('contact_desc')}</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<div className='zeno-card p-6'>
								<h3 className='mb-2 font-semibold text-zeno-ink'>
									{t('contact_admin_label')}
								</h3>
								<p className='text-zeno-ink-soft'>{t('contact_admin_phone')}</p>
								<p className='text-zeno-ink-soft'>{t('contact_admin_email')}</p>
							</div>
							<div className='zeno-card p-6'>
								<h3 className='mb-2 font-semibold text-zeno-ink'>
									{t('contact_support_label')}
								</h3>
								<p className='text-zeno-ink-soft'>{t('contact_support_phone')}</p>
								<p className='text-zeno-ink-soft'>{t('contact_support_email')}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default ZenoLanding

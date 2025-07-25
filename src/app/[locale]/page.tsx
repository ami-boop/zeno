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
		<div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
			{/* Header */}
			<header
				className={`fixed w-full top-0 z-50 transition-all duration-300 ${
					scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
				}`}
			>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-3'>
							<span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
								{t('brand')}
							</span>
						</div>

						<LangSelector locale={locale} />

						<Link href='/login'>
							<button className='bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl'>
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
						<div className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6'>
							<Heart className='w-4 h-4 mr-2' />
							{t('hero_tagline')}
						</div>

						<h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight'>
							{t('hero_title1')}
							<span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block'>
								{t('hero_title2')}
							</span>
						</h1>

						<p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
							{t('hero_desc')}
						</p>

						<div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
							<Link href='/login'>
								<button className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200'>
									{t('hero_start')}
									<ArrowRight className='ml-2 w-5 h-5' />
								</button>
							</Link>
						</div>

						{/* Hero Image */}
						<div className='relative max-w-4xl mx-auto'>
							<div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-1 shadow-2xl'>
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
			<section className='py-12 bg-white'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid md:grid-cols-3 gap-8'>
						{benefits.map((benefit, index) => (
							<div key={index} className='text-center'>
								<div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-4'>
									<div className='text-blue-600'>{benefit.icon}</div>
								</div>
								<h3 className='text-lg font-semibold text-gray-900 mb-2'>
									{benefit.title}
								</h3>
								<p className='text-gray-600'>{benefit.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section
				id='features'
				className='py-20 bg-gradient-to-br from-gray-50 to-blue-50'
			>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							{t('features_title')}
						</h2>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
							{t('features_desc')}
						</p>
					</div>

					<div className='grid md:grid-cols-2 gap-8'>
						{features.map((feature, index) => (
							<div key={index} className='group'>
								<div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full'>
									<div
										className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
									>
										{feature.icon}
									</div>
									<h3 className='text-xl font-bold text-gray-900 mb-4'>
										{feature.title}
									</h3>
									<p className='text-gray-600 leading-relaxed text-lg'>
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section id='how-it-works' className='py-20 bg-white'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
							{t('how_title')}
						</h2>
						<p className='text-xl text-gray-600'>{t('how_desc')}</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 text-white text-2xl font-bold'>
								1
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-4'>
								{t('how_0_title')}
							</h3>
							<p className='text-gray-600 text-lg'>{t('how_0_desc')}</p>
						</div>

						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mb-6 text-white text-2xl font-bold'>
								2
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-4'>
								{t('how_1_title')}
							</h3>
							<p className='text-gray-600 text-lg'>{t('how_1_desc')}</p>
						</div>

						<div className='text-center'>
							<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 text-white text-2xl font-bold'>
								3
							</div>
							<h3 className='text-xl font-bold text-gray-900 mb-4'>
								{t('how_2_title')}
							</h3>
							<p className='text-gray-600 text-lg'>{t('how_2_desc')}</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 bg-gradient-to-r from-blue-600 to-indigo-600'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
						{t('cta_title')}
					</h2>
					<p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
						{t('cta_desc')}
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link href='/login'>
							<button className='inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200'>
								{t('cta_login')}
								<ArrowRight className='ml-2 w-5 h-5' />
							</button>
						</Link>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section id='contact' className='py-16 bg-gray-50'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center'>
						<h2 className='text-2xl font-bold text-gray-900 mb-4'>
							{t('contact_title')}
						</h2>
						<p className='text-gray-600 mb-6'>{t('contact_desc')}</p>
						<div className='flex flex-col sm:flex-row gap-4 justify-center'>
							<div className='bg-white rounded-lg p-6 shadow-lg'>
								<h3 className='font-semibold text-gray-900 mb-2'>
									{t('contact_admin_label')}
								</h3>
								<p className='text-gray-600'>{t('contact_admin_phone')}</p>
								<p className='text-gray-600'>{t('contact_admin_email')}</p>
							</div>
							<div className='bg-white rounded-lg p-6 shadow-lg'>
								<h3 className='font-semibold text-gray-900 mb-2'>
									{t('contact_support_label')}
								</h3>
								<p className='text-gray-600'>{t('contact_support_phone')}</p>
								<p className='text-gray-600'>{t('contact_support_email')}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default ZenoLanding

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
	MapPin,
	Shield,
	Bell,
	Clock,
	Navigation,
	Heart,
	ArrowRight,
	CheckCircle,
	BusFront,
	Route,
	Phone,
	Mail,
} from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import dayjs from '@/lib/time'
import LangSelector from '@/components/LangSelector'
import TiltedCard from '@/components/TiltedCard'
import Magnet from '@/components/Magnet'
import IntroOverlay from '@/components/landing/IntroOverlay'
import Particles from '@/components/landing/Particles'
import DotField from '@/components/DotField'
import Waves from '@/components/landing/Waves'

const MeshBackground = dynamic(() => import('@/components/landing/MeshBackground'), {
	ssr: false,
	loading: () => null,
})

const fadeUp = {
	hidden: { opacity: 0, y: 26 },
	show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
}

const featureGradients = [
	['#3b82f6', '#06b6d4'],
	['#22c55e', '#10b981'],
	['#a855f7', '#ec4899'],
	['#f97316', '#ef4444'],
]

const ZenoLanding = () => {
	const locale = useLocale()
	const t = useTranslations('Landing')
	const [introDone, setIntroDone] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const [activeFeature, setActiveFeature] = useState(0)
	const featureRefs = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

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

	const { scrollY } = useScroll()
	const heroY = useTransform(scrollY, [0, 700], [0, 150])
	const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.15])

	const features = [
		{ icon: <MapPin className='size-8' />, title: t('feature_0_title'), description: t('feature_0_desc'), color: t('feature_0_color') },
		{ icon: <Clock className='size-8' />, title: t('feature_1_title'), description: t('feature_1_desc'), color: t('feature_1_color') },
		{ icon: <Bell className='size-8' />, title: t('feature_2_title'), description: t('feature_2_desc'), color: t('feature_2_color') },
		{ icon: <Shield className='size-8' />, title: t('feature_3_title'), description: t('feature_3_desc'), color: t('feature_3_color') },
	]

	const benefits = [
		{ icon: <Navigation className='size-5' />, title: t('benefit_0_title'), description: t('benefit_0_desc') },
		{ icon: <Heart className='size-5' />, title: t('benefit_1_title'), description: t('benefit_1_desc') },
		{ icon: <CheckCircle className='size-5' />, title: t('benefit_2_title'), description: t('benefit_2_desc') },
	]

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

			{/* Header */}
			<header
				className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
					scrolled ? 'bg-zeno-paper/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
				}`}
			>
				<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
					<span className='font-display text-xl font-extrabold tracking-tight text-zeno-ink'>
						{t('brand')}
					</span>

					<nav className='hidden items-center gap-8 md:flex'>
						{['features', 'how-it-works', 'contact'].map(id => (
							<a
								key={id}
								href={`#${id}`}
								className='zeno-focus rounded-lg px-2 py-1 text-sm font-semibold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'
							>
								{t(`nav_${id}` as 'nav_features')}
							</a>
						))}
					</nav>

					<div className='flex items-center gap-3'>
						<LangSelector locale={locale} path='/' />
						<Link href='/login'>
							<button className='zeno-primary zeno-focus rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm'>
								{t('login')}
							</button>
						</Link>
					</div>
				</div>
			</header>

			{/* Hero */}
			<motion.section style={{ y: heroY, opacity: heroOpacity }} className='relative flex min-h-dvh items-center overflow-hidden px-4 pb-24 pt-28'>
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
							<Link href='/login'>
								<button className='zeno-primary zeno-focus inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold shadow-zeno-card'>
									{t('hero_start')}
									<ArrowRight className='size-5 rtl:rotate-180' />
								</button>
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

			{/* Benefits marquee */}
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

			{/* Features */}
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

			{/* Route showcase */}
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
							{['showcase_0', 'showcase_1', 'showcase_2'].map((key, i) => (
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
									{t(key as 'showcase_0')}
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

			{/* How it works */}
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
						{[
							{ num: '1', chip: 'bg-zeno-amber text-zeno-amber-fg', title: t('how_0_title'), desc: t('how_0_desc') },
							{ num: '2', chip: 'bg-zeno-sage text-white', title: t('how_2_title'), desc: t('how_2_desc') },
						].map((step, i) => (
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

			{/* CTA */}
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
							<Link href='/login'>
								<button className='zeno-focus inline-flex items-center gap-2 rounded-2xl bg-zeno-amber px-9 py-4 text-base font-bold text-zeno-amber-fg shadow-zeno-board transition hover:bg-zeno-amber/90'>
									{t('cta_login')}
									<ArrowRight className='size-5 rtl:rotate-180' />
								</button>
							</Link>
						</Magnet>
					</motion.div>
				</div>
			</section>

			{/* Contact */}
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
							{[
								{ label: t('contact_admin_label'), phone: t('contact_admin_phone'), email: t('contact_admin_email') },
								{ label: t('contact_support_label'), phone: t('contact_support_phone'), email: t('contact_support_email') },
							].map((c, i) => (
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

			<footer className='relative z-10 border-t border-zeno-line bg-zeno-paper-soft py-8'>
				<div className='mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-zeno-muted sm:flex-row sm:px-6 lg:px-8'>
					<span className='font-display font-bold text-zeno-ink'>{t('brand')}</span>
					<span>© {dayjs().year()} Zeno</span>
				</div>
			</footer>
		</div>
	)
}

function RouteCard() {
	const t = useTranslations('Landing')
	const stops = ['Afula', 'Giv\'at HaMoreh', 'Center', 'School']

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
					<Route className='size-3.5' />
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

export default ZenoLanding

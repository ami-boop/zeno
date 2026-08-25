'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import LangSelector from '@/components/LangSelector'

const NAV_KEYS = ['nav_features', 'nav_how-it-works', 'nav_contact'] as const

const NAV_TARGETS: Record<(typeof NAV_KEYS)[number], string> = {
	nav_features: '#features',
	'nav_how-it-works': '#how-it-works',
	nav_contact: '#contact',
}

export default function LandingHeader() {
	const locale = useLocale()
	const t = useTranslations('Landing')
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40)
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header
			className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
				scrolled ? 'bg-zeno-paper/90 shadow-sm backdrop-blur-md' : 'bg-transparent'
			}`}
		>
			<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8'>
				<span className='font-display text-xl font-extrabold tracking-tight text-zeno-ink'>
					{t('brand')}
				</span>

				<nav className='hidden items-center gap-8 md:flex'>
					{NAV_KEYS.map(key => (
						<a
							key={key}
							href={NAV_TARGETS[key]}
							className='zeno-focus rounded-lg px-2 py-1 text-sm font-semibold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'
						>
							{t(key)}
						</a>
					))}
				</nav>

				<div className='flex items-center gap-3'>
					<LangSelector locale={locale} path='/' />
					<Link href='/login' className='zeno-primary zeno-focus rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm'>
						{t('login')}
					</Link>
				</div>
			</div>
		</header>
	)
}

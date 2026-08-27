'use client'

import { MenuIcon, MessageCircleQuestion, UserRound } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { localeLabel } from '@/utils/setLocaleLabel'
import { setLocaleCookie } from '@/lib/setlocale'
import { locales } from '@/i18n/routing'
import LangSelector from './LangSelector'
import ThemeToggle from './ThemeToggle'

const DESKTOP_LINK_CLASS = 'zeno-focus rounded-lg px-2 py-1 text-sm font-semibold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'
const MOBILE_LINK_CLASS = 'zeno-focus flex items-center gap-4 rounded-xl px-3 py-2 text-zeno-ink-soft transition-colors hover:bg-zeno-sage-soft hover:text-zeno-ink'

export default function Header() {
	const currentLocale = useLocale()
	const t = useTranslations('Header')

	return (
		<header className='flex items-center justify-between border-b border-zeno-line bg-zeno-paper px-4 py-3 sm:px-10'>
			<div className='flex items-center gap-4 text-zeno-ink'>
				<h2 className='text-lg font-bold tracking-tight leading-tight'>
					<Link href='/dashboard'>Zeno</Link>
				</h2>
			</div>

			<div className='hidden md:flex flex-1 justify-end gap-8'>
				<nav className='flex items-center gap-9'>
					<Link className={DESKTOP_LINK_CLASS} href='/schedule'>
						{t('menu.schedule')}
					</Link>
					<Link className={DESKTOP_LINK_CLASS} href='/report'>
						{t('menu.report')}
					</Link>
					<Link className={DESKTOP_LINK_CLASS} href='/track'>
						{t('menu.track')}
					</Link>
				</nav>
				<div className='flex gap-4'>
					<Link
						href='/help'
						aria-label={t('menu.help')}
						className='zeno-focus flex h-10 items-center justify-center rounded-xl bg-zeno-sage-soft px-2.5 text-sm font-bold text-zeno-ink transition hover:opacity-80'
					>
						<MessageCircleQuestion className='size-5' />
					</Link>
					<ThemeToggle />
					<LangSelector locale={currentLocale} path='/dashboard' />
				</div>
				<Link
					href='/profile'
					aria-label={t('menu.profile')}
					className='zeno-focus flex size-10 items-center justify-center rounded-full border border-zeno-line bg-zeno-surface transition hover:bg-zeno-paper-soft'
				>
					<UserRound className='size-5 text-zeno-ink-soft' />
				</Link>
			</div>

			<div className='md:hidden'>
				<Sheet>
					<SheetTrigger asChild>
						<button className='zeno-focus rounded-lg p-1 text-zeno-ink hover:opacity-70' aria-label={t('menu.title')}>
							<MenuIcon />
						</button>
					</SheetTrigger>
					<SheetContent side='left' className='flex flex-col p-0'>
						<div className='border-b border-zeno-line p-4'>
							<SheetTitle>{t('menu.title')}</SheetTitle>
						</div>
						<nav className='flex-1 grid gap-2 content-start p-4 text-lg font-medium'>
							{(['schedule', 'report', 'track', 'profile', 'help'] as const).map(key => (
								<Link key={key} href={`/${key}`} className={MOBILE_LINK_CLASS}>
									{t(`menu.${key}`)}
								</Link>
							))}
						</nav>
						<div className='mt-auto border-t border-zeno-line p-4'>
							<div className='flex justify-center gap-10'>
								<ThemeToggle />
								{locales.map(locale => (
									<Link
										key={locale}
										href='/dashboard'
										locale={locale}
										onClick={() => setLocaleCookie(locale)}
										className={`font-semibold ${
											currentLocale === locale ? 'text-zeno-ink' : 'text-zeno-muted'
										}`}
									>
										{localeLabel(locale)}
									</Link>
								))}
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
}

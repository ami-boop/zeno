'use client'

import { MenuIcon, MessageCircleQuestion } from 'lucide-react'
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
import IconButton from '@/components/ui/IconButton'
import LangSelector from './LangSelector'
import ThemeToggle from './ThemeToggle'
import React from 'react'

export default function Header() {
	const currentLocale = useLocale()
	const t = useTranslations('Header')

	// eslint-disable-next-line react/display-name
	const menuOptions = React.useMemo(() => (dir: 'line' | 'col') => {
		const commonClasses = 'zeno-focus rounded-lg px-2 py-1 text-sm font-semibold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'
		const mobileClasses =
							'zeno-focus flex items-center gap-4 rounded-xl px-3 py-2 text-zeno-ink-soft transition-all hover:bg-zeno-sage-soft hover:text-zeno-ink'

		return dir === 'col' ? (
			<nav className='grid gap-2 text-lg font-medium'>
				<Link href='/schedule' className={mobileClasses}>
					{t('menu.schedule')}
				</Link>
				<Link href='/report' className={mobileClasses}>
					{t('menu.report')}
				</Link>
				<Link href='/profile' className={mobileClasses}>
					{t('menu.profile')}
				</Link>
				<Link href='/help' className={mobileClasses}>
					{t('menu.help')}
				</Link>
			</nav>
		) : (
			<div className='flex items-center gap-9'>
				<Link className={commonClasses} href='/schedule'>
					{t('menu.schedule')}
				</Link>
				<Link className={commonClasses} href='/report'>
					{t('menu.report')}
				</Link>
			</div>
		)
	}, [t])

	return (
		<header className='flex items-center justify-between border-b border-zeno-line bg-zeno-paper px-4 py-3 sm:px-10'>
			<div className='flex items-center gap-4 text-zeno-ink'>
				<h2 className='text-lg font-bold tracking-tight leading-tight'>
					<Link href='/dashboard'>Zeno</Link>
				</h2>
			</div>

			<div className='hidden md:flex flex-1 justify-end gap-8'>
				{menuOptions('line')}
				<div className='flex gap-4'>
					<IconButton>
						<Link href='/help'>
							<MessageCircleQuestion className='cursor-pointer' />
						</Link>
					</IconButton>
					<ThemeToggle />
					<LangSelector locale={currentLocale} path='/dashboard' />
				</div>
				<Link href='/profile'>
					<div
						className='size-10 rounded-full bg-cover bg-center cursor-pointer'
						style={{
							backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQjTr2th15jx5hWkzxgXKqIzNc-tgT_qYTlomBwykO_zKzELdMZ73CluPBToKfs7CifqFmrwx4jNzHW3bcSti2WapwBi6UR_8DLzoZENslWFfygIf1-6AZKgtPuICTzXl-t06zjOxhgn2wksTGcDwaA2Kv9zuTAbmuphOQWDxfb_3kOIvxDvtO9lu-DkggDALo5S6DZ5BeuXut87DDkxecNiLH7EOYf2d6SZu11QrPVLN-_6o1nc_LOk6E_eZqZQ2aAfJc_dfolhOp')`,
						}}
					></div>
				</Link>
			</div>

			<div className='md:hidden'>
				<Sheet>
					<SheetTrigger asChild>
				<button className='zeno-focus rounded-lg p-1 text-zeno-ink hover:opacity-70'>
							<MenuIcon />
						</button>
					</SheetTrigger>
					<SheetContent side='left' className='flex flex-col p-0'>
						<div className='border-b border-zeno-line p-4'>
							<SheetTitle>{t('menu.title')}</SheetTitle>
						</div>
						<div className='flex-1 p-4'>{menuOptions('col')}</div>
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

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
import LangSelector from './LangSelector'
import React from 'react'

export default function Header() {
	const currentLocale = useLocale()
	const t = useTranslations('Header')

	const menuOptions = (dir: 'line' | 'col') => {
		const commonClasses = 'text-sm font-medium text-[#111518]'
		const mobileClasses =
			'flex items-center gap-4 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:text-gray-50 dark:hover:bg-gray-800'

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
	}

	const ToolButton = ({ children }: { children: React.ReactNode }) => (
		<button className='flex h-10 items-center justify-center rounded-full bg-[#f0f3f4] px-2.5 text-sm font-bold text-[#111518]'>
			{children}
		</button>
	)

	return (
		<header className='flex items-center justify-between border-b border-[#f0f3f4] px-10 py-3'>
			<div className='flex items-center gap-4 text-[#111518]'>
				<h2 className='text-lg font-bold tracking-[-0.015em] leading-tight'>
					<Link href='/dashboard'>Zeno</Link>
				</h2>
			</div>

			<div className='hidden md:flex flex-1 justify-end gap-8'>
				{menuOptions('line')}
				<div className='flex gap-4'>
					<ToolButton>
						<Link href='/help'>
							<MessageCircleQuestion className='cursor-pointer' />
						</Link>
					</ToolButton>
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
						<button className='p-1 rounded-lg hover:opacity-70'>
							<MenuIcon />
						</button>
					</SheetTrigger>
					<SheetContent side='left' className='flex flex-col p-0'>
						<div className='p-4 border-b border-[#f0f3f4]'>
							<SheetTitle>{t('menu.title')}</SheetTitle>
						</div>
						<div className='flex-1 p-4'>{menuOptions('col')}</div>
						<div className='mt-auto p-4 border-t border-[#f0f3f4]'>
							<div className='flex justify-center gap-10'>
								{locales.map(locale => (
									<Link
										key={locale}
										href='/dashboard'
										locale={locale}
										onClick={() => setLocaleCookie(locale)}
										className={`font-semibold ${
											currentLocale === locale ? 'text-black' : 'text-gray-400'
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

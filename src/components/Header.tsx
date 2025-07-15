'use client'

import { MenuIcon, MessageCircleQuestion } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { localeLabel } from '@/utils/setLocaleLabel'
import { setLocaleCookie } from '@/lib/setlocale'
import { locales } from '@/i18n/routing'
import LangSelector from './LangSelector'
import React from 'react'

export default React.memo(function Header() {
	const locale = useLocale()
	const t = useTranslations('Header')

	const menuOptions = (dir: 'line' | 'col') => (
		<div
			className={`flex ${dir === 'col' ? 'flex-col' : 'items-center'} gap-9`}
		>
			<Link className='text-sm font-medium text-[#111518]' href='/schedule'>
				{t('menu.schedule')}
			</Link>
			<Link className='text-sm font-medium text-[#111518]' href='/report'>
				{t('menu.report')}
			</Link>
			{dir === 'col' && (
				<>
					<Link className='text-sm font-medium text-[#111518]' href='/profile'>
						{t('menu.profile')}
					</Link>
					<Link className='text-sm font-medium text-[#111518]' href='/help'>
						{t('menu.help')}
					</Link>
					<div className='absolute bottom-0 left-1/2 -translate-x-1/2 flex pb-6'>
						{locales.map((locale, idx) => (
							<Link
								href='/dashboard'
								locale={locale}
								onClick={() => setLocaleCookie(locale)}
								key={locale}
								className={idx !== locales.length - 1 ? 'mr-9' : ''}
							>
								{localeLabel(locale)}
							</Link>
						))}
					</div>
				</>
			)}
		</div>
	)

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
					<LangSelector locale={locale} />
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
					<SheetTrigger>
						<MenuIcon className='p-1 hover:opacity-30 rounded-lg' />
					</SheetTrigger>
					<SheetContent side='left' className='p-0'>
						<div className='flex flex-col h-full'>
							<SheetHeader className='p-4 border-b border-[#f0f3f4]'>
								<SheetTitle>{t('menu.title')}</SheetTitle>
							</SheetHeader>
							<div className='flex-1 flex items-center justify-center'>
								{menuOptions('col')}
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	)
})

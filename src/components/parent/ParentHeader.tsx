'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { waitForServiceWorkerSignOut } from '@/lib/service-worker'
import { navigate } from '@/utils/navigate'
import { useLocale, useTranslations } from 'next-intl'
import ThemeToggle from '@/components/ThemeToggle'
import LangSelector from '@/components/LangSelector'

export default function ParentHeader() {
	const locale = useLocale()
	const t = useTranslations('Parent')
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	return (
		<header className="flex items-center justify-between border-b border-zeno-line bg-zeno-paper px-4 py-3 sm:px-10">
			<div className="flex items-center gap-4 text-zeno-ink">
				<h2 className="text-lg font-bold leading-tight tracking-tight">
					<Link href="/parent/dashboard">Zeno</Link>
				</h2>
				<span className="hidden rounded-full bg-zeno-sage-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-zeno-sage sm:inline-block">
					{t('portalBadge')}
				</span>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />
				<LangSelector locale={locale} path="/parent/dashboard" />
				<button
					disabled={isLoggingOut}
					onClick={async () => {
						setIsLoggingOut(true)
						try {
							await signOut(auth)
							await waitForServiceWorkerSignOut()
							navigate(`/${locale}/login`)
						} finally {
							setIsLoggingOut(false)
						}
					}}
					className={`zeno-focus inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-zeno-line bg-zeno-surface px-3 text-sm font-semibold text-zeno-ink transition hover:bg-zeno-paper-soft ${
						isLoggingOut ? 'cursor-not-allowed opacity-60' : ''
					}`}
					data-testid="parent-logout"
				>
					{isLoggingOut ? (
						<Loader2 className="size-4 animate-spin" data-testid="parent-logout-loader" />
					) : (
						<LogOut className="size-4" aria-hidden="true" />
					)}
					<span className="hidden sm:inline">{isLoggingOut ? t('logoutLoading') : t('logout')}</span>
				</button>
			</div>
		</header>
	)
}

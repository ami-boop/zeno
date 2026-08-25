'use client'

import { useLocale, useTranslations } from 'next-intl'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { waitForServiceWorkerSignOut } from '@/lib/service-worker'
import { navigate } from '@/utils/navigate'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProfileHeaderProps {
	studentName: string
}

export default React.memo(function ProfileHeader({
	studentName,
}: ProfileHeaderProps) {
	const locale = useLocale()
	const t = useTranslations('Profile')
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const initials = studentName
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map(part => part[0])
		.join('')
		.toUpperCase()

	return (
		<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='flex flex-col gap-5 border-b border-zeno-line pb-6 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-center gap-4'>
				<div
					aria-hidden='true'
					data-testid='profile-avatar'
					className='flex size-16 shrink-0 items-center justify-center rounded-2xl bg-zeno-night text-lg font-bold tracking-wide text-zeno-amber shadow-sm'
				>
					{initials || '?'}
				</div>
				<div>
					<p className='text-xs font-semibold uppercase tracking-[0.18em] text-zeno-muted'>
						{t('profile_subtitle')}
					</p>
					<h1 className='mt-1 text-3xl font-bold tracking-tight text-zeno-ink'>
						{studentName}
					</h1>
				</div>
			</div>
			<button
				disabled={isLoggingOut}
				onClick={async () => {
					setIsLoggingOut(true)
					try {
						await signOut(auth)
						await waitForServiceWorkerSignOut()
						navigate(`/${locale}/`)
					} finally {
						setIsLoggingOut(false)
					}
				}}
				className={`inline-flex items-center justify-center gap-2 rounded-xl border border-zeno-line bg-zeno-surface px-4 py-2.5 text-sm font-semibold text-zeno-ink shadow-sm transition hover:border-zeno-line-strong hover:bg-zeno-paper-soft focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2 ${
					isLoggingOut ? 'cursor-not-allowed opacity-60' : ''
				}`}
			>
				{isLoggingOut && <Loader2 className='size-4 animate-spin' data-testid='loader-icon' />}
				{isLoggingOut ? t('logout_loading') : t('logout')}
			</button>
		</motion.div>
	)
})

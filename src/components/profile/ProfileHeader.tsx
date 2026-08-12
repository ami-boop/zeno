'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface ProfileHeaderProps {
	studentName: string
}

export default React.memo(function ProfileHeader({
	studentName,
}: ProfileHeaderProps) {
	const router = useRouter()
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
		<div className='flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-center gap-4'>
				<div
					aria-hidden='true'
					data-testid='profile-avatar'
					className='flex size-16 shrink-0 items-center justify-center rounded-2xl bg-[#15232d] text-lg font-bold tracking-wide text-[#f4b860] shadow-sm'
				>
					{initials || '?'}
				</div>
				<div>
					<p className='text-xs font-semibold uppercase tracking-[0.18em] text-[#74818a]'>
						{t('profile_subtitle')}
					</p>
					<h1 className='mt-1 text-3xl font-bold tracking-tight text-[#15232d]'>
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
						await fetch(`/api/auth/logout`, {
							method: 'POST',
							credentials: 'include',
						})
						router.push(`/${locale}/`)
					} finally {
						setIsLoggingOut(false)
					}
				}}
				className={`inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#15232d] shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2 ${
					isLoggingOut ? 'cursor-not-allowed opacity-60' : ''
				}`}
			>
				{isLoggingOut && <Loader2 className='size-4 animate-spin' data-testid='loader-icon' />}
				{isLoggingOut ? t('logout_loading') : t('logout')}
			</button>
		</div>
	)
})

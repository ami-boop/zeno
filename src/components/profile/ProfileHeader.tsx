'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'


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

	return (
		<>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-4'>
					<Image
						src='https://placehold.co/50x50'
						alt={studentName}
						width={50}
						height={50}
						className='w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm'
					/>
					<div>
						<div className='font-semibold text-lg text-gray-900'>
							{studentName}
						</div>
						<div className='text-gray-500 text-sm'>{t('profile_subtitle')}</div>
					</div>
				</div>
				<div>
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
						className={`inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200 ml-2 ${
							isLoggingOut ? 'opacity-60 cursor-not-allowed' : ''
						}`}
					>
						{isLoggingOut ? (
							<>
								<Loader2
									className='animate-spin w-4 h-4 mr-2'
									data-testid='loader-icon'
								/>
								{t('logout_loading')}
							</>
						) : (
							<>{t('logout')}</>
						)}
					</button>
				</div>
			</div>
		</>
	)
})

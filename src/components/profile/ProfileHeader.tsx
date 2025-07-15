'use client'

import { Edit3 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface ProfileHeaderProps {
	user: {
		name: string
		class: string
		studentId: string
		schoolYear: string
		avatar: string
	}
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
	const t = useTranslations('Profile')
	const router = useRouter()
	const locale = useLocale()

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-8'>
			<div className='px-6 py-8'>
				<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
					<div className='flex items-center gap-6'>
						<div className='relative'>
							<div
								className='w-24 h-24 bg-center bg-cover rounded-full border-4 border-white shadow-lg'
								style={{ backgroundImage: `url('${user.avatar}')` }}
							/>
							<div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full'></div>
						</div>
						<div>
							<h1 className='text-2xl font-bold text-gray-900 mb-1'>
								{user.name}
							</h1>
							<p className='text-gray-600 mb-2'>{user.class}</p>
							<div className='flex flex-wrap gap-4 text-sm text-gray-500'>
								<span>ID: {user.studentId}</span>
								<span>•</span>
								<span>{user.schoolYear}</span>
							</div>
						</div>
					</div>
					<button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200'>
						<Edit3 className='w-4 h-4 mr-2' />
						{t('Edit Profile')}
					</button>
					<button
						onClick={async () => {
							// 1. Разлогинить пользователя в Firebase
							if (typeof window !== 'undefined') {
								const { signOut } = await import('firebase/auth')
								const { auth } = await import('@/lib/firebase')
								await signOut(auth)
							}
							// 2. Удалить cookie на сервере
							await fetch('/api/logout', {
								method: 'POST',
								credentials: 'include',
							})
							// 3. Редирект через useRouter
							router.push(`/${locale}/login`)
						}}
						className='inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors duration-200 ml-2'
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	)
}

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/app/actions/auth'
import { validateEmail, validatePassword } from '@/lib/validation'
import LoginHeader from '@/components/login/LoginHeader'
import SystemStatus from '@/components/login/SystemStatus'
import LoginForm from '@/components/login/LoginForm'
import SecurityNotice from '@/components/login/SecurityNotice'
import { Shield } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import inputValidation from '@/app/actions/inputValidation'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
	const t = useTranslations('Login')
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (email: string, password: string) => {
		setError(null)

		if (!validateEmail(email)) {
			setError(t('errors.invalidEmail'))
			return
		}

		if (!validatePassword(password)) {
			setError(t('errors.invalidPassword'))
			return
		}

		setIsSubmitting(true)

		try {
			const { sanitizedEmail, sanitizedPassword } = await inputValidation(
				email,
				password
			)

			const userCredential = await signInWithEmailAndPassword(
				auth,
				sanitizedEmail!,
				sanitizedPassword!
			)

			const result = await loginAction(
				await userCredential.user.getIdToken(true)
			)

			// Если есть ошибка, loginAction вернет её (не сделает redirect)
			if (result?.error) {
				setError(t(`errors.${result.error}`) || result.error)
				auth.signOut()
			}
			// Если success, то redirect уже произошел на сервере
		} catch (_e) {
			setError(t('errors.genericError'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
						<LoginHeader />
						<SystemStatus />

						{error && (
							<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
								<p className='text-sm text-red-800'>{error}</p>
							</div>
						)}
						<LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
						<div className='mt-6'>
							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<div className='w-full border-t border-gray-300' />
								</div>
								<div className='relative flex justify-center text-sm'>
									<span className='px-2 bg-white text-gray-500'>
										{t('orContinueWith')}
									</span>
								</div>
							</div>
						</div>

						<button
							type='button'
							className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200'
						>
							<Shield className='w-4 h-4 mr-2 text-blue-600' />
							{t('adminAccess')}
						</button>
						<SecurityNotice />
					</div>
				</div>
			</div>
		</div>
	)
}

'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { validateEmail, validatePassword } from '@/lib/validation'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import LoginHeader from '@/components/login/LoginHeader'
import SystemStatus from '@/components/login/SystemStatus'
import LoginForm from '@/components/login/LoginForm'
import SecurityNotice from '@/components/login/SecurityNotice'
import { Shield } from 'lucide-react'

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
			setError(t('errors.shortPassword'))
			return
		}
		setIsSubmitting(true)
		try {
			const validationRes = await fetch(
				'https://login-ag7er5qhga-ew.a.run.app',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ email, password }),
				}
			)
			const validationResult = await validationRes.json()
			if (!validationRes.ok) {
				switch (validationResult.error) {
					case 'Email is required':
					case 'Invalid email format':
						setError(t('errors.invalidEmail'))
						break
					case 'Password is required':
					case 'Password must be at least 6 characters':
						setError(t('errors.shortPassword'))
						break
					default:
						setError(t('errors.genericError'))
				}
				return
			}
			const { email: sanitizedEmail, password: sanitizedPassword } =
				validationResult.data

			const userCredential = await signInWithEmailAndPassword(
				auth,
				sanitizedEmail,
				sanitizedPassword
			)
			const user = userCredential.user
			const idToken = await user.getIdToken(true)

			// СНАЧАЛА userCheck
			const userCheckRes = await fetch(
				'https://verifyuserrole-ag7er5qhga-ew.a.run.app',
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ idToken }),
				}
			)
			const userCheckResult = await userCheckRes.json()
			if (!userCheckRes.ok) {
				if (userCheckResult.accessDenied) {
					await auth.signOut()
					setError(t('errors.accessDenied'))
				} else {
					setError(t('errors.genericError'))
				}
				return
			}

			await fetch('/api/setToken', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idToken }),
				credentials: 'include',
			})

			router.push('/dashboard')
		} catch (error: any) {
			switch (error.code) {
				case 'auth/user-not-found':
					setError(t('errors.userNotFound'))
					break
				case 'auth/wrong-password':
					setError(t('errors.wrongPassword'))
					break
				case 'auth/invalid-credential':
					setError(t('errors.invalidCredential'))
					break
				case 'auth/invalid-email':
					setError(t('errors.invalidEmail'))
					break
				case 'auth/too-many-requests':
					setError(t('errors.tooManyRequests'))
					break
				case 'auth/user-disabled':
					setError(t('errors.userDisabled'))
					break
				default:
					setError(t('errors.genericError'))
			}
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

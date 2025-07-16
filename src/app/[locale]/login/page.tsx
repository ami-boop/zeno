'use client'

import React, { useState, Suspense } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { validateEmail, validatePassword } from '@/lib/validation'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import LoginHeader from '@/components/login/LoginHeader'
import SystemStatus from '@/components/login/SystemStatus'
import LoginForm from '@/components/login/LoginForm'
import Divider from '@/components/login/Divider'
import AdminAccessButton from '@/components/login/AdminAccessButton'
import SecurityNotice from '@/components/login/SecurityNotice'

// Динамический импорт Loader2
const Loader2 = React.lazy(() =>
	import('lucide-react').then(mod => ({ default: mod.Loader2 }))
)

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
			// Валидация на backend
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

			// ЕСЛИ роль разрешена — только теперь setToken
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
						<Divider />
						<AdminAccessButton />
						<SecurityNotice />
					</div>
				</div>
			</div>
		</div>
	)
}

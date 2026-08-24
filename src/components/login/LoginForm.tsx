'use client'

import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface LoginFormProps {
	onSubmit: (email: string, password: string) => Promise<void>
	isSubmitting: boolean
}

export default function LoginForm({ onSubmit, isSubmitting }: LoginFormProps) {
	const t = useTranslations('Login')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await onSubmit(email, password)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6' noValidate>
			<div>
				<label htmlFor='login-email' className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
					{t('loginLabel')}
				</label>
				<input
					id='login-email'
					name='email'
					type='email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder={t('loginPlaceholder')}
					autoComplete='email'
					spellCheck={false}
					className='zeno-focus w-full rounded-xl border border-zeno-line px-3 py-3 text-sm text-zeno-ink focus:border-zeno-amber'
				/>
			</div>

			<div>
				<label htmlFor='login-password' className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
					{t('passwordLabel')}
				</label>
				<div className='relative'>
					<input
						id='login-password'
						name='password'
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder={t('passwordPlaceholder')}
						autoComplete='current-password'
						className='zeno-focus w-full rounded-xl border border-zeno-line pe-10 ps-3 py-3 text-sm text-zeno-ink focus:border-zeno-amber'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						aria-label={t(showPassword ? 'hidePassword' : 'showPassword')}
						aria-pressed={showPassword}
						className='absolute inset-y-0 end-0 flex items-center px-3 text-zeno-muted hover:text-zeno-ink zeno-focus rounded-lg'
						data-testid='password-button'
					>
						{showPassword ? (
							<EyeOff className='size-4' data-testid='eye-off-icon' aria-hidden='true' />
						) : (
							<Eye className='size-4' data-testid='eye-icon' aria-hidden='true' />
						)}
					</button>
				</div>
			</div>

			<button
				type='submit'
				disabled={isSubmitting}
				className={`zeno-focus w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
					isSubmitting ? 'cursor-not-allowed bg-zeno-line text-zeno-muted' : 'zeno-primary'
				}`}
				data-testid='submit-button'
			>
				{isSubmitting ? (
					<span className='flex items-center justify-center'>
						<Loader2
							className='animate-spin -ms-1 me-3 size-4 text-white'
							data-testid='loader-icon'
							aria-hidden='true'
						/>
						{t('signingIn')}
					</span>
				) : (
					t('signInButton')
				)}
			</button>
		</form>
	)
}

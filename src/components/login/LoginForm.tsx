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
		<div className='space-y-6'>
			{/* Login Field */}
			<div>
				<label className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
					{t('loginLabel')}
				</label>
				<input
					type='text'
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder={t('loginPlaceholder')}
					className='zeno-focus w-full rounded-xl border border-zeno-line px-3 py-3 text-sm text-zeno-ink focus:border-zeno-amber'
				/>
			</div>

			{/* Password Field */}
			<div>
				<label className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
					{t('passwordLabel')}
				</label>
				<div className='relative'>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder={t('passwordPlaceholder')}
						className='zeno-focus w-full rounded-xl border border-zeno-line px-3 py-3 pr-10 text-sm text-zeno-ink focus:border-zeno-amber'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
							className='absolute inset-y-0 right-0 flex items-center pr-3 text-zeno-muted hover:text-zeno-ink'
						data-testid='password-button'
					>
						{showPassword ? (
							<EyeOff className='w-4 h-4' data-testid='eye-off-icon' />
						) : (
							<Eye className='w-4 h-4' data-testid='eye-icon' />
						)}
					</button>
				</div>
			</div>

			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				disabled={isSubmitting || !email || !password}
					className={`zeno-focus w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
					isSubmitting || !email || !password
						? 'cursor-not-allowed bg-zeno-line text-zeno-muted'
						: 'zeno-primary'
				}`}
				data-testid='submit-button'
			>
				{isSubmitting ? (
					<div className='flex items-center justify-center'>
						<Loader2
							className='animate-spin -ml-1 mr-3 h-4 w-4 text-white'
							data-testid='loader-icon'
						/>
						{t('signingIn')}
					</div>
				) : (
					t('signInButton')
				)}
			</button>
		</div>
	)
}

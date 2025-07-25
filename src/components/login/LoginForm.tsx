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
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					{t('loginLabel')}
				</label>
				<input
					type='text'
					value={email}
					onChange={e => setEmail(e.target.value)}
					placeholder={t('loginPlaceholder')}
					className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
				/>
			</div>

			{/* Password Field */}
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-2'>
					{t('passwordLabel')}
				</label>
				<div className='relative'>
					<input
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={e => setPassword(e.target.value)}
						placeholder={t('passwordPlaceholder')}
						className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 pr-10'
					/>
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
					>
						{showPassword ? (
							<EyeOff className='w-4 h-4' />
						) : (
							<Eye className='w-4 h-4' />
						)}
					</button>
				</div>
			</div>

			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				disabled={isSubmitting || !email || !password}
				className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
					isSubmitting || !email || !password
						? 'bg-gray-400 text-white cursor-not-allowed'
						: 'bg-blue-600 text-white hover:bg-blue-700'
				}`}
			>
				{isSubmitting ? (
					<div className='flex items-center justify-center'>
						<Loader2 className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' />
						{t('signingIn')}
					</div>
				) : (
					t('signInButton')
				)}
			</button>
		</div>
	)
}

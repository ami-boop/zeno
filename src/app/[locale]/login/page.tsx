'use client'

import { useState } from 'react'
import LoginHeader from '@/components/login/LoginHeader'
import SystemStatus from '@/components/login/SystemStatus'
import LoginForm from '@/components/login/LoginForm'
import Divider from '@/components/login/Divider'
import AdminAccessButton from '@/components/login/AdminAccessButton'
import SecurityNotice from '@/components/login/SecurityNotice'

export default function LoginPage() {
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (email: string, password: string) => {
		setIsSubmitting(true)

		// Имитация отправки
		await new Promise(resolve => setTimeout(resolve, 1500))

		setIsSubmitting(false)
		// Здесь можно добавить логику перенаправления
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
						<LoginHeader />
						<SystemStatus />
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

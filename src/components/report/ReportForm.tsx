'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ReportSuccess from './ReportSuccess'
import { Bus, Route } from 'lucide-react'

type Props = {
	times: string[]
	submited: boolean
}

export default function ReportForm({ times, submited }: Props) {
	const t = useTranslations('Report')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(submited || false)
	const [method, setMethod] = useState<'bus' | 'other' | null>(null)
	const [selectedTime, setSelectedTime] = useState<string | null>(null)

	const handleSubmit = async () => {
		setIsSubmitting(true)

		await fetch('/api/setStudentReturnStatus', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				byBus: method === 'bus',
				selectedTime: method === 'bus' ? selectedTime : 'none',
				submited: true,
			}),
		})

		setIsSubmitting(false)
		setIsSubmitted(true)
	}

	const handleReset = async () => {
		await fetch('/api/setStudentReturnStatus', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify({
				byBus: false,
				selectedTime: 'none',
				submited: false,
			}),
		})
		setIsSubmitted(false)
		setMethod(null)
		setSelectedTime(null)
	}

	// Кнопка отправки активна только если выбран способ и (если автобус) время
	const canSubmit = method === 'bus' ? !!selectedTime : method === 'other'

	if (isSubmitted) {
		return <ReportSuccess onReset={handleReset} />
	}

	return (
		<div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg mx-auto'>
			{/* Header */}
			<div className='text-center mb-10'>
				<h1 className='text-3xl font-extrabold text-gray-900 mb-3 tracking-tight'>
					{t('title')}
				</h1>
			</div>
			{/* Method selection */}
			<div className='flex flex-col sm:flex-row gap-6 mb-10 justify-center'>
				<button
					type='button'
					onClick={() => {
						setMethod('bus')
						setSelectedTime(null)
					}}
					className={`flex-1 flex flex-col items-center gap-2 py-5 px-6 rounded-xl border-2 text-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50
            ${
							method === 'bus'
								? 'bg-blue-100 border-blue-500 text-blue-900 scale-105 shadow-md'
								: 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50'
						}`}
				>
					<Bus
						className={`w-8 h-8 mb-1 ${
							method === 'bus' ? 'text-blue-600' : 'text-gray-400'
						}`}
					/>
					{t('busOption')}
				</button>
				<button
					type='button'
					onClick={() => setMethod('other')}
					className={`flex-1 flex flex-col items-center gap-2 py-5 px-6 rounded-xl border-2 text-lg font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50
            ${
							method === 'other'
								? 'bg-blue-100 border-blue-500 text-blue-900 scale-105 shadow-md'
								: 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50'
						}`}
				>
					<Route
						className={`w-8 h-8 mb-1 ${
							method === 'other' ? 'text-blue-600' : 'text-gray-400'
						}`}
					/>
					{t('otherOption')}
				</button>
			</div>
			{/* Time selection if 'bus' */}
			{method === 'bus' && (
				<div className='mb-10'>
					<label className='block text-base font-medium text-gray-700 mb-4 text-center'>
						{t('selectTime')}
					</label>
					<div className='grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center'>
						{times.map(time => (
							<button
								key={time}
								type='button'
								onClick={() => setSelectedTime(time)}
								className={`w-28 py-3 rounded-lg border-2 text-lg font-bold transition-all duration-200 shadow-sm
                  ${
										selectedTime === time
											? 'bg-blue-500 border-blue-700 text-white scale-105 shadow-md'
											: 'bg-white border-gray-300 text-gray-700 hover:bg-blue-100'
									}`}
							>
								{time}
							</button>
						))}
					</div>
				</div>
			)}
			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				disabled={isSubmitting || !canSubmit}
				className={`w-full py-4 px-4 rounded-xl text-lg font-bold transition-colors duration-200 shadow-md mt-2
          ${
						isSubmitting || !canSubmit
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
			>
				{isSubmitting ? '...' : t('submitButton')}
			</button>
		</div>
	)
}

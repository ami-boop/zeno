'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ReportStatus from './ReportStatus'
import ReportNotice from './ReportNotice'
import ReportSuccess from './ReportSuccess'
import { Loader2 } from 'lucide-react'
import Header from '../Header'

interface ReportFormProps {
	studentId: string
}

export default function ReportForm({ studentId }: ReportFormProps) {
	const t = useTranslations('Report')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [selectedReason, setSelectedReason] = useState('')
	const [customReason, setCustomReason] = useState('')

	const currentTime = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const busArrivalTime = new Date(Date.now() + 18 * 60000).toLocaleTimeString(
		'en-US',
		{
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
		}
	)

	const quickReasons = [
		{ key: 'teacher_absent', label: t('quickReasons.teacher_absent') },
		{ key: 'event_cancelled', label: t('quickReasons.event_cancelled') },
		{ key: 'early_dismissal', label: t('quickReasons.early_dismissal') },
		{ key: 'other', label: t('quickReasons.other') },
	]

	const handleSubmit = async () => {
		setIsSubmitting(true)
		await new Promise(resolve => setTimeout(resolve, 500))
		setIsSubmitting(false)
		setIsSubmitted(true)
	}

	const handleReset = () => {
		setIsSubmitted(false)
		setSelectedReason('')
		setCustomReason('')
	}

	if (isSubmitted) {
		return <ReportSuccess onReset={handleReset} />
	}

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
			{/* Header */}
			<div className='text-center mb-8'>
				<h1 className='text-2xl font-bold text-gray-900 mb-2'>{t('title')}</h1>
				<p className='text-gray-600 text-sm'>{t('description')}</p>
			</div>
			{/* Status */}
			<ReportStatus
				currentTime={currentTime}
				busArrivalTime={busArrivalTime}
				reportingAs={t('reportingAs')}
				studentId={studentId}
			/>
			{/* Form */}
			<div className='space-y-6'>
				{/* Quick Reason Selection */}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-3'>
						{t('reasonLabel')}
					</label>
					<div className='grid grid-cols-2 gap-2'>
						{quickReasons.map(reason => (
							<button
								key={reason.key}
								type='button'
								onClick={() => setSelectedReason(reason.key)}
								className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 ${
									selectedReason === reason.key
										? 'bg-blue-50 text-blue-700 border-blue-200'
										: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
								}`}
							>
								{reason.label}
							</button>
						))}
					</div>
				</div>
				{/* Custom Reason Input */}
				{selectedReason === 'other' && (
					<div>
						<textarea
							placeholder={t('reasonPlaceholder')}
							rows={3}
							value={customReason}
							onChange={e => setCustomReason(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
						/>
					</div>
				)}
				{/* Submit Button */}
				<button
					onClick={handleSubmit}
					disabled={isSubmitting}
					className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
						isSubmitting
							? 'bg-gray-400 text-white cursor-not-allowed'
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
				>
					{isSubmitting ? (
						<div className='flex items-center justify-center'>
							<Loader2 className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' />
							Submitting...
						</div>
					) : (
						t('reportButton')
					)}
				</button>
			</div>
			{/* Notice */}
			<ReportNotice />
		</div>
	)
}

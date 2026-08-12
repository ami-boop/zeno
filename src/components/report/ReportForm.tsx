'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bus, CarFront, Check, UsersRound } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitReturnStatus } from '@/app/actions/return-status'
import ReportSuccess from './ReportSuccess'

type Method = 'bus' | 'other' | null

type Props = {
	times: string[]
	defaultTime: string | null
	submitted: boolean
	submittedTime: string | null
}

const getIsraelTime = () =>
	new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Asia/Jerusalem',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(new Date())

export default function ReportForm({
	times,
	defaultTime,
	submitted,
	submittedTime,
}: Props) {
	const t = useTranslations('Report')
	const recommendedTime = defaultTime && times.includes(defaultTime) ? defaultTime : null
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(submitted)
	const [savedTime, setSavedTime] = useState(submittedTime)
	const [method, setMethod] = useState<Method>(null)
	const [selectedTime, setSelectedTime] = useState<string | null>(null)
	const [error, setError] = useState<'deadline' | 'generic' | null>(null)
	const [currentTime, setCurrentTime] = useState<string | null>(null)

	useEffect(() => {
		const updateCurrentTime = () => setCurrentTime(getIsraelTime())
		updateCurrentTime()
		const interval = window.setInterval(updateCurrentTime, 60_000)
		return () => window.clearInterval(interval)
	}, [])

	const isPastTime = (time: string) => Boolean(currentTime && time < currentTime)
	const availableTimes = times.filter(time => !isPastTime(time))

	const selectMethod = (nextMethod: Method) => {
		setMethod(nextMethod)
		setError(null)
		setSelectedTime(nextMethod === 'bus' ? recommendedTime : null)
	}

	useEffect(() => {
		if (selectedTime && currentTime && selectedTime < currentTime) setSelectedTime(null)
	}, [currentTime, selectedTime])

	const handleSubmit = async () => {
		if (isSubmitting || !method) return

		setIsSubmitting(true)
		setError(null)

		const result = await submitReturnStatus({
			byBus: method === 'bus',
			selectedTime: method === 'bus' ? selectedTime ?? '' : '',
		})

		if (result.success) {
			setSavedTime(method === 'bus' ? selectedTime : null)
			setIsSubmitted(true)
		} else {
			setError(result.status === 403 ? 'deadline' : 'generic')
		}

		setIsSubmitting(false)
	}

	const handleReset = async () => {
		const result = await submitReturnStatus({ byBus: false, selectedTime: '' })
		if (!result.success) return false

		setIsSubmitted(false)
		setSavedTime(null)
		setMethod(null)
		setSelectedTime(null)
		setError(null)
		return true
	}

	if (isSubmitted) {
		return <ReportSuccess submittedTime={savedTime} onReset={handleReset} />
	}

	const canSubmit = method === 'other' || (method === 'bus' && !!selectedTime)

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} className='mx-auto max-w-2xl'>
			<div className='mb-8 max-w-xl'>
				<p className='text-xs font-semibold uppercase tracking-[0.2em] text-[#74818a]'>
					{t('eyebrow')}
				</p>
				<h1 className='mt-3 text-3xl font-bold tracking-tight text-[#15232d] sm:text-4xl'>
					{t('title')}
				</h1>
				<p className='mt-3 text-base leading-7 text-gray-500'>{t('intro')}</p>
			</div>

			<div className='rounded-3xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
				<div className='grid gap-3 sm:grid-cols-3'>
					<motion.button
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
						type='button'
						aria-pressed={method === 'bus'}
						onClick={() => selectMethod('bus')}
						className={`group rounded-2xl border p-4 text-start transition focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2 ${method === 'bus' ? 'border-[#15232d] bg-[#15232d] text-white' : 'border-gray-200 bg-white text-[#15232d] hover:border-[#aab9b0] hover:bg-[#f8faf9]'}`}
					>
						<span className={`flex size-10 items-center justify-center rounded-xl ${method === 'bus' ? 'bg-[#f4b860] text-[#15232d]' : 'bg-[#eef3f0] text-[#486b58]'}`}>
							<Bus className='size-5' />
						</span>
						<span className='mt-4 block font-semibold'>{t('busOption')}</span>
						<span className={`mt-1 block text-xs ${method === 'bus' ? 'text-[#a9bbc4]' : 'text-gray-500'}`}>{t('busDescription')}</span>
					</motion.button>

					<motion.button
						whileHover={{ y: -2 }}
						whileTap={{ scale: 0.98 }}
						type='button'
						aria-pressed={method === 'other'}
						onClick={() => selectMethod('other')}
						className={`group rounded-2xl border p-4 text-start transition focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2 ${method === 'other' ? 'border-[#15232d] bg-[#15232d] text-white' : 'border-gray-200 bg-white text-[#15232d] hover:border-[#aab9b0] hover:bg-[#f8faf9]'}`}
					>
						<span className={`flex size-10 items-center justify-center rounded-xl ${method === 'other' ? 'bg-[#f4b860] text-[#15232d]' : 'bg-[#eef3f0] text-[#486b58]'}`}>
							<CarFront className='size-5' />
						</span>
						<span className='mt-4 block font-semibold'>{t('otherOption')}</span>
						<span className={`mt-1 block text-xs ${method === 'other' ? 'text-[#a9bbc4]' : 'text-gray-500'}`}>{t('otherDescription')}</span>
					</motion.button>

					<motion.button
						type='button'
						disabled
						className='cursor-not-allowed rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 text-start text-gray-400'
					>
						<span className='flex size-10 items-center justify-center rounded-xl bg-gray-200 text-gray-400'>
							<UsersRound className='size-5' />
						</span>
						<span className='mt-4 block font-semibold'>{t('friendOption')}</span>
						<span className='mt-1 block text-xs text-gray-400'>{t('friendUnavailable')}</span>
					</motion.button>
				</div>

				<AnimatePresence initial={false}>
				{method === 'bus' && (
					<motion.div key='time-picker' initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className='mt-8 overflow-hidden border-t border-gray-100 pt-6'>
						<div className='flex items-end justify-between gap-4'>
							<div>
								<p className='text-sm font-semibold text-[#15232d]'>{t('selectTime')}</p>
								<div className='mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500'>
									{recommendedTime && <span>{t('defaultTimeHint')}: {recommendedTime}</span>}
									{currentTime && <span>{t('currentTime')}: {currentTime}</span>}
								</div>
							</div>
							<Check className='size-5 text-[#486b58]' />
						</div>
						{times.length > 0 ? (
							<div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
								{times.map(time => (
									<button
										key={time}
										type='button'
										disabled={isPastTime(time)}
										aria-label={isPastTime(time) ? `${time} ${t('pastTime')}` : time}
										aria-pressed={selectedTime === time}
										onClick={() => setSelectedTime(time)}
										className={`rounded-xl border px-3 py-3 text-center text-lg font-bold tabular-nums transition focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2 ${isPastTime(time) ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 blur-[2px] opacity-50 grayscale' : selectedTime === time ? 'border-[#f4b860] bg-[#f4b860] text-[#15232d]' : 'border-gray-200 bg-white text-[#15232d] hover:border-[#aab9b0]'}`}
									>
										{time}
									</button>
								))}
							</div>
						) : (
							<p className='mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-500'>{t('noTimes')}</p>
						)}
						{currentTime && times.length > 0 && availableTimes.length === 0 && (
							<p className='mt-3 text-xs text-gray-500'>{t('noFutureTimes')}</p>
						)}
					</motion.div>
				)}
				</AnimatePresence>

				{error && (
					<div role='alert' className='mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700'>
						{error === 'deadline' ? t('deadlineError') : t('submitError')}
					</div>
				)}

				<motion.button
					whileTap={{ scale: canSubmit ? 0.985 : 1 }}
					type='button'
					onClick={handleSubmit}
					disabled={isSubmitting || !canSubmit}
					className='mt-8 w-full rounded-2xl bg-[#15232d] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#203744] focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400'
				>
					{isSubmitting ? t('submitting') : t('submitButton')}
				</motion.button>
			</div>
		</motion.div>
	)
}

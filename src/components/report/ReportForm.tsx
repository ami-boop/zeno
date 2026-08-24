'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Bus, CarFront, Check, UsersRound } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { submitReturnStatus } from '@/app/actions/return-status'
import { getIsraelTime } from '@/lib/time'
import type { FriendStudent, FriendTripStatus } from '@/lib/api-contracts'
import PageHeader from '@/components/ui/PageHeader'
import OptionCard from '@/components/ui/OptionCard'
import ReportSuccess from './ReportSuccess'
import FriendSearch from './FriendSearch'
import FriendDetails from './FriendDetails'
import { useFriendStudents } from './useFriendStudents'

type Method = 'bus' | 'other' | 'friend' | null

type Props = {
	times: string[]
	defaultTime: string | null
	submitted: boolean
	submittedTime: string | null
	friendStatus?: FriendTripStatus | null
}

export default function ReportForm({ times, defaultTime, submitted, submittedTime, friendStatus = null }: Props) {
	const t = useTranslations('Report')
	const recommendedTime = defaultTime
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(submitted)
	const [savedTime, setSavedTime] = useState(submittedTime)
	const [method, setMethod] = useState<Method>(null)
	const [selectedTime, setSelectedTime] = useState<string | null>(null)
	const [selectedFriend, setSelectedFriend] = useState<FriendStudent | null>(null)
	const [sleepover, setSleepover] = useState<boolean | null>(null)
	const [friendNote, setFriendNote] = useState('')
	const [error, setError] = useState<'deadline' | 'generic' | null>(null)
	const [currentTime, setCurrentTime] = useState<string | null>(null)
	const [friendStatusOverride, setFriendStatusOverride] = useState<FriendTripStatus | null>(null)

	const friends = useFriendStudents(method === 'friend')

	useEffect(() => {
		const updateCurrentTime = () => setCurrentTime(getIsraelTime())
		updateCurrentTime()
		const interval = window.setInterval(updateCurrentTime, 60_000)
		return () => window.clearInterval(interval)
	}, [])

	const isPastTime = (time: string) => Boolean(currentTime && time < currentTime)
	const availableTimes = times.filter((time) => !isPastTime(time))

	const selectMethod = (nextMethod: Method) => {
		setMethod(nextMethod)
		setError(null)
		setSelectedTime(nextMethod === 'bus' || nextMethod === 'friend' ? recommendedTime : null)
	}

	useEffect(() => {
		if (selectedTime && currentTime && selectedTime < currentTime) setSelectedTime(null)
	}, [currentTime, selectedTime])

	const handleSubmit = async () => {
		if (isSubmitting || !method) return

		setIsSubmitting(true)
		setError(null)

		const result = await submitReturnStatus({
			byBus: method === 'bus' || method === 'friend',
			selectedTime: method === 'bus' || method === 'friend' ? (selectedTime ?? '') : '',
			...(method === 'friend' && selectedFriend
				? {
						friendUid: selectedFriend.uid,
						sleepover: Boolean(sleepover),
						note: friendNote.trim() || undefined,
					}
				: {}),
		})

		if (result.success) {
			setSavedTime(method === 'bus' || method === 'friend' ? selectedTime : null)
			if (method === 'friend') setFriendStatusOverride('pending')
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
		setSelectedFriend(null)
		setSleepover(null)
		setFriendNote('')
		setError(null)
		setFriendStatusOverride(null)
		friends.reset()
		return true
	}

	if (isSubmitted) {
		return (
			<ReportSuccess
				submittedTime={savedTime}
				friendStatus={friendStatusOverride ?? friendStatus}
				onReset={handleReset}
			/>
		)
	}

	const canSubmit =
		method === 'other' ||
		(method === 'bus' && !!selectedTime) ||
		(method === 'friend' && !!selectedTime && !!selectedFriend && sleepover !== null)

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.35 }}
			className="mx-auto max-w-2xl"
		>
			<PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('intro')} className="mb-8" />

			<div className="rounded-zeno border border-zeno-line bg-zeno-surface p-4 shadow-zeno-card sm:p-6">
				<div className="grid gap-3 sm:grid-cols-3">
					<OptionCard
						active={method === 'bus'}
						onClick={() => selectMethod('bus')}
						icon={<Bus className="size-5" />}
						label={t('busOption')}
						description={t('busDescription')}
					/>

					<OptionCard
						active={method === 'other'}
						onClick={() => selectMethod('other')}
						icon={<CarFront className="size-5" />}
						label={t('otherOption')}
						description={t('otherDescription')}
					/>

					<OptionCard
						active={method === 'friend'}
						onClick={() => selectMethod('friend')}
						icon={<UsersRound className="size-5" />}
						label={t('friendOption')}
						description={t('friendDescription')}
					/>
				</div>

				<AnimatePresence initial={false}>
					{(method === 'bus' || method === 'friend') && (
						<motion.div
							key="time-picker"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.25 }}
							className="mt-8 overflow-hidden border-t border-zeno-line pt-6"
						>
							<div className="flex items-end justify-between gap-4">
								<div>
									<p className="text-sm font-semibold text-zeno-ink">{t('selectTime')}</p>
									<div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zeno-muted">
										{recommendedTime && (
											<span>
												{t('defaultTimeHint')}: {recommendedTime}
											</span>
										)}
										{currentTime && (
											<span>
												{t('currentTime')}: {currentTime}
											</span>
										)}
									</div>
								</div>
								<Check className="size-5 text-zeno-sage" />
							</div>
							{times.length > 0 ? (
								<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
									{times.map((time) => (
										<button
											key={time}
											type="button"
											disabled={isPastTime(time)}
											aria-label={isPastTime(time) ? `${time} ${t('pastTime')}` : time}
											aria-pressed={selectedTime === time}
											onClick={() => setSelectedTime(time)}
											className={`relative rounded-xl border px-3 py-3 text-center text-lg font-bold tabular-nums transition focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2 ${isPastTime(time) ? 'cursor-not-allowed border-zeno-line bg-zeno-paper text-zeno-muted blur-[2px] opacity-50 grayscale' : selectedTime === time ? 'border-transparent text-zeno-amber-fg' : 'border-zeno-line bg-zeno-surface text-zeno-ink hover:border-zeno-line-strong'}`}
										>
											{selectedTime === time && (
												<motion.span
													layoutId="time-selected"
													transition={{ type: 'spring', stiffness: 420, damping: 34 }}
													className="absolute inset-0 rounded-xl bg-zeno-amber"
												/>
											)}
											<span className="relative z-10">{time}</span>
										</button>
									))}
								</div>
							) : (
								<p className="mt-4 rounded-xl bg-zeno-paper p-4 text-sm text-zeno-muted">{t('noTimes')}</p>
							)}
							{currentTime && times.length > 0 && availableTimes.length === 0 && (
								<p className="mt-3 text-xs text-zeno-muted">{t('noFutureTimes')}</p>
							)}
						</motion.div>
					)}
				</AnimatePresence>

				{method === 'friend' && (
					<div className="mt-6 border-t border-zeno-line pt-6">
						<AnimatePresence initial={false}>
							<motion.div
								key="friend-picker"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.25 }}
								className="overflow-hidden"
							>
								{!selectedFriend ? (
									<FriendSearch picker={friends} onSelect={setSelectedFriend} />
								) : (
									<FriendDetails
										friend={selectedFriend}
										onChangeFriend={() => setSelectedFriend(null)}
										sleepover={sleepover}
										onSleepoverChange={setSleepover}
										note={friendNote}
										onNoteChange={setFriendNote}
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				)}

				{error && (
					<div
						role="alert"
						className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
					>
						{error === 'deadline' ? t('deadlineError') : t('submitError')}
					</div>
				)}

				<motion.button
					whileTap={{ scale: canSubmit ? 0.985 : 1 }}
					type="button"
					onClick={handleSubmit}
					disabled={isSubmitting || !canSubmit}
					className="mt-8 w-full rounded-2xl bg-zeno-night px-5 py-4 text-base font-semibold text-white transition hover:bg-zeno-night/90 focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zeno-line disabled:text-zeno-muted"
				>
					{isSubmitting ? t('submitting') : t('submitButton')}
				</motion.button>
			</div>
		</motion.div>
	)
}

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface ReportSuccessProps {
	submittedTime: string | null
	onReset: () => Promise<boolean>
}

export default function ReportSuccess({ submittedTime, onReset }: ReportSuccessProps) {
	const [isResetting, setIsResetting] = useState(false)
	const t = useTranslations('Report')
	const [resetError, setResetError] = useState(false)

	const handleReset = async () => {
		setIsResetting(true)
		setResetError(false)
		const success = await onReset()
		if (!success) setResetError(true)
		setIsResetting(false)
	}

	return (
		<motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} className='mx-auto max-w-xl rounded-zeno border border-zeno-sage/25 bg-white p-8 text-center shadow-zeno-card sm:p-12'>
			<motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 15 }} className='mx-auto flex size-16 items-center justify-center rounded-full bg-zeno-sage-soft'>
				<svg viewBox='0 0 24 24' className='size-8 text-zeno-sage' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round' aria-hidden>
					<motion.path
						d='M20 6 9 17l-5-5'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
					/>
				</svg>
			</motion.div>
			<h2 className='mt-6 text-2xl font-bold tracking-tight text-zeno-ink'>
				{t('successTitle')}
			</h2>
			<p className='mx-auto mt-2 max-w-sm text-sm leading-6 text-zeno-muted'>{t('successMessage')}</p>
			{submittedTime && (
				<div className='mx-auto mt-6 max-w-xs rounded-2xl bg-zeno-ink px-5 py-4 text-white'>
					<p className='text-xs uppercase tracking-wider text-zeno-muted'>{t('successTime')}</p>
					<p className='mt-1 text-3xl font-bold tabular-nums text-zeno-amber'>{submittedTime}</p>
				</div>
			)}
			{resetError && <p className='mt-4 text-sm text-red-600'>{t('submitError')}</p>}
			<button
				onClick={handleReset}
				disabled={isResetting}
				className='mt-7 rounded-xl border border-zeno-line bg-white px-5 py-3 text-sm font-semibold text-zeno-ink transition hover:bg-zeno-paper-soft disabled:cursor-not-allowed disabled:opacity-60'
			>
				{isResetting ? '...' : t('resetBtn')}
			</button>
		</motion.div>
	)
}

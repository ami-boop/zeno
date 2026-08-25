import { useTranslations } from 'next-intl'
import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock3, XCircle } from 'lucide-react'
import type { FriendTripStatus } from '@/lib/api-contracts'

interface ReportSuccessProps {
	submittedTime: string | null
	friendStatus?: FriendTripStatus | null
	onReset: () => Promise<boolean>
}

const friendStatusVisual: Record<FriendTripStatus, { box: string; badge: string; icon: ReactNode }> = {
	pending: {
		box: 'border-zeno-amber/35 bg-zeno-cream-surface',
		badge: 'bg-zeno-amber text-zeno-amber-fg',
		icon: <Clock3 className="size-5" />,
	},
	approved: {
		box: 'border-zeno-sage/30 bg-zeno-sage-soft',
		badge: 'bg-zeno-sage text-white',
		icon: <Check className="size-5" />,
	},
	rejected: {
		box: 'border-zeno-danger/25 bg-zeno-danger-soft',
		badge: 'bg-zeno-danger text-white',
		icon: <XCircle className="size-5" />,
	},
}

function FriendTripStatusBlock({ status }: { status: FriendTripStatus }) {
	const t = useTranslations('Report')
	const visual = friendStatusVisual[status]

	return (
		<div className={`mx-auto mt-6 max-w-sm rounded-2xl border p-5 text-start ${visual.box}`}>
			<div className="flex items-center justify-between gap-3">
				<p className="text-sm font-bold text-zeno-ink">{t(`friendStatus.title`)}</p>
				<span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${visual.badge}`}>
					{visual.icon}
					{t(`friendStatus.${status}`)}
				</span>
			</div>
			<p className="mt-2 text-xs leading-5 text-zeno-muted">{t(`friendStatus.${status}Hint`)}</p>
		</div>
	)
}

export default function ReportSuccess({ submittedTime, friendStatus, onReset }: ReportSuccessProps) {
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
		<motion.div
			initial={{ opacity: 0, scale: 0.96, y: 10 }}
			animate={{ opacity: 1, scale: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 260, damping: 22 }}
			className="mx-auto max-w-xl rounded-zeno border border-zeno-sage/25 bg-zeno-surface p-8 text-center shadow-zeno-card sm:p-12"
		>
			<motion.div
				initial={{ scale: 0.7 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.12, type: 'spring', stiffness: 300, damping: 15 }}
				className="mx-auto flex size-16 items-center justify-center rounded-full bg-zeno-sage-soft"
			>
				<svg
					viewBox="0 0 24 24"
					className="size-8 text-zeno-sage"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden
				>
					<motion.path
						d="M20 6 9 17l-5-5"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
					/>
				</svg>
			</motion.div>
			<h2 className="mt-6 text-2xl font-bold tracking-tight text-zeno-ink">{t('successTitle')}</h2>
			<p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zeno-muted">{t('successMessage')}</p>
			{submittedTime && (
				<div className="mx-auto mt-6 max-w-xs rounded-2xl bg-zeno-night px-5 py-4 text-white">
					<p className="text-xs uppercase tracking-wider text-zeno-muted">{t('successTime')}</p>
					<p className="mt-1 text-3xl font-bold tabular-nums text-zeno-amber">{submittedTime}</p>
				</div>
			)}
			{friendStatus && <FriendTripStatusBlock status={friendStatus} />}
			{resetError && <p className="mt-4 text-sm text-zeno-danger">{t('submitError')}</p>}
			<button
				type="button"
				onClick={handleReset}
				disabled={isResetting}
				className="mt-7 rounded-xl border border-zeno-line bg-zeno-surface px-5 py-3 text-sm font-semibold text-zeno-ink transition hover:bg-zeno-paper-soft disabled:cursor-not-allowed disabled:opacity-60"
			>
				{isResetting ? '...' : t('resetBtn')}
			</button>
		</motion.div>
	)
}

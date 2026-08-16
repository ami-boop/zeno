'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { AlertTriangle, BusFront, RefreshCw } from 'lucide-react'

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const router = useRouter()
	const t = useTranslations('Error')

	useEffect(() => {
		console.error(error)
	}, [error])

	const handleRetry = () => {
		reset()
		router.refresh()
	}

	return (
		<div className='zeno-page flex min-h-dvh items-center justify-center px-4 py-12'>
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.35, ease: 'easeOut' }}
				className='w-full max-w-md text-center'
			>
				<div className='relative mx-auto mb-8 w-fit'>
					<div className='flex size-20 items-center justify-center rounded-zeno bg-zeno-danger/10'>
						<AlertTriangle className='size-10 text-zeno-danger' />
					</div>
					<div className='absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full bg-zeno-amber text-zeno-ink shadow-zeno-card'>
						<BusFront className='size-4' />
					</div>
				</div>

				<p className='text-xs font-semibold uppercase tracking-[0.2em] text-zeno-danger'>
					{t('eyebrow')}
				</p>
				<h1 className='mt-3 text-3xl font-bold tracking-tight text-zeno-ink'>
					{t('title')}
				</h1>
				<p className='mx-auto mt-3 max-w-sm text-sm leading-6 text-zeno-ink-soft'>
					{t('description')}
				</p>

				<div className='mt-8 flex justify-center'>
					<button
						onClick={handleRetry}
						className='zeno-primary zeno-focus inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-zeno-ink/90 active:translate-y-0'
					>
						<RefreshCw className='size-4' />
						{t('tryAgain')}
					</button>
				</div>

				{error.digest && (
					<p className='mt-8 text-xs text-zeno-muted'>
						{t('errorId')}: <span className='font-mono'>{error.digest}</span>
					</p>
				)}
			</motion.div>
		</div>
	)
}

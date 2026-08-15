'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import { validateEmail, validatePassword } from '@/lib/validation'
import LoginHeader from '@/components/login/LoginHeader'
import LoginForm from '@/components/login/LoginForm'
import SecurityNotice from '@/components/login/SecurityNotice'
import { ArrowUpRight, BusFront, Sparkles } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import inputValidation from '@/app/actions/inputValidation'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
	const t = useTranslations('Login')
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (email: string, password: string) => {
		setError(null)

		if (!validateEmail(email)) {
			setError(t('errors.invalidEmail'))
			return
		}

		if (!validatePassword(password)) {
			setError(t('errors.invalidPassword'))
			return
		}

		setIsSubmitting(true)

		try {
			const { sanitizedEmail, sanitizedPassword } = await inputValidation(email, password)
			const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail!, sanitizedPassword!)
			const token = await userCredential.user.getIdToken(true)
			const result = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token }),
			})

			if (!result.ok) {
				setError(t('errors.genericError'))
				auth.signOut()
				return
			}

			router.push('/dashboard')
		} catch {
			setError(t('errors.genericError'))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='min-h-screen bg-zeno-ink lg:grid lg:grid-cols-[minmax(380px,0.78fr)_minmax(0,1.22fr)]'>
			<section className='zeno-page flex min-h-screen items-center px-5 py-8 sm:px-10 lg:px-14 xl:px-20'>
				<div className='mx-auto w-full max-w-md'>
					<div className='flex items-center justify-between'>
						<Link href='/' className='zeno-focus text-lg font-bold tracking-tight text-zeno-ink'>Zeno</Link>
						<Link href='/' className='zeno-focus inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-zeno-muted transition hover:bg-white hover:text-zeno-ink'>
							{t('backToHome')} <ArrowUpRight className='size-3.5' />
						</Link>
					</div>

					<motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='mt-14'>
						<LoginHeader />

						{error && (
							<div role='alert' className='mb-4 rounded-xl border border-zeno-danger/25 bg-zeno-danger-soft p-3'>
								<p className='text-sm text-zeno-danger'>{error}</p>
							</div>
						)}

						<LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

						<SecurityNotice />
					</motion.div>
				</div>
			</section>

			<aside className='relative hidden min-h-screen overflow-hidden bg-zeno-ink text-white lg:flex'>
				<div className='absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(244,184,96,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,184,96,0.08)_1px,transparent_1px)] [background-size:64px_64px]' />
				<div className='absolute -right-32 top-16 size-[32rem] rounded-full border-[80px] border-zeno-amber/10' />
				<div className='relative z-10 flex w-full flex-col justify-between p-12 xl:p-16'>
					<div className='flex items-center gap-2 text-sm font-semibold text-zeno-line-strong'><BusFront className='size-5 text-zeno-amber' /> {t('visualEyebrow')}</div>

					<div className='max-w-xl'>
						<p className='zeno-kicker text-zeno-amber'>{t('visualLabel')}</p>
						<h2 className='mt-4 max-w-lg text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-white xl:text-6xl'>{t('visualTitle')}</h2>
						<p className='mt-6 max-w-md text-lg leading-8 text-zeno-line-strong'>{t('visualSubtitle')}</p>

						<motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.5 }} className='mt-10 max-w-md rounded-zeno border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm'>
							<div className='flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zeno-muted'>
								<span>{t('visualRoute')}</span><span className='text-zeno-amber'>KADURI</span>
							</div>
							<div className='mt-7 flex items-end justify-between'>
								<div><p className='text-sm text-zeno-muted'>{t('visualDeparture')}</p><p className='mt-1 text-5xl font-bold tabular-nums text-zeno-amber'>15:35</p></div>
								<div className='text-right'><p className='text-sm text-zeno-muted'>{t('visualStatus')}</p><p className='mt-1 font-semibold text-white'>{t('visualStatusText')}</p></div>
							</div>
							<div className='mt-7 flex items-center gap-2'><span className='size-2 rounded-full bg-zeno-amber' /><motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className='h-0.5 flex-1 origin-left bg-zeno-amber' /><span className='size-2 rounded-full border-2 border-zeno-amber' /></div>
						</motion.div>
					</div>

					<div className='flex items-center gap-2 text-sm text-zeno-muted'><Sparkles className='size-4 text-zeno-amber' /> {t('visualNote')}</div>
				</div>
			</aside>
		</div>
	)
}

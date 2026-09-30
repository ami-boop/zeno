'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { motion } from 'framer-motion'
import Waves from '@/components/landing/Waves'
import LoginHeader from '@/components/login/LoginHeader'
import LoginForm from '@/components/login/LoginForm'
import SecurityNotice from '@/components/login/SecurityNotice'
import { ArrowUpRight, BusFront, Sparkles } from 'lucide-react'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { ensureServiceWorkerReady } from '@/lib/service-worker'
import { navigate } from '@/utils/navigate'
import { auth } from '@/lib/firebase'

const LOGIN_ERROR_KEYS: Record<string, string> = {
	'auth/invalid-email': 'invalidEmail',
	'auth/invalid-credential': 'invalidCredential',
	'auth/user-not-found': 'userNotFound',
	'auth/wrong-password': 'wrongPassword',
	'auth/too-many-requests': 'tooManyRequests',
	'auth/user-disabled': 'userDisabled',
	'auth/network-request-failed': 'networkError',
}

const getErrorCode = (error: unknown): string => {
	if (typeof error === 'object' && error !== null && 'code' in error) {
		const code = (error as { code?: unknown }).code
		if (typeof code === 'string') return code
	}
	return ''
}

export default function LoginPage() {
	const t = useTranslations('Login')
	const locale = useLocale()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const autoRedirected = useRef(false)

	// Cold-open healing: the service worker cannot refresh an expired token by
	// itself (token refresh from the SW context is blocked by the API key's
	// HTTP-referrer restriction), so an idle session can land here with the
	// user still signed in. The page-context SDK refreshes fine, so bounce the
	// signed-in user straight to their home with a fresh token attached.
	useEffect(() => {
		let cancelled = false
		const goHome = async () => {
			if (autoRedirected.current || cancelled) return
			autoRedirected.current = true
			try {
				const swReady = await ensureServiceWorkerReady()
				if (cancelled || !swReady || !auth.currentUser) {
					autoRedirected.current = false
					return
				}
				// Refresh through the page SDK (requests carry Referer → allowed).
				const idTokenResult = await auth.currentUser.getIdTokenResult()
				if (cancelled || !auth.currentUser) {
					autoRedirected.current = false
					return
				}
				const role = idTokenResult?.claims.role as string | undefined
				// Only redirect logged-in zeno users. If the role is missing
				// or not student/parent (e.g. admin or newly created user
				// without claims yet), stay on login — otherwise middleware
				// bounces the dashboard request back to login and the effect
				// re-fires, creating a reload loop every second.
				if (role !== 'student' && role !== 'parent') {
					autoRedirected.current = false
					return
				}
				const home =
					role === 'parent'
						? `/${locale}/parent/dashboard`
						: `/${locale}/dashboard`
				navigate(home)
			} catch {
				autoRedirected.current = false
			}
		}
		// auth may still be restoring the persisted user from IndexedDB — wait
		// for the state callback instead of trusting currentUser at mount.
		const unsubscribe = onAuthStateChanged(auth, user => {
			if (user) void goHome()
		})
		return () => {
			cancelled = true
			unsubscribe()
		}
	}, [locale])

	const handleSubmit = async (email: string, password: string) => {
		setError(null)
		setIsSubmitting(true)

		try {
			await signInWithEmailAndPassword(auth, email, password)
			const swReady = await ensureServiceWorkerReady()
			if (!swReady) {
				setError(t('errors.genericError'))
				return
			}
			const idTokenResult = await auth.currentUser?.getIdTokenResult()
			const role = idTokenResult?.claims.role as string | undefined
			if (role !== 'student' && role !== 'parent') {
				setError(t('errors.genericError'))
				return
			}
			const home = role === 'parent' ? `/${locale}/parent/dashboard` : `/${locale}/dashboard`
			navigate(home)
		} catch (error) {
			const key = LOGIN_ERROR_KEYS[getErrorCode(error)] ?? 'genericError'
			setError(t(`errors.${key}`))
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-zeno-night lg:grid lg:grid-cols-[minmax(380px,0.78fr)_minmax(0,1.22fr)]">
			<section className="zeno-page relative flex min-h-screen items-center overflow-hidden px-5 py-8 sm:px-10 lg:px-14 xl:px-20">
				<Waves opacity={0.5} />
				<div className="relative mx-auto w-full max-w-md">
					<div className="flex items-center justify-between">
						<Link href="/" className="zeno-focus text-lg font-bold tracking-tight text-zeno-ink">
							Zeno
						</Link>
						<Link
							href="/"
							className="zeno-focus inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-zeno-muted transition hover:bg-zeno-surface hover:text-zeno-ink"
						>
							{t('backToHome')} <ArrowUpRight className="size-3.5" />
						</Link>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="mt-14"
					>
						<LoginHeader />

						{error && (
							<div role="alert" className="mb-4 rounded-xl border border-zeno-danger/25 bg-zeno-danger-soft p-3">
								<p className="text-sm text-zeno-danger">{error}</p>
							</div>
						)}

						<LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

						<SecurityNotice />
					</motion.div>
				</div>
			</section>

			<aside className="relative hidden min-h-screen overflow-hidden bg-zeno-night text-white lg:flex">
				<div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(244,184,96,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,184,96,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
				<div className="absolute -right-32 top-16 size-[32rem] rounded-full border-[80px] border-zeno-amber/10" />
				<div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
					<div className="flex items-center gap-2 text-sm font-semibold text-zeno-line-strong">
						<BusFront className="size-5 text-zeno-amber" /> {t('visualEyebrow')}
					</div>

					<div className="max-w-xl">
						<p className="zeno-kicker text-zeno-amber">{t('visualLabel')}</p>
						<h2 className="mt-4 max-w-lg text-5xl font-bold leading-[1.02] tracking-[-0.04em] text-white xl:text-6xl">
							{t('visualTitle')}
						</h2>
						<p className="mt-6 max-w-md text-lg leading-8 text-zeno-line-strong">{t('visualSubtitle')}</p>

						<motion.div
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25, duration: 0.5 }}
							className="mt-10 max-w-md rounded-zeno border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
						>
							<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-zeno-muted">
								<span>{t('visualRoute')}</span>
								<span className="text-zeno-amber">KADURI</span>
							</div>
							<div className="mt-7 flex items-end justify-between">
								<div>
									<p className="text-sm text-zeno-muted">{t('visualDeparture')}</p>
									<p className="mt-1 text-5xl font-bold tabular-nums text-zeno-amber">15:35</p>
								</div>
								<div className="text-end">
									<p className="text-sm text-zeno-muted">{t('visualStatus')}</p>
									<p className="mt-1 font-semibold text-white">{t('visualStatusText')}</p>
								</div>
							</div>
							<div className="mt-7 flex items-center gap-2">
								<span className="size-2 rounded-full bg-zeno-amber" />
								<motion.span
									initial={{ scaleX: 0 }}
									animate={{ scaleX: 1 }}
									transition={{ delay: 0.6, duration: 0.8 }}
									className="h-0.5 flex-1 origin-left bg-zeno-amber"
								/>
								<span className="size-2 rounded-full border-2 border-zeno-amber" />
							</div>
						</motion.div>
					</div>

					<div className="flex items-center gap-2 text-sm text-zeno-muted">
						<Sparkles className="size-4 text-zeno-amber" /> {t('visualNote')}
					</div>
				</div>
			</aside>
		</div>
	)
}

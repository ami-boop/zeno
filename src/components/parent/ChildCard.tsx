import { getTranslations } from 'next-intl/server'
import { BusFront, MapPin, UserRound } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { ParentChild } from '@/lib/api-contracts'

type Props = {
	child: ParentChild
}

const STATUS_CHIP_CLASS: Record<string, string> = {
	pending: 'bg-zeno-amber/15 text-zeno-amber-ink',
	approved: 'bg-zeno-sage-soft text-zeno-sage',
	rejected: 'bg-zeno-danger-soft text-zeno-danger',
	manager_approved: 'bg-zeno-paper-soft text-zeno-muted',
	manager_rejected: 'bg-zeno-paper-soft text-zeno-muted',
}

const TRIP_STATUS_CHIP_CLASS: Record<string, string> = {
	scheduled: 'bg-zeno-amber/15 text-zeno-amber-ink',
	boarding: 'bg-zeno-sage-soft text-zeno-sage',
	in_transit: 'bg-zeno-sage text-white',
	completed: 'bg-zeno-paper-soft text-zeno-muted',
	cancelled: 'bg-zeno-danger-soft text-zeno-danger',
}

export default async function ChildCard({ child }: Props) {
	const t = await getTranslations('Parent')
	const today = child.today
	const friendRoute = today?.friendRoute ?? null
	const isPending = friendRoute?.parentStatus === 'pending'
	const name = `${child.firstName} ${child.lastName}`.trim()
	const initials = name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0])
		.join('')
		.toUpperCase()

	const goingToday = today?.status === 'going'
	const todayText =
		today === null || today.status === null
			? t('noReport')
			: goingToday && today.time
				? t('departureAt', { time: today.time })
				: t(today.status === 'not_going' ? 'notGoing' : 'noReport')

	const isLive = child.tracking?.live === true

	return (
		<section
			className={`group overflow-hidden rounded-zeno border bg-zeno-surface shadow-zeno-card transition-all duration-200 ${
				isPending
					? 'border-zeno-amber/50 hover:border-zeno-amber/70'
					: 'border-zeno-line hover:border-zeno-sage/50'
			}`}
			data-testid={`child-card-${child.uid}`}
		>
			<div className="flex items-center gap-4 px-6 py-5">
				<div aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zeno-night to-zeno-night/80 text-lg font-bold tracking-wide text-zeno-amber shadow-inner">
					{initials || <UserRound className="size-6" />}
				</div>
				<div className="min-w-0">
					<h2 className="truncate text-xl font-bold tracking-tight text-zeno-ink">{name}</h2>
					<div className="mt-0.5 flex flex-wrap items-center gap-2">
						{child.classId ? (
							<span className="rounded-full bg-zeno-paper-soft px-2.5 py-0.5 text-xs font-semibold text-zeno-ink-soft">
								{child.classId}
							</span>
						) : null}
						{friendRoute ? (
							<span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
								STATUS_CHIP_CLASS[friendRoute.parentStatus] ?? STATUS_CHIP_CLASS.pending
							}`}>
								{t(`status.${friendRoute.parentStatus}`)}
							</span>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-2 px-6 pb-5 sm:flex-row sm:items-center sm:justify-end">
				<Link
					href={`/parent/approve/${child.uid}`}
					className={`zeno-focus inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
						friendRoute ? 'bg-zeno-amber/15 text-zeno-amber-ink hover:bg-zeno-amber/25' : 'hidden'
					}`}
				>
					{t('reviewFriend')}
				</Link>
				<Link
					href={`/parent/track/${child.uid}`}
					className="zeno-focus inline-flex items-center justify-center gap-2 rounded-xl bg-zeno-night px-5 py-2.5 text-sm font-bold text-white transition hover:bg-zeno-night/90"
				>
					<MapPin className="size-4" aria-hidden="true" />
					{t('trackOnMap')}
				</Link>
			</div>

			<div className="grid gap-px border-t border-zeno-line bg-zeno-line sm:grid-cols-1 lg:grid-cols-3">
				<div className="bg-zeno-surface px-6 py-5">
					<p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">
						<UserRound className="size-3.5" aria-hidden="true" />
						{t('todayLabel')}
					</p>
					<p className={`mt-2 text-lg font-bold tabular-nums tracking-tight ${goingToday ? 'text-zeno-ink' : 'text-zeno-muted'}`}>
						{todayText}
					</p>
				</div>

				<div className="bg-zeno-surface px-6 py-5">
					<p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">
						<BusFront className="size-3.5" aria-hidden="true" />
						{t('trackSummaryTitle')}
					</p>
					<div className="mt-2 flex flex-wrap items-center gap-1.5">
						{isLive ? (
							<span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-zeno-sage">
								<span className="relative flex size-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zeno-sage opacity-60" />
									<span className="relative inline-flex size-2 rounded-full bg-zeno-sage" />
								</span>
								{t('trackLive')}
							</span>
						) : (
							<span className="text-xs font-semibold uppercase tracking-wide text-zeno-muted">{t('noActiveTrip')}</span>
						)}
						{child.tracking?.status ? (
							<span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
								TRIP_STATUS_CHIP_CLASS[child.tracking.status] ?? TRIP_STATUS_CHIP_CLASS.scheduled
							}`}>
								{t(`tripStatus.${child.tracking.status}`)}
							</span>
						) : null}
						{child.tracking?.etaToStop !== null && child.tracking?.etaToStop !== undefined ? (
							<span dir="ltr" className="text-base font-bold tabular-nums text-zeno-amber-ink">
								{t('etaToStop', { count: child.tracking.etaToStop })}
							</span>
						) : null}
					</div>
				</div>

				<div className="bg-zeno-surface px-6 py-5">
					<p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-zeno-muted">
						{t('friendTitle')}
					</p>
					<p className="mt-2 text-lg font-bold tracking-tight text-zeno-ink">
						{friendRoute ? (
							<span className="text-zeno-amber-ink">{friendRoute.friendName || friendRoute.toRouteId || '—'}</span>
						) : (
							<span className="text-zeno-muted">{t('noTripSummary')}</span>
						)}
					</p>
				</div>
			</div>
		</section>
	)
}

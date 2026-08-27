import { getTranslations } from 'next-intl/server'
import type { ParentFriendRouteInfo } from '@/lib/api-contracts'
import FriendApprovalActions from './FriendApprovalActions'

type Props = {
	friendRoute: ParentFriendRouteInfo
	childUid: string
}

const STATUS_CHIP_CLASS: Record<string, string> = {
	pending: 'bg-zeno-amber/15 text-zeno-amber-ink',
	approved: 'bg-zeno-sage-soft text-zeno-sage',
	rejected: 'bg-zeno-danger-soft text-zeno-danger',
	manager_approved: 'bg-zeno-paper-soft text-zeno-muted',
	manager_rejected: 'bg-zeno-paper-soft text-zeno-muted',
}

export default async function FriendApprovalCard({ friendRoute, childUid }: Props) {
	const t = await getTranslations('Parent')
	const isPending = friendRoute.parentStatus === 'pending'

	return (
		<section className="rounded-zeno border border-zeno-amber/30 bg-zeno-amber/[0.07] p-6 shadow-zeno-card" data-testid={`friend-route-${childUid}`}>
			<div className="flex items-center justify-between gap-2">
				<p className="text-xs font-bold uppercase tracking-[0.15em] text-zeno-amber-ink">{t('friendTitle')}</p>
				<span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
					STATUS_CHIP_CLASS[friendRoute.parentStatus] ?? STATUS_CHIP_CLASS.pending
				}`}>
					{t(`status.${friendRoute.parentStatus}`)}
				</span>
			</div>

			<dl className="mt-4 space-y-2 text-sm">
				<div className="flex gap-2">
					<dt className="shrink-0 font-medium text-zeno-muted">{t('friendLabel')}:</dt>
					<dd className="font-semibold text-zeno-ink">{friendRoute.friendName || friendRoute.toRouteId || '—'}</dd>
				</div>
				{friendRoute.note ? (
					<div className="flex gap-2">
						<dt className="shrink-0 font-medium text-zeno-muted">{t('noteLabel')}:</dt>
						<dd className="font-medium text-zeno-ink-soft">{friendRoute.note}</dd>
					</div>
				) : null}
				{friendRoute.sleepover ? (
					<div>
						<span className="rounded-full bg-zeno-paper-soft px-2 py-0.5 text-[11px] font-bold uppercase text-zeno-ink-soft">
							{t('sleepoverBadge')}
						</span>
					</div>
				) : null}
			</dl>

			{isPending ? <FriendApprovalActions childUid={childUid} /> : null}
		</section>
	)
}

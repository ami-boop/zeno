'use client'

import { useState, useTransition } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Check, Loader2, ShieldAlert, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { submitFriendApproval } from '@/app/actions/parent'

type Props = {
	childUid: string
}

export default function FriendApprovalActions({ childUid }: Props) {
	const t = useTranslations('Parent')
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [busyAction, setBusyAction] = useState<'approve' | 'reject' | null>(null)
	const [errorKey, setErrorKey] = useState<'conflict' | 'requestFailed' | null>(null)

	const respond = (action: 'approve' | 'reject') => {
		setBusyAction(action)
		setErrorKey(null)
		startTransition(async () => {
			const result = await submitFriendApproval(childUid, action)
			setBusyAction(null)
			if (!result.success && result.error !== 'unauthorized') {
				setErrorKey(result.error === 'conflict' ? 'conflict' : 'requestFailed')
			}
			router.refresh()
		})
	}

	const busy = isPending

	return (
		<div className="mt-4">
			{errorKey ? (
				<p role="alert" className="mb-3 flex items-start gap-1.5 rounded-xl bg-zeno-danger-soft px-3 py-2 text-xs font-semibold text-zeno-danger">
					<ShieldAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
					{t(`approveErrors.${errorKey}`)}
				</p>
			) : null}

			<div className="flex gap-2">
				<button
					type="button"
					disabled={busy}
					onClick={() => respond('approve')}
					data-testid={`friend-approve-${childUid}`}
					className={`zeno-focus inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zeno-sage px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zeno-sage/85 ${
						busy ? 'cursor-not-allowed opacity-60' : ''
					}`}
				>
					{busyAction === 'approve' ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" aria-hidden="true" />}
					{t(busyAction === 'approve' ? 'approving' : 'approve')}
				</button>
				<button
					type="button"
					disabled={busy}
					onClick={() => respond('reject')}
					data-testid={`friend-reject-${childUid}`}
					className={`zeno-focus inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zeno-danger/30 bg-zeno-danger-soft px-4 py-2.5 text-sm font-bold text-zeno-danger transition hover:bg-zeno-danger/10 ${
						busy ? 'cursor-not-allowed opacity-60' : ''
					}`}
				>
					{busyAction === 'reject' ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" aria-hidden="true" />}
					{t(busyAction === 'reject' ? 'rejecting' : 'reject')}
				</button>
			</div>
		</div>
	)
}

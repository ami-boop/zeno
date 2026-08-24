'use client'

import { useTranslations } from 'next-intl'
import { MapPin, MessageSquare } from 'lucide-react'
import type { FriendStudent } from '@/lib/api-contracts'
import OptionCard from '@/components/ui/OptionCard'

type Props = {
	friend: FriendStudent
	onChangeFriend: () => void
	sleepover: boolean | null
	onSleepoverChange: (value: boolean) => void
	note: string
	onNoteChange: (value: string) => void
}

export default function FriendDetails({
	friend,
	onChangeFriend,
	sleepover,
	onSleepoverChange,
	note,
	onNoteChange,
}: Props) {
	const t = useTranslations('Report')

	return (
		<div>
			<div className="flex items-center justify-between gap-3 rounded-xl border border-zeno-line bg-zeno-paper-soft p-4">
				<div className="min-w-0">
					<p className="truncate font-semibold text-zeno-ink">
						{friend.firstName} {friend.lastName}
					</p>
					<p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zeno-muted">
						<MapPin className="size-3.5 shrink-0 text-zeno-sage" />
						{friend.routeName ?? friend.routeId} · {friend.stopName ?? friend.stopId}
					</p>
				</div>
				<button
					type="button"
					onClick={onChangeFriend}
					className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-zeno-ink transition hover:bg-zeno-line/60"
				>
					{t('friendChange')}
				</button>
			</div>

			<div className="mt-4">
				<p className="text-sm font-semibold text-zeno-ink-soft">{t('sleepoverLabel')}</p>
				<div className="mt-2 grid grid-cols-2 gap-3">
					<OptionCard
						active={sleepover === false}
						onClick={() => onSleepoverChange(false)}
						label={t('sleepoverNo')}
						description={t('sleepoverNoHint')}
					/>
					<OptionCard
						active={sleepover === true}
						onClick={() => onSleepoverChange(true)}
						label={t('sleepoverYes')}
						description={t('sleepoverYesHint')}
					/>
				</div>
			</div>

			<div className="mt-4">
				<label htmlFor="friend-note" className="flex items-center gap-2 text-sm font-semibold text-zeno-ink-soft">
					<MessageSquare className="size-4 text-zeno-sage" />
					{t('friendNoteLabel')}
				</label>
				<textarea
					id="friend-note"
					value={note}
					onChange={(event) => onNoteChange(event.target.value)}
					placeholder={t('friendNotePlaceholder')}
					rows={3}
					className="mt-2 w-full resize-none rounded-xl border border-zeno-line px-3 py-3 text-sm text-zeno-ink outline-none transition placeholder:text-zeno-muted focus:border-zeno-amber focus:ring-2 focus:ring-zeno-amber/30"
				/>
				<p className="mt-2 text-xs leading-5 text-zeno-muted">{t('friendDetailsHint')}</p>
			</div>
		</div>
	)
}

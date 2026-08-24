'use client'

import { useTranslations } from 'next-intl'
import { Search, UsersRound } from 'lucide-react'
import type { FriendStudent } from '@/lib/api-contracts'
import FormMessage from '@/components/ui/FormMessage'
import type { FriendStudentsPicker } from './useFriendStudents'

type Props = {
	picker: FriendStudentsPicker
	onSelect: (friend: FriendStudent) => void
}

export default function FriendSearch({ picker, onSelect }: Props) {
	const t = useTranslations('Report')
	const { query, setQuery, students, loading, error, canLoadMore, loadMore } = picker

	return (
		<div>
			<label htmlFor="friend-search" className="flex items-center gap-2 text-sm font-semibold text-zeno-ink-soft">
				<UsersRound className="size-4 text-zeno-sage" />
				{t('friendWhoLabel')}
			</label>
			<div className="relative">
				<Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-zeno-muted" />
				<input
					id="friend-search"
					type="search"
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder={t('friendWhoPlaceholder')}
					autoComplete="off"
					className="mt-2 w-full rounded-xl border border-zeno-line ps-10 pe-3 py-3 text-sm text-zeno-ink outline-none transition placeholder:text-zeno-muted focus:border-zeno-amber focus:ring-2 focus:ring-zeno-amber/30"
				/>
			</div>

			<div className="mt-3 max-h-60 overflow-y-auto rounded-xl border border-zeno-line">
				{loading && students.length === 0 ? (
					<p className="p-4 text-sm text-zeno-muted">{t('friendLoading')}</p>
				) : students.length > 0 ? (
					<>
						<ul role="listbox" className="divide-y divide-zeno-line">
							{students.map((friend) => (
								<li key={friend.uid}>
									<button
										type="button"
										role="option"
										aria-selected={false}
										onClick={() => onSelect(friend)}
										className="flex w-full items-center gap-3 px-4 py-3 text-start transition hover:bg-zeno-paper-soft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zeno-amber/50"
									>
										<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zeno-sage-soft font-bold text-zeno-sage">
											{`${friend.firstName[0] ?? ''}${friend.lastName[0] ?? ''}`}
										</span>
										<span className="min-w-0 flex-1">
											<span className="block truncate font-semibold text-zeno-ink">
												{friend.firstName} {friend.lastName}
											</span>
											<span className="block truncate text-xs text-zeno-muted">
												{friend.classId} · {friend.stopName ?? friend.stopId}
											</span>
										</span>
										{friend.sameClass && (
											<span className="shrink-0 rounded-full bg-zeno-amber/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zeno-amber-dark">
												{t('friendSameClass')}
											</span>
										)}
									</button>
								</li>
							))}
						</ul>
						{canLoadMore && (
							<div className="border-t border-zeno-line p-2">
								<button
									type="button"
									onClick={loadMore}
									className="w-full rounded-lg px-3 py-2 text-center text-sm font-semibold text-zeno-sage transition hover:bg-zeno-sage-soft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zeno-amber/50"
								>
									{t('friendLoadMore')}
								</button>
							</div>
						)}
					</>
				) : (
					<p className="p-4 text-sm text-zeno-muted">{query.trim() ? t('noFriendsMatch') : t('noFriends')}</p>
				)}
			</div>
			{error && <FormMessage className="mt-2">{t('friendLoadError')}</FormMessage>}
		</div>
	)
}

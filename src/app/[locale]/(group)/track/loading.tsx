import { getTranslations } from 'next-intl/server'
import PageShell from '@/components/ui/PageShell'

export default async function TrackLoading() {
	const t = await getTranslations('Track')

	return (
		<PageShell width="lg" className="lg:py-12">
			<div className="mb-8 max-w-2xl lg:mb-10" role="status">
				<span className="sr-only">{t('loading')}</span>
				<div className="h-3 w-28 animate-pulse rounded-full bg-zeno-paper-soft" />
				<div className="mt-4 h-10 w-64 animate-pulse rounded-xl bg-zeno-paper-soft sm:w-80" />
				<div className="mt-3 h-4 w-full max-w-md animate-pulse rounded-lg bg-zeno-paper-soft" />
			</div>

			<div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
				<div className="flex min-w-0 flex-col gap-6">
					<div className="h-[320px] animate-pulse rounded-zeno bg-zeno-paper-soft sm:h-[420px]" />
					<div className="zeno-card p-5">
						<div className="h-3 w-40 animate-pulse rounded-full bg-zeno-paper-soft" />
						<div className="mt-4 space-y-2">
							{[0, 1, 2, 3].map((row) => (
								<div key={row} className="flex items-center gap-3 rounded-xl px-3 py-2">
									<div className="size-5 shrink-0 animate-pulse rounded-full bg-zeno-paper-soft" />
									<div
										className="h-4 animate-pulse rounded-lg bg-zeno-paper-soft"
										style={{ width: `${58 - row * 9}%` }}
									/>
								</div>
							))}
						</div>
					</div>
				</div>

				<aside className="flex min-w-0 flex-col gap-6">
					<div className="zeno-card p-5">
						<div className="h-6 w-24 animate-pulse rounded-full bg-zeno-paper-soft" />
						<div className="mt-6 h-3 w-24 animate-pulse rounded-full bg-zeno-paper-soft" />
						<div className="mt-2 h-9 w-32 animate-pulse rounded-xl bg-zeno-paper-soft" />
						<div className="mt-5 h-4 w-full animate-pulse rounded-lg bg-zeno-paper-soft" />
					</div>
					<div className="zeno-card p-5">
						<div className="flex items-center gap-4">
							<div className="size-12 shrink-0 animate-pulse rounded-full bg-zeno-paper-soft" />
							<div className="min-w-0 flex-1">
								<div className="h-3 w-16 animate-pulse rounded-full bg-zeno-paper-soft" />
								<div className="mt-2 h-5 w-36 animate-pulse rounded-lg bg-zeno-paper-soft" />
							</div>
						</div>
						<div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-zeno-paper-soft" />
					</div>
				</aside>
			</div>
		</PageShell>
	)
}

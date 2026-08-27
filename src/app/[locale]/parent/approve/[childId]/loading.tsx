import { getTranslations } from 'next-intl/server'
import PageShell from '@/components/ui/PageShell'

export default async function ParentApproveLoading() {
	const t = await getTranslations('Parent')
	return (
		<PageShell width="narrow" className="lg:py-12">
			<div role="status" className="space-y-6">
				<div className="h-5 w-32 animate-pulse rounded bg-zeno-line" />
				<div className="h-8 w-2/3 animate-pulse rounded bg-zeno-line" />
				<div className="h-4 w-1/2 animate-pulse rounded bg-zeno-line" />
				<div className="mt-8 h-72 animate-pulse rounded-zeno bg-zeno-paper-soft" />
				<span className="sr-only">{t('loading')}</span>
			</div>
		</PageShell>
	)
}

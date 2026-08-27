import { getSessionToken } from '@/utils/getSessionToken'
import { getTranslations } from 'next-intl/server'
import { fetchParentDashboard } from '@/lib/api/parent'
import ChildCard from '@/components/parent/ChildCard'
import DataErrorState from '@/components/ui/DataErrorState'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'

export default async function ParentDashboardPage() {
	const t = await getTranslations('Parent')
	const token = await getSessionToken()
	const dashboard = await fetchParentDashboard(token)

	if (!dashboard) {
		return (
			<PageShell width="narrow">
				<DataErrorState
					eyebrow={t('errorEyebrow')}
					title={t('loadErrorTitle')}
					description={t('loadErrorDescription')}
					actionLabel={t('retry')}
				/>
			</PageShell>
		)
	}

	const pendingCount = dashboard.children.filter(
		(child) => child.today?.friendRoute?.parentStatus === 'pending',
	).length

	return (
		<PageShell width="lg" className="lg:py-12">
			<PageHeader
				eyebrow={t('eyebrow')}
				title={t('welcome', { name: dashboard.parent.firstName || dashboard.parent.lastName || '' })}
				description={
					pendingCount > 0
						? t('pendingDescription', { count: pendingCount })
						: t('description')
				}
				size="lg"
				className="mb-8 lg:mb-10"
			/>

			{dashboard.children.length === 0 ? (
				<p className="rounded-zeno border border-zeno-line bg-zeno-surface p-6 text-sm font-medium text-zeno-muted shadow-zeno-card">
					{t('noChildren')}
				</p>
			) : (
				<div className="grid gap-5">
					{dashboard.children.map((child) => (
						<ChildCard key={child.uid} child={child} />
					))}
				</div>
			)}
		</PageShell>
	)
}

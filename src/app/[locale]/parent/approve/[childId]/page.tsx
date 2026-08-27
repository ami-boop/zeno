import { notFound } from 'next/navigation'
import { ArrowLeft, UserRound } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSessionToken } from '@/utils/getSessionToken'
import { fetchParentDashboard } from '@/lib/api/parent'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import FriendApprovalCard from '@/components/parent/FriendApprovalCard'

type Props = {
	params: Promise<{ locale: string; childId: string }>
}

export default async function ParentApprovePage({ params }: Props) {
	const { childId } = await params
	const t = await getTranslations('Parent')
	const token = await getSessionToken()

	const dashboard = await fetchParentDashboard(token)
	const child = dashboard?.children.find((item) => item.uid === childId)

	if (!child) notFound()

	const friendRoute = child.today?.friendRoute ?? null
	const childName = `${child.firstName} ${child.lastName}`.trim()

	return (
		<PageShell width="narrow" className="lg:py-12">
			<Link
				href="/parent/dashboard"
				className="zeno-focus mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-zeno-sage transition hover:text-zeno-sage/80"
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
				{t('backToDashboard')}
			</Link>

			<PageHeader eyebrow={t('approveEyebrow')} title={t('approveTitle', { name: childName })} description={t('approveDescription')} size="lg" className="mb-8 lg:mb-10" />

			{friendRoute ? (
				<FriendApprovalCard friendRoute={friendRoute} childUid={child.uid} />
			) : (
				<section className="rounded-zeno border border-zeno-line bg-zeno-surface p-8 text-center shadow-zeno-card">
					<div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zeno-paper-soft">
						<UserRound className="size-7 text-zeno-muted" aria-hidden="true" />
					</div>
					<h2 className="mt-4 text-xl font-bold text-zeno-ink">{t('noRequestTitle')}</h2>
					<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zeno-muted">{t('noRequestDescription')}</p>
				</section>
			)}
		</PageShell>
	)
}

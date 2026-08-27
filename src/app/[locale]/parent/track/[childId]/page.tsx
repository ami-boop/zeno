import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getSessionToken } from '@/utils/getSessionToken'
import { fetchParentDashboard, fetchParentChildBusTracking } from '@/lib/api/parent'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import NoTripState from '@/components/track/NoTripState'
import ParentTrackClient from '@/components/parent/ParentTrackClient'

type Props = {
	params: Promise<{ locale: string; childId: string }>
}

export default async function ParentTrackPage({ params }: Props) {
	const { childId } = await params
	const t = await getTranslations('Parent')
	const token = await getSessionToken()

	const dashboard = await fetchParentDashboard(token)
	const child = dashboard?.children.find((item) => item.uid === childId)

	if (!child) notFound()

	const tracking = await fetchParentChildBusTracking(token, childId)
	const childName = `${child.firstName} ${child.lastName}`.trim()

	return (
		<PageShell width="lg" className="lg:py-12">
			<Link
				href="/parent/dashboard"
				className="zeno-focus mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-zeno-sage transition hover:text-zeno-sage/80"
			>
				<ArrowLeft className="size-4" aria-hidden="true" />
				{t('backToDashboard')}
			</Link>

			<PageHeader eyebrow={t('trackEyebrow')} title={t('trackTitle', { name: childName })} description={t('trackDescription')} size="lg" className="mb-8 lg:mb-10" />

			{tracking ? <ParentTrackClient initial={tracking} childUid={childId} /> : <NoTripState />}
		</PageShell>
	)
}

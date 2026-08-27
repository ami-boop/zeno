import { getTranslations } from 'next-intl/server'
import { getSessionToken } from '@/utils/getSessionToken'
import PageShell from '@/components/ui/PageShell'
import PageHeader from '@/components/ui/PageHeader'
import TrackClient from '@/components/track/TrackClient'
import NoTripState from '@/components/track/NoTripState'
import { loadBusTracking } from '@/lib/api/bus-tracking'

export default async function TrackPage() {
	const t = await getTranslations('Track')
	const token = await getSessionToken()
	const initial = await loadBusTracking(token)

	return (
		<PageShell width="lg" className="lg:py-12">
			<PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} size="lg" className="mb-8 lg:mb-10" />
			{initial ? <TrackClient initial={initial} /> : <NoTripState />}
		</PageShell>
	)
}

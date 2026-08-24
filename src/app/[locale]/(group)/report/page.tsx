import ReportForm from '@/components/report/ReportForm'
import { getSessionToken } from '@/utils/getSessionToken'
import DataErrorState from '@/components/ui/DataErrorState'
import PageShell from '@/components/ui/PageShell'
import { getTranslations } from 'next-intl/server'
import { parseReportTime } from '@/lib/api-contracts'
import { getPersonalData } from '@/lib/personal-data'

export default async function ReportPage() {
	const t = await getTranslations('Report')
	const sessionToken = await getSessionToken()

	const payload = await getPersonalData('report-time', sessionToken)

	const timesRes = parseReportTime(payload)

	if (!timesRes) {
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

	return (
		<PageShell width="narrow">
			<ReportForm
				times={timesRes.times}
				defaultTime={timesRes.defaultTime}
				submitted={timesRes.submitted}
				submittedTime={timesRes.submittedTime}
				friendStatus={timesRes.friendTrip ?? null}
			/>
		</PageShell>
	)
}

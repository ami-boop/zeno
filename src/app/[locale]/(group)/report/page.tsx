import ReportForm from '@/components/report/ReportForm'
import { getSessionToken } from '@/utils/getSessionToken'
import DataErrorState from '@/components/ui/DataErrorState'
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
			<div className='zeno-page'>
				<div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
					<DataErrorState
						eyebrow={t('errorEyebrow')}
						title={t('loadErrorTitle')}
						description={t('loadErrorDescription')}
						actionLabel={t('retry')}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className='zeno-page'>
			<div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
				<ReportForm
					times={timesRes.times}
					defaultTime={timesRes.defaultTime}
					submitted={timesRes.submitted}
					submittedTime={timesRes.submittedTime}
				/>
			</div>
		</div>
	)
}

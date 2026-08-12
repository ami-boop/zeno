import ReportForm from '@/components/report/ReportForm'
import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

export default async function ReportPage() {
	const sessionToken = await getSessionToken()

	let timesRes: {
		times?: string[]
		defaultTime?: string | null
		submited?: boolean
		submitted?: boolean
		submittedTime?: string | null
	} = {}

	try {
		const response = await fetch(`${API_URL}/report-time`, {
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${sessionToken ?? ''}`,
			},
			cache: 'no-store',
		})

		if (response.ok) timesRes = await response.json()
	} catch {
		timesRes = {}
	}

	const times = timesRes.times ?? []
	const submitted = timesRes.submitted ?? timesRes.submited ?? false

	return (
		<div className='min-h-screen bg-[#f5f7f8]'>
			<div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8'>
				<ReportForm
					times={times}
					defaultTime={timesRes.defaultTime ?? null}
					submitted={submitted}
					submittedTime={timesRes.submittedTime ?? null}
				/>
			</div>
		</div>
	)
}

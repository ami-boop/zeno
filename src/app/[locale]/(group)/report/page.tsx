import ReportForm from '@/components/report/ReportForm'
import { getSessionToken } from '@/utils/getSessionToken'

export default async function ReportPage() {
	const sessionToken = await getSessionToken()

	const timesRes = await fetch(
		'https://getreporttime-ag7er5qhga-ew.a.run.app',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${sessionToken}`,
			},
			cache: 'force-cache',
		}
	).then(res => res.json())

	const times = timesRes.times
	const submited = timesRes.submited

	//TODO: Сделать чтобы нельзя было репортнуть после 17:00

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<ReportForm times={times} submited={submited} />
				</div>
			</div>
		</div>
	)
}

import ReportForm from '@/components/report/ReportForm'

export default async function ReportPage() {
	const times = await fetch('https://getreporttime-ag7er5qhga-ew.a.run.app', {
		cache: 'force-cache',
	})
		.then(res => res.json())
		.then(data => data.times || [])

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<ReportForm times={times} />
				</div>
			</div>
		</div>
	)
}

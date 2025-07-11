import ReportForm from '@/components/report/ReportForm'

interface ReportPageProps {
	params: { locale: string }
}

export default async function ReportPage({ params }: ReportPageProps) {
	// SSR данные (можно заменить на реальные)
	const studentId = '12345'

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<ReportForm studentId={studentId} />
				</div>
			</div>
		</div>
	)
}

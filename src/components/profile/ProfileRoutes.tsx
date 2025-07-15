import { Bus } from 'lucide-react'
import React from 'react'

interface ProfileRoutesProps {
	routes: {
		id: string
		title: string
		description: string
		time: string
		driver: string
		busNumber: string
		status: string
		nextArrival: string
		stops: number
	}[]
	t: (key: string) => string
}

function getRouteStatusColor(status: string) {
	return status === 'On Schedule'
		? 'bg-green-50 text-green-800 border-green-200'
		: 'bg-amber-50 text-amber-800 border-amber-200'
}

export default React.memo(function ProfileRoutes({
	routes,
	t,
}: ProfileRoutesProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900 flex items-center'>
					<Bus className='w-5 h-5 mr-2 text-blue-600' />
					{t('Bus Routes')}
				</h2>
			</div>
			<div className='p-6 space-y-6'>
				{routes.map(route => (
					<div
						key={route.id}
						className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200'
					>
						<div className='flex items-center justify-between mb-4'>
							<div>
								<h3 className='font-medium text-gray-900'>{route.title}</h3>
								<p className='text-sm text-gray-500'>{route.description}</p>
							</div>
							<div
								className={`px-3 py-1 rounded-full text-xs font-medium border ${getRouteStatusColor(
									route.status
								)}`}
							>
								{route.status}
							</div>
						</div>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
							<div>
								<span className='text-gray-500 block'>{t('Departure')}</span>
								<span className='font-medium text-gray-900'>{route.time}</span>
							</div>
							<div>
								<span className='text-gray-500 block'>{t('Next Bus')}</span>
								<span className='font-medium text-gray-900'>
									{route.nextArrival}
								</span>
							</div>
							<div>
								<span className='text-gray-500 block'>{t('Driver')}</span>
								<span className='font-medium text-gray-900'>
									{route.driver}
								</span>
							</div>
							<div>
								<span className='text-gray-500 block'>{t('Vehicle')}</span>
								<span className='font-medium text-gray-900'>
									{route.busNumber}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
})

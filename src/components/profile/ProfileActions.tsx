import { Bell, MapPin, Clock } from 'lucide-react'

interface ProfileActionsProps {
	t: (key: string) => string
}

export default function ProfileActions({ t }: ProfileActionsProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900'>
					{t('Quick Actions')}
				</h2>
			</div>
			<div className='p-6 space-y-3'>
				<button className='w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200'>
					<Bell className='w-4 h-4 mr-2' />
					{t('Report Emergency')}
				</button>
				<button className='w-full flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200'>
					<MapPin className='w-4 h-4 mr-2' />
					{t('Track Bus Location')}
				</button>
				<button className='w-full flex items-center justify-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200'>
					<Clock className='w-4 h-4 mr-2' />
					{t('View Schedule History')}
				</button>
			</div>
		</div>
	)
}

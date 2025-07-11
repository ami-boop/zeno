'use client'

import { Bell, MapPin, Clock, Settings } from 'lucide-react'
import CustomSwitch from '@/components/CustomSwitch'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface ProfileNotificationsProps {
	settings: {
		busArrival: boolean
		routeChanges: boolean
		emergencyAlerts: boolean
		scheduleUpdates: boolean
	}
}

const notificationList = [
	{
		key: 'busArrival',
		icon: Bell,
		label: 'Bus Arrival Alerts',
		description: 'Get notified when the bus is approaching',
	},
	{
		key: 'routeChanges',
		icon: MapPin,
		label: 'Route Changes',
		description: 'Alerts about route modifications or delays',
	},
	{
		key: 'emergencyAlerts',
		icon: Bell,
		label: 'Emergency Alerts',
		description: 'Important safety and emergency notifications',
	},
	{
		key: 'scheduleUpdates',
		icon: Clock,
		label: 'Schedule Updates',
		description: 'Changes to pickup and drop-off times',
	},
]

export default function ProfileNotifications({
	settings,
}: ProfileNotificationsProps) {
	const t = useTranslations('Profile')
	const [switches, setSwitches] = useState(settings)

	const handleSwitch = (key: keyof typeof switches) => (checked: boolean) => {
		setSwitches(prev => ({ ...prev, [key]: checked }))
	}

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900 flex items-center'>
					<Settings className='w-5 h-5 mr-2 text-blue-600' />
					{t('Notification Settings')}
				</h2>
			</div>
			<div className='p-6 space-y-4'>
				{notificationList.map(setting => {
					const Icon = setting.icon
					return (
						<div
							key={setting.key}
							className='flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200'
						>
							<div className='flex items-center space-x-3'>
								<div className='w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center'>
									<Icon className='w-5 h-5 text-blue-600' />
								</div>
								<div>
									<h4 className='font-medium text-gray-900'>
										{t(setting.label)}
									</h4>
									<p className='text-sm text-gray-500'>{setting.description}</p>
								</div>
							</div>
							<CustomSwitch />
						</div>
					)
				})}
			</div>
		</div>
	)
}

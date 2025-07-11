import { getTranslations } from 'next-intl/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileStats from '@/components/profile/ProfileStats'
import ProfileRoutes from '@/components/profile/ProfileRoutes'
import ProfileNotifications from '@/components/profile/ProfileNotifications'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import ProfileAddress from '@/components/profile/ProfileAddress'

// Типы для пользователя
interface UserProfile {
	name: string
	class: string
	studentId: string
	schoolYear: string
	address: string
	avatar: string
}

interface BusRoute {
	id: string
	title: string
	description: string
	time: string
	driver: string
	busNumber: string
	status: string
	nextArrival: string
	stops: number
}

interface Contact {
	id: string
	name: string
	relationship: string
	phone: string
	email: string
	isPrimary: boolean
}

interface NotificationSettings {
	busArrival: boolean
	routeChanges: boolean
	emergencyAlerts: boolean
	scheduleUpdates: boolean
}

export default async function StudentProfilePage() {
	const t = await getTranslations('Profile')

	// Моковые данные (SSR)
	const user: UserProfile = {
		name: 'Sophia Clark',
		class: 'Grade 5A',
		studentId: 'SC-2024-0156',
		schoolYear: '2024-2025',
		address: '1234 Maple Street, Springfield, IL 62701',
		avatar:
			'https://lh3.googleusercontent.com/aida-public/AB6AXuAlDd7Jf0oa8yFQPFC2DnDEv13GLgGd4YkbzqtiDg3bUm6JQfIU9MkvOfCBccgdXmNX8WWQNmpjjkycZw458t0VEUqIkwtaRmKJQg2KwGIyOXY11-wv5rxnu9nx-iIaTC2OS0iumInE1pSQRkT36fhna4uuv0Rq3rMnt1uHNNMyWggFWUmWMjTtiBldG2LUkKdr8KQb28pJBuCBJq5Wr1E2vfTEsffKS-5mqC5JYuEtsBgMxfv9J6-jDDnnXQ-LlYaf_YP8L8QEqpTP',
	}

	const busRoutes: BusRoute[] = [
		{
			id: '1',
			title: t('To School'),
			description: 'Route 123 - Morning Route',
			time: '7:30 AM',
			driver: 'Michael Johnson',
			busNumber: 'Bus #42',
			status: t('On Schedule'),
			nextArrival: '15 min',
			stops: 8,
		},
		{
			id: '2',
			title: t('From School'),
			description: 'Route 456 - Afternoon Route',
			time: '3:30 PM',
			driver: 'Sarah Williams',
			busNumber: 'Bus #38',
			status: t('On Schedule'),
			nextArrival: '4h 15min',
			stops: 6,
		},
	]

	const contacts: Contact[] = [
		{
			id: '1',
			name: 'Ethan Clark',
			relationship: t('Father'),
			phone: '+1 (555) 123-4567',
			email: 'ethan.clark@email.com',
			isPrimary: true,
		},
		{
			id: '2',
			name: 'Olivia Clark',
			relationship: t('Mother'),
			phone: '+1 (555) 987-6543',
			email: 'olivia.clark@email.com',
			isPrimary: false,
		},
	]

	// SSR: notification settings по умолчанию
	const notificationSettings: NotificationSettings = {
		busArrival: true,
		routeChanges: false,
		emergencyAlerts: true,
		scheduleUpdates: false,
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader user={user} t={t} />
				<ProfileStats t={t} />
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					<div className='lg:col-span-2 space-y-8'>
						<ProfileRoutes routes={busRoutes} t={t} />
						<ProfileNotifications settings={notificationSettings} />
					</div>
					<div className='space-y-8'>
						<ProfileContacts contacts={contacts} t={t} />
						<ProfileActions t={t} />
						<ProfileAddress address={user.address} t={t} />
					</div>
				</div>
			</div>
		</div>
	)
}

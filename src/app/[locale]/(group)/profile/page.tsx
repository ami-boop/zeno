import { getTranslations } from 'next-intl/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'

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

	// Новые данные для транспорта
	const transportInfo = {
		byBus: true, // или false
		time: '12:45',
		stop: 'Main School Stop',
		class: user.class,
		route: 'A', // добавлено для соответствия типу
		parents: [
			{
				name: 'Ethan Clark',
				phone: '+1 (555) 123-4567',
				email: 'ethan.clark@email.com',
			},
			{
				name: 'Olivia Clark',
				phone: '+1 (555) 987-6543',
				email: 'olivia.clark@email.com',
			},
		],
	}

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

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader user={user} />
				<div className='flex flex-col lg:flex-row gap-8 mt-8'>
					<div className='flex-1'>
						<ProfileTransportInfo info={transportInfo} t={t} />
					</div>
					<div className='flex flex-col gap-8 w-full lg:w-80'>
						<ProfileContacts contacts={contacts} t={t} />
						<ProfileActions t={t} />
					</div>
				</div>
			</div>
		</div>
	)
}

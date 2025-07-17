import { getTranslations } from 'next-intl/server'
import { adminAuth } from '@/lib/firebase-admin'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import getServerSideUid from '@/utils/getServerSideUid'

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

	const transportInfo = {
		name: 'Sophia Clark',
		byBus: true, // или false
		time: '12:45',
		stop: 'Main School Stop',
		class: 'Grade 5A',
		route: 'A', // добавлено для соответствия типу
		parents: [
			{
				name: 'Ethan Clark',
				phone: '+1 (555) 123-4567',
				email: 'ethan.clark@email.com',
				relationship: 'father',
				isPrimary: true,
			},
			{
				name: 'Olivia Clark',
				phone: '+1 (555) 987-6543',
				email: 'olivia.clark@email.com',
				relationship: 'mother',
				isPrimary: false,
			},
		],
	}

	const uid = await getServerSideUid(adminAuth)

	const student = await fetch(
		`https://getstudentinfo-ag7er5qhga-ew.a.run.app?uid=${encodeURIComponent(
			uid
		)}`,
		{ cache: 'no-store' }
	).then(res => res.json())

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader name={student.name} />
				<div className='flex flex-col lg:flex-row gap-8 mt-8'>
					<div className='flex-1'>
						<ProfileTransportInfo info={student} t={t} />
					</div>
					<div className='flex flex-col gap-8 w-full lg:w-80'>
						<ProfileContacts contacts={student.parents} t={t} />
						<ProfileActions t={t} />
					</div>
				</div>
			</div>
		</div>
	)
}

import { getTranslations } from 'next-intl/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import { getSessionToken } from '@/utils/getSessionToken'
import { API_URL } from '@/constants'

// Тип для Contact (примерная структура)
type Contact = {
	name: string
	phone: string
	relationship: string
	email: string
	isPrimary: boolean
}

// Тип для student (расширенный, чтобы покрыть все используемые поля)
type Student = {
	name: string
	email: string
	phone: string
	status: Record<string, string>
	byBus: boolean
	time: string
	stop: string
	class: string
	route: string
	parents: Contact[]
}

export default async function StudentProfilePage() {
	const t = await getTranslations('Profile')
	const session = await getSessionToken()

	const students: Student = await fetch(
		`${API_URL}/students`,
		{
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${session}`,
			},
			cache: 'force-cache',
		}
	).then(res => res.json())

	students.parents.forEach(parent => {
		parent.relationship = t(parent.relationship)
	})

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader studentName={students.name} />
				<div className='flex flex-col lg:flex-row gap-8 mt-8'>
					<div className='flex-1'>
						<ProfileTransportInfo
							info={students}
							t={[
								t('busYes'),
								t('busNo'),
								t('Parent/Guardian Contact'),
								t('noContactsAvailable'),
							]}
						/>
					</div>
					<div className='flex flex-col gap-8 w-full lg:w-80'>
						<ProfileContacts
							contacts={students.parents}
							t={[
								t('Parent/Guardian Contact'),
								t('noContacts'),
								t('noContactsDescription'),
								t('primary'),
							]}
						/>
						<ProfileActions
							t={[
								t('Report Emergency'),
								t('View Schedule'),
								t('Quick Actions'),
							]}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

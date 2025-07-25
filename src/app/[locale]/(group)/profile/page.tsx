import { getTranslations } from 'next-intl/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import { getSessionToken } from '@/utils/getSessionToken'

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

	const student: Student = await fetch(
		'https://getstudentinfo-ag7er5qhga-ew.a.run.app',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: `sessionCookie=${session}`,
			},
			cache: 'force-cache',
		}
	).then(res => res.json())

	student.parents.forEach(parent => {
		parent.relationship = t(parent.relationship)
	})

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader name={student.name} />
				<div className='flex flex-col lg:flex-row gap-8 mt-8'>
					<div className='flex-1'>
						<ProfileTransportInfo
							info={student}
							t={[t('busYes'), t('busNo'), t('Parent/Guardian Contact')]}
						/>
					</div>
					<div className='flex flex-col gap-8 w-full lg:w-80'>
						<ProfileContacts
							contacts={student.parents}
							t={[t('Parent/Guardian Contact')]}
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

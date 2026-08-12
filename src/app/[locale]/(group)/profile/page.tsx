import { getTranslations } from 'next-intl/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import { getSessionToken } from '@/utils/getSessionToken'
import { fetchStudentProfile } from '@/lib/student-profile'

export default async function StudentProfilePage() {
	const t = await getTranslations('Profile')
	const session = await getSessionToken()
	const student = await fetchStudentProfile(session)

	if (!student) {
		return (
			<div className='min-h-screen bg-[#f5f7f8]'>
				<div className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
					<div role='alert' className='rounded-3xl border border-gray-200 bg-white p-8 shadow-sm'>
						<h1 className='text-2xl font-bold text-gray-900'>
							{t('Student Profile')}
						</h1>
						<p className='mt-2 text-gray-500'>{t('noContacts')}</p>
						<p className='mt-1 text-sm text-gray-400'>
							{t('profileLoadError')}
						</p>
					</div>
				</div>
			</div>
		)
	}

	const parents = student.parents.map(parent => ({
		...parent,
		relationship: ['mother', 'father'].includes(parent.relationship)
			? t(parent.relationship)
			: parent.relationship,
	}))

	return (
		<div className='min-h-screen bg-[#f5f7f8]'>
			<main className='mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8'>
				<ProfileHeader studentName={student.name} />
				<div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]'>
					<section className='min-w-0'>
						<ProfileTransportInfo
							info={student}
							t={[
								t('transportTitle'),
								t('busYes'),
								t('busNo'),
								t('statusNoBusHint'),
								t('statusBusHint'),
								t('classLabel'),
								t('routeLabel'),
								t('stopLabel'),
								t('timeLabel'),
								t('statusOn'),
								t('statusOff'),
							]}
						/>
					</section>
					<aside className='flex min-w-0 flex-col gap-6'>
						<ProfileContacts
							contacts={parents}
							t={[
								t('Parent/Guardian Contact'),
								t('contactHint'),
								t('noContacts'),
								t('noContactsDescription'),
								t('primary'),
							]}
						/>
						<ProfileActions
							t={[
								t('Quick Actions'),
								t('actionsHint'),
								t('updatePlan'),
								t('View Schedule'),
							]}
						/>
					</aside>
				</div>
			</main>
		</div>
	)
}

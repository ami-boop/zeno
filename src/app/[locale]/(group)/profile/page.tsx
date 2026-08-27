import ProfileHeader from '@/components/profile/ProfileHeader'
import ProfileTransportInfo from '@/components/profile/ProfileTransportInfo'
import ProfileContacts from '@/components/profile/ProfileContacts'
import ProfileActions from '@/components/profile/ProfileActions'
import DataErrorState from '@/components/ui/DataErrorState'
import PageShell from '@/components/ui/PageShell'
import { getTranslations } from 'next-intl/server'
import { getSessionToken } from '@/utils/getSessionToken'
import { fetchStudentProfile } from '@/lib/api/student-profile'

export default async function StudentProfilePage() {
	const t = await getTranslations('Profile')
	const token = await getSessionToken()
	const student = await fetchStudentProfile(token)

	if (!student) {
		return (
			<PageShell width='lg'>
				<DataErrorState
					eyebrow={t('errorEyebrow')}
					title={t('loadErrorTitle')}
					description={t('loadErrorDescription')}
					actionLabel={t('retry')}
				/>
			</PageShell>
		)
	}

	const parents = student.parents.map(parent => ({
		...parent,
		relationship: ['mother', 'father'].includes(parent.relationship)
			? t(parent.relationship)
			: parent.relationship,
	}))

	return (
		<PageShell width='lg'>
			<ProfileHeader studentName={student.name} />
			<div className='mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.75fr)]'>
				<section className='min-w-0'>
					<ProfileTransportInfo info={student} />
				</section>
				<aside className='flex min-w-0 flex-col gap-6'>
					<ProfileContacts contacts={parents} />
					<ProfileActions />
				</aside>
			</div>
		</PageShell>
	)
}

import { redirect } from 'next/navigation'
import ParentHeader from '@/components/parent/ParentHeader'
import { getUserRole } from '@/utils/auth-roles'

export default async function ParentAreaLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const role = await getUserRole()
	if (role !== 'parent') {
		redirect(`/${locale}/dashboard`)
	}

	return (
		<>
			<ParentHeader />
			{children}
		</>
	)
}

import Header from '@/components/Header'
import PageTransition from '@/components/PageTransition'
import React from 'react'
import { redirect } from 'next/navigation'
import { getUserRole } from '@/utils/auth-roles'

export default async function StudentGroupLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	const role = await getUserRole()
	if (role === 'parent') {
		redirect(`/${locale}/parent/dashboard`)
	}

	return (
		<>
			<Header />
			<PageTransition>{children}</PageTransition>
		</>
	)
}

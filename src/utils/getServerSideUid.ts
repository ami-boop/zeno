import { cookies } from 'next/headers'

export default async function getServerSideUid(adminAuth: any) {
	const cookieStore = await cookies()
	const idToken = cookieStore.get('idToken')?.value
	if (!idToken) throw new Error('No idToken')

	const decoded = await adminAuth.verifyIdToken(idToken)
	return decoded.uid
}

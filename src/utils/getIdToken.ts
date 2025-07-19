import { cookies } from 'next/headers'

export async function getIdToken() {
	const cookieStore = await cookies()
	return cookieStore.get('idToken')?.value
}

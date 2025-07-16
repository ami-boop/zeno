import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import type { User } from 'firebase/auth'

export function useCurrentUser() {
	const [user, setUser] = useState<User | null | undefined>(undefined)
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(setUser)
		return unsubscribe
	}, [])
	return user
}

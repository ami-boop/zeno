'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function useIsAuthenticated() {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, user => {
			setIsAuthenticated(!!user)
		})
		return () => unsubscribe()
	}, [])

	return isAuthenticated ? (
		<div className='flex justify-center items-center h-screen'>Auth</div>
	) : (
		<div className='flex justify-center items-center h-screen'>no Auth</div>
	) // true, false, или null (ещё не определено)
}

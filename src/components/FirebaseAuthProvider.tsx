'use client'

import { useEffect } from 'react'
import { setupIdTokenAutoRefresh } from '@/lib/firebase'

declare global {
	interface Window {
		__idTokenAutoRefresh?: boolean
	}
}

export default function FirebaseAuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	useEffect(() => {
		if (typeof window !== 'undefined' && !window.__idTokenAutoRefresh) {
			setupIdTokenAutoRefresh()
			window.__idTokenAutoRefresh = true
		}
	}, [])

	return <>{children}</>
}

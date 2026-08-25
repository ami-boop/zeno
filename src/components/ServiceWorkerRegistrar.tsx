'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistrar() {
	useEffect(() => {
		if (!('serviceWorker' in navigator)) return

		const register = () => {
			navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch(() => {})
		}

		if (document.readyState === 'complete') {
			register()
		} else {
			window.addEventListener('load', register, { once: true })
			return () => window.removeEventListener('load', register)
		}
	}, [])

	return null
}

export async function ensureServiceWorkerReady(): Promise<boolean> {
	if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return false
	try {
		await navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
		const reg = await navigator.serviceWorker.ready
		return !!reg.active
	} catch {
		return false
	}
}

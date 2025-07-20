// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

let isSubscribed = false

export function setupIdTokenAutoRefresh() {
	if (isSubscribed) return
	isSubscribed = true

	const checkExistingCookie = async () => {
		try {
			const user = auth.currentUser
			if (user) {
				const idToken = await user.getIdToken(true) // Принудительно обновляем токен
				const lastIdToken = localStorage.getItem('lT')
				if (idToken !== lastIdToken) {
					localStorage.setItem('lT', idToken)
					console.log('setToken called on init', new Date().toISOString())
					await fetch('/api/setToken', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ idToken }),
						credentials: 'include',
					})
				}
			}
		} catch (error) {
			console.error('Error checking existing cookie:', error)
		}
	}

	checkExistingCookie()

	auth.onIdTokenChanged(async user => {
		try {
			if (user) {
				const idToken = await user.getIdToken()
				const lastIdToken = localStorage.getItem('lT')
				if (idToken !== lastIdToken) {
					localStorage.setItem('lT', idToken)
					console.log('setToken called', new Date().toISOString())
					await fetch('/api/setToken', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ idToken }),
						credentials: 'include',
					})
				}
			} else {
				localStorage.removeItem('lT')
			}
		} catch (error) {
			console.error('Error in onIdTokenChanged:', error)
		}
	})
}

'use server'

import { API_URL } from '@/constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export interface LoginFormState {
	error?: string
	success?: boolean
}

const VERIFY_USER_ROLE_URL =
	process.env.NEXT_PUBLIC_VERIFY_USER_ROLE_URL ||
	'https://verifyuserrole-ag7er5qhga-ew.a.run.app'

export async function loginAction(idToken: string): Promise<LoginFormState> {
	try {
		const userCheckRes = await fetch(VERIFY_USER_ROLE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`,
			},
		})

		const userCheckResult = await userCheckRes.json()

		if (!userCheckRes.ok) {
			if (userCheckResult.accessDenied) {
				return { error: 'accessDenied' }
			}
			return { error: 'genericError' }
		}

		const setTokenRes = await fetch(`${API_URL}/auth/session`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`,
			},
		})

		if (!setTokenRes.ok) {
			return { error: 'Failed to create session' }
		}

		const tokenResult = await setTokenRes.json()
		const cookieStore = await cookies()

		if (tokenResult.sessionCookie) {
			cookieStore.set('sessionCookie', tokenResult.sessionCookie, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: Math.floor(tokenResult.expiresIn / 1000),
				path: '/',
			})
		}

		redirect('/dashboard')
	} catch (error: unknown) {
		const err = error as { code?: string }
		switch (err.code) {
			case 'auth/user-not-found':
				return { error: 'userNotFound' }
			case 'auth/wrong-password':
				return { error: 'wrongPassword' }
			case 'auth/invalid-credential':
				return { error: 'invalidCredential' }
			case 'auth/invalid-email':
				return { error: 'invalidEmail' }
			case 'auth/too-many-requests':
				return { error: 'tooManyRequests' }
			case 'auth/user-disabled':
				return { error: 'userDisabled' }
			default:
				return { error: 'genericError' }
		}
	}
}

'use server'

import { parseFriendStudentsPage, type FriendStudent } from '@/lib/api-contracts'
import { API_URL } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'

export type FriendStudentsResult = {
	students: FriendStudent[]
	total: number
	error: boolean
}

const DEFAULT_LIMIT = 20

export async function getFriendStudents(q: string, offset = 0, limit = DEFAULT_LIMIT): Promise<FriendStudentsResult> {
	const token = await getSessionToken()
	if (!token) return { students: [], total: 0, error: true }

	const params = new URLSearchParams()
	const query = q.trim()
	if (query) params.set('q', query)
	params.set('offset', String(offset))
	params.set('limit', String(limit))

	try {
		const response = await fetch(`${API_URL}/friend-students?${params.toString()}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			cache: 'no-store',
		})
		if (!response.ok) return { students: [], total: 0, error: true }

		const page = parseFriendStudentsPage(await response.json())
		if (!page) return { students: [], total: 0, error: true }

		return {
			students: page.students,
			total: page.total,
			error: false,
		}
	} catch {
		return { students: [], total: 0, error: true }
	}
}

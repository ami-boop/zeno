'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { loadFriendStudentsPage, type FriendStudentsPage } from '@/lib/api/student-directory'

export type FriendStudentsResult = {
	students: FriendStudentsPage['students']
	total: number
	error: boolean
}

const DEFAULT_LIMIT = 20

const FAILED: FriendStudentsResult = { students: [], total: 0, error: true }

export async function getFriendStudents(q: string, offset = 0, limit = DEFAULT_LIMIT): Promise<FriendStudentsResult> {
	const token = await getSessionToken()
	if (!token) return FAILED

	try {
		const page = await loadFriendStudentsPage(token, q, offset, limit)
		if (!page) return FAILED

		return { students: page.students, total: page.total, error: false }
	} catch {
		return FAILED
	}
}

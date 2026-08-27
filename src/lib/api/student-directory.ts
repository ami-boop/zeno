import { parseFriendStudentsPage, type FriendStudent } from '@/lib/api-contracts'
import { apiGet } from './client'

export type FriendStudentsPage = {
	students: FriendStudent[]
	total: number
}

export async function loadFriendStudentsPage(
	token: string,
	q: string,
	offset: number,
	limit: number,
): Promise<FriendStudentsPage | null> {
	const query = q.trim()
	const payload = await apiGet('students/friends', token, {
		params: { q: query || undefined, offset, limit },
	})
	return parseFriendStudentsPage(payload)
}

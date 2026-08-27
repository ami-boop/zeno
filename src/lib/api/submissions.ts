import { apiPost } from './client'

export type PostResult = { ok: boolean; status: number; data: unknown | null }

export async function postFeedback(token: string, question: string): Promise<PostResult> {
	return apiPost('feedback/', token, { question })
}

export const MAX_NOTE_LENGTH = 200

export async function postReturnStatus(
	token: string,
	body: Record<string, unknown>,
): Promise<PostResult> {
	const note = typeof body.note === 'string' ? body.note.slice(0, MAX_NOTE_LENGTH) : body.note
	return apiPost('return-status/', token, { ...body, note })
}

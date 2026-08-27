'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getFriendStudents } from '@/app/actions/student-directory'
import type { FriendStudent } from '@/lib/api-contracts'

const SEARCH_DEBOUNCE_MS = 300

export type FriendStudentsPicker = {
	query: string
	setQuery: (value: string) => void
	students: FriendStudent[]
	total: number
	loading: boolean
	error: boolean
	canLoadMore: boolean
	loadMore: () => void
	reset: () => void
}

// Управляет серверным поиском учеников: пустой запрос грузит первую страницу
// сразу, непустой — с дебаунсом. Ответы нумеруются, чтобы устаревший ответ
// не перезаписал свежий.
export function useFriendStudents(enabled: boolean): FriendStudentsPicker {
	const [query, setQuery] = useState('')
	const [students, setStudents] = useState<FriendStudent[]>([])
	const [total, setTotal] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const requestSeq = useRef(0)

	const fetchPage = useCallback(async (q: string, offset: number) => {
		const seq = ++requestSeq.current
		setLoading(true)
		const result = await getFriendStudents(q, offset)
		if (seq !== requestSeq.current) return
		setLoading(false)
		if (result.error) {
			setError(true)
			return
		}
		setError(false)
		setTotal(result.total)
		setStudents((prev) => (offset === 0 ? result.students : [...prev, ...result.students]))
	}, [])

	useEffect(() => {
		if (!enabled) return
		const q = query.trim()
		if (!q) {
			fetchPage('', 0)
			return
		}
		const handle = window.setTimeout(() => fetchPage(q, 0), SEARCH_DEBOUNCE_MS)
		return () => window.clearTimeout(handle)
	}, [enabled, query, fetchPage])

	const loadMore = useCallback(() => {
		if (loading) return
		fetchPage(query.trim(), students.length)
	}, [fetchPage, loading, query, students.length])

	const reset = useCallback(() => {
		requestSeq.current += 1
		setQuery('')
		setStudents([])
		setTotal(0)
		setLoading(false)
		setError(false)
	}, [])

	return {
		query,
		setQuery,
		students,
		total,
		loading,
		error,
		canLoadMore: students.length < total && !loading,
		loadMore,
		reset,
	}
}

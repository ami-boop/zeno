import { parseBusTracking, type BusTracking } from '@/lib/api-contracts'
import { apiGet } from './client'

export async function loadBusTracking(token: string | undefined): Promise<BusTracking | null> {
	if (!token) return null

	try {
		const payload = await apiGet('bus-tracking', token)
		return parseBusTracking(payload)
	} catch {
		return null
	}
}

'use server'

import { getSessionToken } from '@/utils/getSessionToken'
import { loadBusTracking } from '@/lib/api/bus-tracking'
import type { BusTracking } from '@/lib/api-contracts'

export async function fetchBusTracking(): Promise<BusTracking | null> {
	const token = await getSessionToken()
	return loadBusTracking(token)
}

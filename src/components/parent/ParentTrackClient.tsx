'use client'

import { motion } from 'framer-motion'
import type { BusTracking } from '@/lib/api-contracts'
import { useChildTrackingPoll } from '@/hooks/useChildTrackingPoll'
import TrackMap from '../track/TrackMap'
import TripStatusCard from '../track/TripStatusCard'
import DriverCard from '../track/DriverCard'
import StopsList from '../track/StopsList'

type Props = {
	initial: BusTracking | null
	childUid: string
}

export default function ParentTrackClient({ initial, childUid }: Props) {
	const { tracking, updatedAt, clockOffsetMs } = useChildTrackingPoll(initial, childUid)

	if (!tracking) return null

	return (
		<div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
			<div className="flex min-w-0 flex-col gap-6">
				<motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
					<TrackMap tracking={tracking} />
				</motion.div>
				<StopsList
					stops={tracking.stops}
					studentStopId={tracking.studentStopId}
					etas={tracking.etas}
				/>
			</div>

			<aside className="flex min-w-0 flex-col gap-6">
				<TripStatusCard tracking={tracking} updatedAt={updatedAt} clockOffsetMs={clockOffsetMs} />
				<motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4 }}>
					<DriverCard bus={tracking.bus} />
				</motion.div>
			</aside>
		</div>
	)
}

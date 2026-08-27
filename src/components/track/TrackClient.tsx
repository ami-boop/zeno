'use client'

import { motion } from 'framer-motion'
import type { BusTracking } from '@/lib/api-contracts'
import { useTrackingPoll } from '../../hooks/useTrackingPoll'
import TrackMap from './TrackMap'
import TripStatusCard from './TripStatusCard'
import DriverCard from './DriverCard'
import StopsList from './StopsList'

type Props = {
	initial: BusTracking | null
}

export default function TrackClient({ initial }: Props) {
	const { tracking, updatedAt, clockOffsetMs } = useTrackingPoll(initial)

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

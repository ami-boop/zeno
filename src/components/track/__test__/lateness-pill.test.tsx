import { render, screen } from '@testing-library/react'
import TripStatusCard from '../TripStatusCard'
import type { BusTracking } from '@/lib/api-contracts'

jest.mock('next-intl', () => ({
	useTranslations: () => (key: string, vars?: Record<string, unknown>) =>
		vars !== undefined && 'count' in vars ? `${key} ${String(vars.count)}` : key,
	useLocale: () => 'en',
}))

const baseTracking: BusTracking = {
	trip: {
		tripId: '2026-09-30_route_A_1535',
		routeId: 'route_A',
		scheduledTime: '15:35',
		scheduledAtISO: '2026-09-30T12:35:00.000Z',
		status: 'in_transit',
	},
	bus: null,
	stops: [],
	path: null,
	etas: null,
	studentStopId: null,
	latenessMin: null,
	latenessState: null,
	live: null,
	serverTimeISO: '2026-09-30T12:30:00.000Z',
}

describe('TripStatusCard lateness pill', () => {
	it('shows late pill with minutes', () => {
		render(
			<TripStatusCard
				tracking={{ ...baseTracking, latenessMin: 7, latenessState: 'late' }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(screen.getByText('lateBy 7')).toBeInTheDocument()
	})

	it('shows early pill with absolute minutes', () => {
		render(
			<TripStatusCard
				tracking={{ ...baseTracking, latenessMin: -5, latenessState: 'early' }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(screen.getByText('earlyBy 5')).toBeInTheDocument()
	})

	it('shows on-time pill', () => {
		render(
			<TripStatusCard
				tracking={{ ...baseTracking, latenessMin: 1, latenessState: 'on-time' }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(screen.getByText('onTime')).toBeInTheDocument()
	})

	it('renders no pill when backend sends null', () => {
		const { container } = render(
			<TripStatusCard tracking={baseTracking} updatedAt={null} clockOffsetMs={0} />
		)
		expect(container.textContent).not.toContain('lateBy')
		expect(container.textContent).not.toContain('earlyBy')
		expect(container.textContent).not.toContain('onTime')
	})
})

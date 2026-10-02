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

describe('TripStatusCard late-departure badge', () => {
	it('shows departure badge with minutes', () => {
		render(
			<TripStatusCard
				tracking={{ ...baseTracking, lateDepartureMinutes: 7 }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(screen.getByText('lateDeparture 7')).toBeInTheDocument()
	})

	it('hides badge when null', () => {
		const { container } = render(
			<TripStatusCard
				tracking={{ ...baseTracking, lateDepartureMinutes: null }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(container.textContent).not.toContain('lateDeparture')
	})

	it('hides badge when zero', () => {
		const { container } = render(
			<TripStatusCard
				tracking={{ ...baseTracking, lateDepartureMinutes: 0 }}
				updatedAt={null}
				clockOffsetMs={0}
			/>
		)
		expect(container.textContent).not.toContain('lateDeparture')
	})
})

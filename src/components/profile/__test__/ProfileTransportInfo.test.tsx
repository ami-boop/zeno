import { render, screen } from '@testing-library/react'
import ProfileTransportInfo from '../ProfileTransportInfo'
import type { StudentProfile } from '../types'

describe('ProfileTransportInfo', () => {
	const info: StudentProfile = {
		byBus: false,
		classId: 'yud_alef_9',
		name: 'Mikhail Sakhnenko',
		parents: [],
		routeId: 'route_A',
		stopId: 'stop_kfar_tavor',
		time: null,
	}

	const renderProfile = (customInfo = info) => render(<ProfileTransportInfo info={customInfo} />)

	it('renders the current status and profile identifiers', () => {
		renderProfile()

		expect(screen.getByRole('heading', { level: 2, name: 'busNo' })).toBeInTheDocument()
		expect(screen.getByText('statusNoBusHint')).toBeInTheDocument()
		expect(screen.getByText('yud_alef_9')).toBeInTheDocument()
		expect(screen.getByText('route_A')).toBeInTheDocument()
		expect(screen.getByText('stop_kfar_tavor')).toBeInTheDocument()
		expect(screen.getByText('—')).toBeInTheDocument()
	})

	it('renders the bus status and departure time', () => {
		renderProfile({ ...info, byBus: true, time: '15:35' })

		expect(screen.getByRole('heading', { level: 2, name: 'busYes' })).toBeInTheDocument()
		expect(screen.getByText('statusBusHint')).toBeInTheDocument()
		expect(screen.getByText('15:35')).toBeInTheDocument()
		expect(screen.getByText('statusOn')).toBeInTheDocument()
	})

	it('renders all transport icons', () => {
		renderProfile()

		;['bus-icon', 'user-icon', 'route-icon', 'map-pin-icon'].forEach(id =>
			expect(screen.getByTestId(id)).toBeInTheDocument()
		)
	})
})

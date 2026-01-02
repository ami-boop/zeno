import { render, screen } from '@testing-library/react'
import ProfileTransportInfo from '../ProfileTransportInfo'

describe('ProfileTransportInfo', () => {
	const info = {
		byBus: false,
		class: 'yud_alef_9',
		name: 'Mikhail Sakhnenko',
		parents: [
			{
				name: 'Parent First',
				phone: '051-382-3759',
				email: 'parent@gmail.com',
			},
			{
				name: 'Parent Second',
				phone: '052-157-2358',
				email: 'parent2@gmail.com',
			},
		],
		route: 'A',
		stop: 'Kfar tavor',
		time: 'none',
	}

	const t = [
		'BusYes',
		'BusNo',
		'Parent/Guardian Contact',
		'noContactsAvailable',
	]

	const renderProfile = (customInfo = info) =>
		render(<ProfileTransportInfo info={customInfo} t={t} />)

	it('renders student main info', () => {
		renderProfile()
		expect(
			screen.getByRole('heading', { level: 2, name: /BusNo/i })
		).toBeInTheDocument()
		expect(screen.getByText(/yud_alef_9/i)).toBeInTheDocument()
		expect(screen.getByText('A')).toBeInTheDocument()
	})

	it('renders parents information', () => {
		renderProfile()
		const parentHeading = screen.getByText('Parent/Guardian Contact')
		const parentsElements = screen.getAllByRole('listitem')

		expect(parentHeading).toBeInTheDocument()
		expect(parentsElements).toHaveLength(info.parents.length)

		info.parents.forEach((parent, index) => {
			expect(parentsElements[index]).toHaveTextContent(parent.name)
			expect(parentsElements[index]).toHaveTextContent(parent.phone)
			expect(parentsElements[index]).toHaveTextContent(parent.email)
		})
	})

	it('renders all icons', () => {
		renderProfile()
		const icons = ['bus-icon', 'user-icon', 'route-icon', 'users-icon']
		icons.forEach(id => expect(screen.getByTestId(id)).toBeInTheDocument())
	})

	it('shows correct info when byBus is false', () => {
		renderProfile()
		expect(screen.getByTestId('bus-icon')).toHaveClass('text-gray-400')
		expect(screen.queryByTestId('map-pin-icon')).not.toBeInTheDocument()
		expect(screen.queryByText(/kfar tavor/i)).not.toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('BusNo')
	})

	it('shows correct info when byBus is true', () => {
		renderProfile({ ...info, byBus: true })
		expect(screen.getByTestId('bus-icon')).toHaveClass('text-blue-600')
		expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument()
		expect(screen.getByText(/kfar tavor/i)).toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
			'BusYes'
		)
	})

	it('handles empty contacts array', () => {
		renderProfile({ ...info, parents: [] })
		expect(screen.getByText('Parent/Guardian Contact')).toBeInTheDocument()
		expect(screen.getByText('noContactsAvailable')).toBeInTheDocument()
		expect(screen.getByTestId('users-icon')).toBeInTheDocument()
	})
})

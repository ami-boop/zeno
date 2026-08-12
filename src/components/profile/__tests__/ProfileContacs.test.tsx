import { screen, render } from '@testing-library/react'
import ProfileContacts from '../ProfileContacts'

describe('ProfileContacts', () => {
	const parents = [
		{
			name: 'Parent First',
			phone: '051-382-3759',
			relationship: 'father',
			isPrimary: true,
		},
		{
			name: 'Parent Second',
			phone: '052-157-2358',
			relationship: 'mother',
			isPrimary: false,
		},
	]

	const t = [
		'parentGuardianContact',
		'contactHint',
		'noContacts',
		'noContactsDescription',
		'primary',
	]

	it('renders translation correctly', () => {
		render(<ProfileContacts contacts={parents} t={t} />)
		expect(
			screen.getByRole('heading', {
				level: 2,
				name: t[0],
			})
		).toBeInTheDocument()
		expect(screen.getByText(t[1])).toBeInTheDocument()
		expect(screen.queryByText(t[2])).not.toBeInTheDocument()
	})

	it('renders icons correctly', () => {
		render(<ProfileContacts contacts={parents} t={t} />)
		expect(screen.getByTestId('user-icon')).toBeInTheDocument()
		expect(screen.getAllByTestId('phone-icon')).toHaveLength(parents.length)
	})

	it('renders parents information correctly', () => {
		render(<ProfileContacts contacts={parents} t={t} />)
		const parentsElements = screen.getAllByTestId('contacts-div')

		expect(parentsElements).toHaveLength(parents.length)
		parents.forEach((parent, index) => {
			expect(parentsElements[index]).toHaveTextContent(parent.name)
			expect(parentsElements[index]).toHaveTextContent(parent.phone)
			expect(parentsElements[index]).toHaveTextContent(parent.relationship)
			if (index === 0)
				expect(parentsElements[index]).toHaveTextContent('primary')
			else expect(parentsElements[index]).not.toHaveTextContent('primary')
		})
	})

	it('renders phone links correctly', () => {
		render(<ProfileContacts contacts={parents} t={t} />)
		const phoneLinks = screen.getAllByRole('link', {
			name: /051-382-3759|052-157-2358/,
		})
		expect(phoneLinks).toHaveLength(2)
		expect(phoneLinks[0]).toHaveAttribute('href', 'tel:051-382-3759')
		expect(phoneLinks[1]).toHaveAttribute('href', 'tel:052-157-2358')
	})

	it('renders primary badge only for primary contact', () => {
		render(<ProfileContacts contacts={parents} t={t} />)
		const primaryBadges = screen.getAllByText('primary')
		expect(primaryBadges).toHaveLength(1)
	})

	it('handles empty contacts array', () => {
		render(<ProfileContacts contacts={[]} t={t} />)
		expect(screen.queryByTestId('contacts-div')).not.toBeInTheDocument()
		expect(screen.getByTestId('user-icon')).toBeInTheDocument()
		expect(screen.getByText('noContacts')).toBeInTheDocument()
		expect(screen.getByText('noContactsDescription')).toBeInTheDocument()
	})
})

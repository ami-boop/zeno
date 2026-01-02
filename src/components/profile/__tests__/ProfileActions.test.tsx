import { render, screen } from '@testing-library/react'
import ProfileActions from '../ProfileActions'

describe('ProfileActions', () => {
	const t = ['reportEmergency', 'viewSchedule', 'quickActions']

	beforeEach(() => {
		render(<ProfileActions t={t} />)
	})

	it('renders translations correctly', () => {
		expect(screen.getByRole('button', { name: t[0] })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: t[1] })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: t[2] })).toBeInTheDocument()
	})

	it('renders icons correctly', () => {
		expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
		expect(screen.getByTestId('history-icon')).toBeInTheDocument()
	})

	it('renders link correctly', () => {
		const link = screen.getByRole('link', { name: /viewSchedule/i })
		expect(link).toHaveAttribute('href', '/schedule')
	})
})

import { render, screen } from '@testing-library/react'
import ProfileActions from '../ProfileActions'

describe('ProfileActions', () => {
	const t = ['quickActions', 'actionsHint', 'reportEmergency', 'viewSchedule']

	beforeEach(() => {
		render(<ProfileActions t={t} />)
	})

	it('renders the available actions and supporting copy', () => {
		expect(screen.getByRole('heading', { name: t[0] })).toBeInTheDocument()
		expect(screen.getByText(t[1])).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /reportEmergency/i })).toHaveAttribute('href', '/report')
		expect(screen.getByRole('link', { name: /viewSchedule/i })).toHaveAttribute('href', '/schedule')
	})

	it('renders action icons', () => {
		expect(screen.getByTestId('report-icon')).toBeInTheDocument()
		expect(screen.getByTestId('history-icon')).toBeInTheDocument()
	})
})

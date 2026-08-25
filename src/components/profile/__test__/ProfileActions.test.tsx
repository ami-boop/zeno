import { render, screen } from '@testing-library/react'
import ProfileActions from '../ProfileActions'

describe('ProfileActions', () => {
	beforeEach(() => {
		render(<ProfileActions />)
	})

	it('renders the available actions and supporting copy', () => {
		expect(screen.getByRole('heading', { name: 'Quick Actions' })).toBeInTheDocument()
		expect(screen.getByText('actionsHint')).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /updatePlan/i })).toHaveAttribute('href', '/report')
		expect(screen.getByRole('link', { name: /View Schedule/i })).toHaveAttribute('href', '/schedule')
	})

	it('renders action icons', () => {
		expect(screen.getByTestId('report-icon')).toBeInTheDocument()
		expect(screen.getByTestId('history-icon')).toBeInTheDocument()
	})
})

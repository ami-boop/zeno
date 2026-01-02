import { screen, render } from '@testing-library/react'
import SystemStatus from '../SystemStatus'

describe('System Status', () => {
	it('renders correctly', () => {
		render(<SystemStatus />)
		expect(screen.getByText('currentTime')).toBeInTheDocument()
		expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument()
	})
})

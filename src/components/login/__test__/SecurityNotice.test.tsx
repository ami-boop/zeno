import { screen, render } from '@testing-library/react'
import SecurityNotice from '../SecurityNotice'

describe('SecurityNotice', () => {
	it('renders correctly', () => {
		render(<SecurityNotice />)
		expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
		expect(screen.getByText('securityNotice')).toBeInTheDocument()
	})
})

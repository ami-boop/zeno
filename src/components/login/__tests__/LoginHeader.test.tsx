import { screen, render } from '@testing-library/react'
import LoginHeader from '../LoginHeader'

describe('Login Header', () => {
	it('renders correctly', () => {
		render(<LoginHeader />)
		expect(screen.getByTestId('user-icon')).toBeInTheDocument()
		expect(
			screen.getByRole('heading', { level: 1, name: 'title' })
		).toBeInTheDocument()
		expect(screen.getByText('subtitle')).toBeInTheDocument()
	})
})

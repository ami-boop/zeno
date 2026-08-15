import { screen, render } from '@testing-library/react'
import LoginHeader from '../LoginHeader'

describe('Login Header', () => {
	it('renders correctly', () => {
		render(<LoginHeader />)
		expect(
			screen.getByRole('heading', { level: 1, name: 'title' })
		).toBeInTheDocument()
		expect(screen.queryByText('subtitle')).not.toBeInTheDocument()
	})
})

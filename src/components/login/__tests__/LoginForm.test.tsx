import { screen, render, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import LoginForm from '../LoginForm'

describe('Login Form', () => {
	const isSubmitting = false
	const onSubmit = jest.fn(
		async (email: string, password: string): Promise<void> => {
			return new Promise<void>(resolve => setTimeout(resolve, 100))
		}
	)
	const testEmail = 'testing@test.ru'
	const testPassword = 'ROTATED_SEE_LOCAL_SECRETS'

	it('renders correctly', () => {
		render(<LoginForm isSubmitting={isSubmitting} onSubmit={onSubmit} />)
		expect(screen.getByText('loginLabel')).toBeInTheDocument()
		expect(screen.getByPlaceholderText('loginPlaceholder')).toBeInTheDocument()
		expect(screen.getByText('passwordLabel')).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText('passwordPlaceholder')
		).toBeInTheDocument()
		expect(screen.getByPlaceholderText('passwordPlaceholder')).toHaveAttribute(
			'type',
			'password'
		)
		expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
		expect(screen.getByText('signInButton')).toBeInTheDocument()
	})

	it('shows and hides password field correctly', async () => {
		const userEvent = user.setup()
		render(<LoginForm isSubmitting={isSubmitting} onSubmit={onSubmit} />)

		const inputElement = screen.getByPlaceholderText('passwordPlaceholder')
		const buttonElement = screen.getByTestId('password-button')

		await userEvent.click(buttonElement)
		expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument()
		expect(inputElement).toHaveAttribute('type', 'text')
	})

	it('form inputs and buttons work and style correctly', async () => {
		const userEvent = user.setup()
		render(<LoginForm isSubmitting={isSubmitting} onSubmit={onSubmit} />)

		const emailInputElement = screen.getByPlaceholderText('loginPlaceholder')
		const passwordInputElement = screen.getByPlaceholderText(
			'passwordPlaceholder'
		)
		const buttonElement = screen.getByTestId('submit-button')

		expect(buttonElement).toBeDisabled()
		expect(buttonElement).toHaveClass(
			'bg-gray-400 text-white cursor-not-allowed'
		)

		await userEvent.type(emailInputElement, testEmail)
		expect(emailInputElement).toHaveValue(testEmail)
		expect(buttonElement).toBeDisabled()
		expect(buttonElement).toHaveClass(
			'bg-gray-400 text-white cursor-not-allowed'
		)

		await userEvent.type(passwordInputElement, testPassword)
		expect(passwordInputElement).toHaveValue(testPassword)
		expect(buttonElement).toBeEnabled()
		expect(buttonElement).toHaveClass(
			'bg-blue-600 text-white hover:bg-blue-700'
		)
	})

	it('form submit works correctly', async () => {
		const userEvent = user.setup()
		const { rerender } = render(
			<LoginForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
		)

		const emailInputElement = screen.getByPlaceholderText('loginPlaceholder')
		const passwordInputElement = screen.getByPlaceholderText(
			'passwordPlaceholder'
		)
		const buttonElement = screen.getByTestId('submit-button')

		await userEvent.type(emailInputElement, testEmail)
		await userEvent.type(passwordInputElement, testPassword)
		await userEvent.click(buttonElement)

		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalled()
		})

		rerender(<LoginForm onSubmit={onSubmit} isSubmitting={true} />)

		expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
		expect(screen.getByText('signingIn')).toBeInTheDocument()
		expect(buttonElement).toHaveClass(
			'bg-gray-400 text-white cursor-not-allowed'
		)
		expect(buttonElement).toBeDisabled()
	})
})

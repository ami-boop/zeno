import { screen, render, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import ProfileHeader from '../ProfileHeader'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

describe('ProfileHeader', () => {
	const studentName = 'Misha'
	const userEvent = user.setup()

	beforeEach(() => {
		jest.clearAllMocks()
		// Настраиваем только специфичные для теста моки
		;(global.fetch as jest.Mock).mockResolvedValue({ ok: true })
		;(signOut as jest.Mock).mockResolvedValue(undefined)
	})

	it('renders correctly', () => {
		render(<ProfileHeader studentName={studentName} />)

		expect(screen.getByTestId('profile-avatar')).toHaveTextContent('M')
		expect(screen.getByText(studentName)).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
		expect(screen.getByText('profile_subtitle')).toBeInTheDocument()
		expect(screen.getByText('logout')).toBeInTheDocument()
	})

	it('shows loading state when logout button is clicked', async () => {
		// Замедляем мок, чтобы состояние успело обновиться
		;(signOut as jest.Mock).mockImplementation(
			() => new Promise(resolve => setTimeout(resolve, 100))
		)

		render(<ProfileHeader studentName={studentName} />)

		const logoutButton = screen.getByRole('button')
		expect(logoutButton).not.toBeDisabled()
		expect(screen.getByText('logout')).toBeInTheDocument()

		await userEvent.click(logoutButton)

		// Проверяем, что появляется loading состояние
		await waitFor(() => {
			expect(screen.getByText('logout_loading')).toBeInTheDocument()
		})

		expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
	})

	it('calls signOut and logout API on button click', async () => {
		// Создаем мок для этого конкретного теста
		const mockPush = jest.fn()
		const mockRouter = useRouter as jest.MockedFunction<typeof useRouter>
		mockRouter.mockReturnValue({
			push: mockPush,
		} as any)

		render(<ProfileHeader studentName={studentName} />)

		const logoutButton = screen.getByRole('button')
		await userEvent.click(logoutButton)

		// Ждем завершения асинхронных операций
		await waitFor(() => {
			expect(signOut).toHaveBeenCalledTimes(1)
		})

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			})
		})

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith('/en/')
		})
	})

	it('button has correct styling', () => {
		render(<ProfileHeader studentName={studentName} />)

		const logoutButton = screen.getByRole('button')
		expect(logoutButton).toHaveClass(
			'inline-flex',
			'items-center',
			'justify-center',
			'gap-2',
			'rounded-xl',
			'border',
			'border-zeno-line',
			'shadow-sm',
			'bg-zeno-surface',
			'font-semibold'
		)
	})
})

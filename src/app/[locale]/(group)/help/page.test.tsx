import { submitFeedback } from '@/app/actions/feedback'
import { screen, render, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import HelpPage from './page'

jest.mock('@/app/actions/feedback', () => ({
	submitFeedback: jest.fn(),
}))

describe('help page', () => {
	beforeEach(() => {
		localStorage.clear()
		jest.clearAllMocks()
	})

	it('render correcrly', () => {
		const { container } = render(<HelpPage />)
		expect(screen.getByText('help.title')).toBeInTheDocument()
		expect(screen.getByText('help.subtitle')).toBeInTheDocument()
		expect(
			screen.getByRole('heading', { level: 2, name: 'help.faqTitle' })
		).toBeInTheDocument()
		expect(
			screen.getByRole('heading', { level: 2, name: 'help.contactTitle' })
		).toBeInTheDocument()
		expect(container.querySelector('form')).toBeInTheDocument()
		expect(screen.getByText('help.form.submit')).toBeInTheDocument()
	})

	it('renders FAQ Accordion correctly', () => {
		render(<HelpPage />)
		expect(screen.getByTestId('faq-accordion')).toBeInTheDocument()

		expect(screen.getAllByText(/help\.faq\.[1-3]\.q/)).toHaveLength(3)
		expect(screen.getAllByTestId('accordion-content')).toHaveLength(3)
	})

	it('form works correcrly', async () => {
		// Делаем мок асинхронным, чтобы состояние успело обновиться
		;(submitFeedback as jest.Mock).mockImplementation(
			() =>
				new Promise(resolve =>
					setTimeout(() => resolve({ success: true }), 100)
				)
		)

		const { rerender } = render(<HelpPage />)
		const userEvent = user.setup()
		const textAreaElement = screen.getByPlaceholderText('help.form.placeholder')
		const submitButtom = screen.getByRole('button', {
			name: 'help.form.submit',
		})

		await userEvent.type(textAreaElement, 'test')
		expect(textAreaElement).toHaveValue('test')

		await userEvent.click(submitButtom)

		// Ждем обновления состояния submitting
		await waitFor(() => {
			expect(submitButtom).toHaveTextContent('help.form.submit...')
		})

		// Ждем завершения асинхронной операции
		await waitFor(() => {
			expect(submitFeedback).toHaveBeenCalledTimes(1)
		})

		// Ждем, пока состояние обновится после успешной отправки
		await waitFor(() => {
			expect(screen.getByText('help.form.success')).toBeInTheDocument()
		})

		expect(textAreaElement).toHaveClass('border-[#dbe1e6]')
		expect(textAreaElement).toBeDisabled()
		expect(submitButtom).toBeDisabled()
		expect(screen.queryByTestId('error')).not.toBeInTheDocument()
		expect(screen.getByText(/help.form.wait/i)).toBeInTheDocument()

		rerender(<HelpPage />)

		expect(textAreaElement).toBeDisabled()
		expect(submitButtom).toBeDisabled()
		expect(screen.getByText(/help.form.wait/i)).toBeInTheDocument()
	})

	it('renders error correcrtly', async () => {
		;(submitFeedback as jest.Mock).mockImplementation(
			() =>
				new Promise(resolve =>
					setTimeout(() => resolve({ success: true }), 100)
				)
		)
		render(<HelpPage />)
		const userEvent = user.setup()
		const buttonElement = screen.getByRole('button', {
			name: 'help.form.submit',
		})
		const textAreaElement = screen.getByPlaceholderText('help.form.placeholder')

		await userEvent.click(buttonElement)
		expect(screen.getByTestId('error')).toHaveTextContent('help.form.required')
		expect(textAreaElement).toHaveClass('border-red-300')
		expect(screen.queryByText('help.form.wait')).not.toBeInTheDocument()
	})
})

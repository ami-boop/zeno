import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReportForm from '../ReportForm'
import { submitReturnStatus } from '@/app/actions/return-status'

jest.mock('@/app/actions/return-status', () => ({
	submitReturnStatus: jest.fn(),
}))

describe('ReportForm', () => {
	const renderForm = () =>
		render(
			<ReportForm
				times={['23:59']}
				defaultTime='23:59'
				submitted={false}
				submittedTime={null}
			/>
		)

	beforeEach(() => {
		jest.clearAllMocks()
		;(submitReturnStatus as jest.Mock).mockResolvedValue({ success: true, status: 200 })
	})

	it('keeps the friend option visible but disabled', () => {
		renderForm()

		expect(screen.getByRole('button', { name: /friendOption/i })).toBeDisabled()
		expect(screen.getByText('friendUnavailable')).toBeInTheDocument()
	})

	it('uses the recommended time and submits the v2.1 bus payload', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.click(screen.getByRole('button', { name: /busOption/i }))
		expect(screen.getByRole('button', { name: '23:59' })).toHaveAttribute('aria-pressed', 'true')

		await user.click(screen.getByRole('button', { name: 'submitButton' }))

		expect(submitReturnStatus).toHaveBeenCalledWith({
			byBus: true,
			selectedTime: '23:59',
		})
		expect(await screen.findByText('successTitle')).toBeInTheDocument()
	})

	it('shows the deadline error and does not show success', async () => {
		const user = userEvent.setup()
		;(submitReturnStatus as jest.Mock).mockResolvedValue({ success: false, status: 403 })
		renderForm()

		await user.click(screen.getByRole('button', { name: /busOption/i }))
		await user.click(screen.getByRole('button', { name: 'submitButton' }))

		expect(await screen.findByRole('alert')).toHaveTextContent('deadlineError')
		expect(screen.queryByText('successTitle')).not.toBeInTheDocument()
	})

	it('submits the other-way payload without a departure time', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.click(screen.getByRole('button', { name: /otherOption/i }))
		await user.click(screen.getByRole('button', { name: 'submitButton' }))

		expect(submitReturnStatus).toHaveBeenCalledWith({
			byBus: false,
			selectedTime: '',
		})
	})

	it('blurs and disables departure times that already passed', async () => {
		render(
			<ReportForm
				times={['00:01', '23:59']}
				defaultTime='23:59'
				submitted={false}
				submittedTime={null}
			/>
		)
		const user = userEvent.setup()

		await user.click(screen.getByRole('button', { name: /busOption/i }))

		const pastTime = screen.getByRole('button', { name: /00:01/ })
		expect(pastTime).toBeDisabled()
		expect(pastTime).toHaveClass('blur-[2px]')
	})
})

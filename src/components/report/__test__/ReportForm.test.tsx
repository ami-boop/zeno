import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReportForm from '../ReportForm'
import { getFriendStudents } from '@/app/actions/friend-students'
import { submitReturnStatus } from '@/app/actions/return-status'

jest.mock('@/app/actions/friend-students', () => ({
	getFriendStudents: jest.fn(),
}))

jest.mock('@/app/actions/return-status', () => ({
	submitReturnStatus: jest.fn(),
}))

const FRIENDS = [
	{
		uid: 'friend-1',
		firstName: 'Alex',
		lastName: 'Friend',
		classId: 'yud_alef_1',
		routeId: 'route_friend_other',
		routeName: 'Route B',
		stopId: 'stop_friend',
		stopName: 'Friend Stop',
		sameClass: false,
		sameParallel: false,
	},
]

describe('ReportForm', () => {
	const renderForm = () =>
		render(<ReportForm times={['23:59']} defaultTime="23:59" submitted={false} submittedTime={null} />)

	beforeEach(() => {
		jest.clearAllMocks()
		;(submitReturnStatus as jest.Mock).mockResolvedValue({ success: true, status: 200 })
		;(getFriendStudents as jest.Mock).mockResolvedValue({ students: FRIENDS, total: FRIENDS.length, error: false })
	})

	it('allows selecting a friend and sleepover and submits the friend payload', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.click(screen.getByRole('button', { name: /friendOption/i }))
		await user.click(await screen.findByRole('option', { name: /Alex Friend/ }))

		await user.click(screen.getByRole('button', { name: /sleepoverYes/ }))
		await user.type(screen.getByLabelText('friendNoteLabel'), 'Going to Alex')

		await user.click(screen.getByRole('button', { name: 'submitButton' }))

		expect(submitReturnStatus).toHaveBeenCalledWith({
			byBus: true,
			selectedTime: '23:59',
			friendUid: 'friend-1',
			sleepover: true,
			note: 'Going to Alex',
		})
		expect(await screen.findByText('successTitle')).toBeInTheDocument()
	})

	it('requires a friend and sleepover choice before submitting a friend trip', async () => {
		const user = userEvent.setup()
		renderForm()

		await user.click(screen.getByRole('button', { name: /friendOption/i }))

		expect(screen.getByRole('button', { name: 'submitButton' })).toBeDisabled()

		await user.click(await screen.findByRole('option', { name: /Alex Friend/ }))

		expect(screen.getByRole('button', { name: 'submitButton' })).toBeDisabled()

		await user.click(screen.getByRole('button', { name: /sleepoverNo/ }))

		expect(screen.getByRole('button', { name: 'submitButton' })).toBeEnabled()
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

	it('shows the default time even when it is not in the available times', async () => {
		const user = userEvent.setup()
		render(<ReportForm times={['12:00']} defaultTime="15:35" submitted={false} submittedTime={null} />)

		await user.click(screen.getByRole('button', { name: /busOption/i }))

		expect(screen.getByText('defaultTimeHint: 15:35')).toBeInTheDocument()
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
		render(<ReportForm times={['00:01', '23:59']} defaultTime="23:59" submitted={false} submittedTime={null} />)
		const user = userEvent.setup()

		await user.click(screen.getByRole('button', { name: /busOption/i }))

		const pastTime = screen.getByRole('button', { name: /00:01/ })
		expect(pastTime).toBeDisabled()
		expect(pastTime).toHaveClass('blur-[2px]')
	})
})

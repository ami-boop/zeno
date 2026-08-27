import { classifyRemaining, DEPARTURE_GRACE_MINUTES } from '../trip-time'

const MINUTE = 60_000

describe('classifyRemaining', () => {
	it('counts minutes above one minute', () => {
		expect(classifyRemaining(61_000)).toBe('minutes')
		expect(classifyRemaining(5 * MINUTE)).toBe('minutes')
	})

	it('switches to the last-minute state inside 60 seconds', () => {
		expect(classifyRemaining(MINUTE)).toBe('minutes')
		expect(classifyRemaining(59_999)).toBe('minute')
		expect(classifyRemaining(1)).toBe('minute')
	})

	it('shows departing during the grace window after departure', () => {
		expect(classifyRemaining(0)).toBe('departing')
		expect(classifyRemaining(-1)).toBe('departing')
		expect(classifyRemaining(-(DEPARTURE_GRACE_MINUTES * MINUTE) + 1)).toBe('departing')
	})

	it('marks past exactly when the grace window ends', () => {
		expect(classifyRemaining(-(DEPARTURE_GRACE_MINUTES * MINUTE))).toBe('past')
		expect(classifyRemaining(-10 * MINUTE)).toBe('past')
	})
})

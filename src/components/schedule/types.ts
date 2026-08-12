export type WeekDay = {
	name: string
	key: string
	shortName: string
	index: number
}

export type RouteStop = {
	stopId: string
	order: number
	durationMin: number
}

export type RouteStops = {
	routeId: string
	name: string
	stopsMorning: RouteStop[]
	stopsAfternoon: RouteStop[]
}

export type LessonsSchedule = {
	endTimes: Record<string, string>
}

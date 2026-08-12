export type Parent = {
	name: string
	phone: string
	relationship: string
	isPrimary: boolean
}

export type StudentProfile = {
	name: string
	classId: string | null
	routeId: string | null
	stopId: string | null
	parents: Parent[]
	byBus: boolean
	time: string | null
}

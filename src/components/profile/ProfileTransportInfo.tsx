import { User, Users, MapPin, Bus, Route as RouteIcon } from 'lucide-react'

interface ParentInfo {
	name: string
	phone: string
	email: string
}

interface TransportInfo {
	byBus: boolean
	time: string
	stop: string
	class: string
	route: string
	parents: ParentInfo[]
}

interface Props {
	info: TransportInfo
	t: string[]
}

export default function ProfileTransportInfo({ info, t }: Props) {
	const [busYes, busNo, parentGuardianContact, noContactsAvailable] = t

	return (
		<div className='bg-white rounded-xl shadow-md border border-gray-200 p-8 min-h-[280px] flex flex-col justify-between'>
			<div className='flex items-center gap-3 mb-4'>
				<Bus
					className={`w-7 h-7 ${
						info.byBus ? 'text-blue-600' : 'text-gray-400'
					}`}
					data-testid='bus-icon'
				/>
				<h2 className='text-xl font-bold text-gray-900'>
					{info.byBus ? busYes : busNo}
				</h2>
			</div>
			<div className='flex items-center flex-wrap gap-6'>
				<div className='flex items-center gap-2'>
					<User className='w-5 h-5 text-purple-500' data-testid='user-icon' />
					<span className='text-gray-700 font-medium'>{info.class}</span>
				</div>
				<div className='flex items-center gap-2'>
					<RouteIcon
						className='w-5 h-5 text-blue-500'
						data-testid='route-icon'
					/>
					<span className='text-gray-700 font-medium'>{info.route}</span>
				</div>
				{info.byBus && (
					<div className='flex items-center gap-2'>
						<MapPin
							className='w-5 h-5 text-green-500'
							data-testid='map-pin-icon'
						/>
						<span className='text-gray-700 font-medium'>{info.stop}</span>
					</div>
				)}
			</div>
			<div className='mt-4'>
				<div className='flex items-center gap-2 mb-2'>
					<Users className='w-5 h-5 text-orange-500' data-testid='users-icon' />
					<span className='font-semibold text-gray-800'>
						{parentGuardianContact}
					</span>
				</div>
				<ul className='space-y-1 ml-7'>
					{info.parents && info.parents.length > 0 ? (
						info.parents.map((parent, idx) => (
							<li key={idx} className='text-gray-700'>
								<span className='font-medium'>{parent.name}</span> —{' '}
								{parent.phone}{' '}
								<span className='text-gray-400'>{parent.email}</span>
							</li>
						))
					) : (
						<li className='text-gray-500 italic'>{noContactsAvailable}</li>
					)}
				</ul>
			</div>
		</div>
	)
}

import { AlertTriangle, History } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function ProfileActions({ t }: { t: string[] }) {
	const [reportEmergency, viewSchedule, quickActions] = t

	return (
		<div className='bg-white rounded-xl shadow-md border border-gray-200 p-6'>
			<h3 className='text-lg font-bold text-gray-900 mb-4'>{quickActions}</h3>
			<div className='flex flex-col gap-4'>
				<button className='flex items-center gap-3 px-4 py-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-base transition'>
					<AlertTriangle className='w-6 h-6' />
					{reportEmergency}
				</button>
				<Link href='/schedule'>
					<button className='flex items-center gap-3 px-4 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-base transition'>
						<History className='w-6 h-6' />
						{viewSchedule}
					</button>
				</Link>
			</div>
		</div>
	)
}

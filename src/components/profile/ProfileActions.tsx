import { AlertTriangle, History } from 'lucide-react'
import React from 'react'

interface Props {
	t: any
}

export default function ProfileActions({ t }: Props) {
	return (
		<div className='bg-white rounded-xl shadow-md border border-gray-200 p-6'>
			<h3 className='text-lg font-bold text-gray-900 mb-4'>
				{t('Quick Actions')}
			</h3>
			<div className='flex flex-col gap-4'>
				<button className='flex items-center gap-3 px-4 py-4 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-base transition'>
					<AlertTriangle className='w-6 h-6' />
					{t('Report Emergency')}
				</button>
				<button className='flex items-center gap-3 px-4 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-base transition'>
					<History className='w-6 h-6' />
					{t('View Schedule')}
				</button>
			</div>
		</div>
	)
}

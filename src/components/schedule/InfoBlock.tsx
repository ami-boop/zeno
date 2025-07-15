import React from 'react'
import type { Stop } from '@/types/schedule'
import { useTranslations } from 'next-intl'

interface InfoBlockProps {
	stops: Stop[]
}

export default function InfoBlock({ stops }: InfoBlockProps) {
	const t = useTranslations('Schedule')
	if (!stops.length) return null
	return (
		<div className='mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4'>
			<div className='text-sm text-gray-700 mb-2'>
				{t('totalStops')}: <b>{stops.length}</b>
			</div>
			<div className='flex flex-wrap gap-4'>
				<div>
					<div className='font-medium text-gray-600'>{t('firstStop')}</div>
					<div className='text-gray-900'>{stops[0]?.label}</div>
					{stops[0]?.address && (
						<div className='text-xs text-gray-500'>{stops[0].address}</div>
					)}
					<div className='text-xs text-gray-400'>{stops[0]?.time}</div>
				</div>
				<div>
					<div className='font-medium text-gray-600'>{t('lastStop')}</div>
					<div className='text-gray-900'>{stops[stops.length - 1]?.label}</div>
					{stops[stops.length - 1]?.address && (
						<div className='text-xs text-gray-500'>
							{stops[stops.length - 1].address}
						</div>
					)}
					<div className='text-xs text-gray-400'>
						{stops[stops.length - 1]?.time}
					</div>
				</div>
			</div>
			<div className='font-medium text-gray-600 mb-1'>{t('allStops')}</div>
			<ul className='list-disc pl-5 text-sm text-gray-800'>
				{stops.map((stop, idx) => (
					<li key={idx}>
						<span className='font-semibold'>{stop.label}</span>
						{stop.address && (
							<span className='text-xs text-gray-500 ml-1'>
								({stop.address})
							</span>
						)}
						<span className='ml-2 text-xs text-gray-400'>{stop.time}</span>
					</li>
				))}
			</ul>
		</div>
	)
}

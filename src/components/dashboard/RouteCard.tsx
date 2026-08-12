'use client'

import { useTranslations } from 'next-intl'
import { Bus, Route as RouteIcon } from 'lucide-react'

type Props = {
	routeName: string | null
	morningCount: number
	afternoonCount: number
	myStopOrder: number | null
}

export default function RouteCard({ routeName, morningCount, afternoonCount, myStopOrder }: Props) {
	const t = useTranslations('Dashboard')

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-200 p-6'>
			<h2 className='text-sm font-semibold text-gray-500 tracking-wide mb-5'>
				{t('routeTitle')}
			</h2>

			{!routeName ? (
				<p className='text-sm text-gray-500'>{t('noRoute')}</p>
			) : (
				<div className='flex flex-col gap-5'>
					<div className='flex items-center gap-3'>
						<span className='flex size-11 items-center justify-center rounded-xl bg-[#f0f3f4] text-[#111518]'>
							<Bus className='size-5' />
						</span>
						<div>
							<p className='font-semibold text-[#111518]'>{routeName}</p>
							<p className='text-sm text-gray-500'>
								{morningCount} {t('morningStops')}
							</p>
						</div>
					</div>

					{myStopOrder !== null && afternoonCount > 0 && (
						<div>
							<div className='mb-2 flex items-center justify-between text-sm'>
								<span className='inline-flex items-center gap-1.5 text-gray-700'>
									<RouteIcon className='size-4 text-gray-400' />
									{t('yourStop')}
								</span>
								<span className='text-gray-500'>
									{myStopOrder + 1} / {afternoonCount}
								</span>
							</div>
							<div className='h-2 overflow-hidden rounded-full bg-gray-100'>
								<div
									className='h-full rounded-full bg-[#111518]'
									style={{ width: `${((myStopOrder + 1) / afternoonCount) * 100}%` }}
								/>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
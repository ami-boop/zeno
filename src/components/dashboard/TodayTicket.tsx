'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ScanBarcode } from 'lucide-react'

type Props = {
	time: string | null
	routeName: string | null
	byBus: boolean
	submittedTime: string | null
}

export default function TodayTicket({ time, routeName, byBus, submittedTime }: Props) {
	const t = useTranslations('Dashboard')

	const noBus = !time

	return (
		<div className='bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden'>
			<div className='px-6 pt-6 pb-4'>
				<div className='flex items-center justify-between mb-5'>
					<h2 className='text-sm font-semibold text-gray-500 tracking-wide'>
						{t('ticketTitle')}
					</h2>
					{routeName && (
						<span className='inline-flex items-center gap-1.5 text-sm font-medium text-gray-700'>
							{routeName}
						</span>
					)}
				</div>

				{noBus ? (
					<div>
						<p className='text-2xl font-bold text-gray-900 mb-1'>{t('noBus')}</p>
						<p className='text-sm text-gray-500'>{t('noBusHint')}</p>
					</div>
				) : (
					<div className='flex items-end justify-between'>
						<div>
							<p className='text-xs text-gray-500 mb-1'>{t('ticketTimeLabel')}</p>
							<p className='text-5xl font-bold tracking-tight text-[#111518] tabular-nums'>
								{time}
							</p>
						</div>
						{byBus && (
							<div className='text-right'>
								<p className='inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700'>
									{t('byBus')}
								</p>
								{submittedTime && (
									<p className='mt-1.5 text-xs text-gray-500'>
										{t('submittedTime')}: {submittedTime}
									</p>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			<div className='relative border-t border-dashed border-gray-300'>
				<span className='absolute -left-3 -top-3 size-6 rounded-full bg-gray-50' />
				<span className='absolute -right-3 -top-3 size-6 rounded-full bg-gray-50' />
			</div>

			<div className='flex items-center justify-between px-6 py-4 bg-gray-50/60'>
				<ScanBarcode className='size-7 text-gray-300' />
				<Link
					href='/report'
					className='rounded-lg bg-[#111518] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800'
				>
					{t('editStatus')}
				</Link>
			</div>
		</div>
	)
}
import { ArrowUpRight, CalendarClock, ClipboardPenLine } from 'lucide-react'
import Link from 'next/link'

export default function ProfileActions({ t }: { t: string[] }) {
	const [quickActions, actionsHint, reportEmergency, viewSchedule] = t

	return (
		<div className='rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'>
			<h2 className='text-lg font-bold text-[#15232d]'>{quickActions}</h2>
			<p className='mt-1 text-sm leading-6 text-gray-500'>{actionsHint}</p>
			<div className='mt-5 flex flex-col gap-3'>
				<Link
					href='/report'
					className='group flex items-center justify-between rounded-2xl bg-[#f4b860] px-4 py-3.5 font-semibold text-[#15232d] transition hover:bg-[#f7c978] focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2'
				>
					<span className='flex items-center gap-3'>
						<ClipboardPenLine className='size-5' data-testid='report-icon' />
						{reportEmergency}
					</span>
					<ArrowUpRight className='size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
				</Link>
				<Link
					href='/schedule'
					className='group flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-[#15232d] transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f4b860] focus:ring-offset-2'
				>
					<span className='flex items-center gap-3'>
						<CalendarClock className='size-5 text-[#486b58]' data-testid='history-icon' />
						{viewSchedule}
					</span>
					<ArrowUpRight className='size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
				</Link>
			</div>
		</div>
	)
}

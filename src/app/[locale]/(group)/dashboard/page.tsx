import { ArrowRight, Calendar, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
	const t = useTranslations('Dashboard')
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
					{t('welcome')}
				</h1>
				<p className='text-lg text-gray-600 mb-8'>{t('desc')}</p>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Карточка: Расписание */}
					<div className='bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100'>
						<div className='bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-3 mb-4 text-white'>
							<Calendar className='w-7 h-7' />
						</div>
						<h2 className='text-lg font-semibold text-gray-900 mb-2'>
							{t('schedule_title')}
						</h2>
						<p className='text-gray-600 mb-4 text-sm'>{t('schedule_desc')}</p>
						<Link href='../schedule'>
							<button className='inline-flex items-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition-all'>
								{t('schedule_btn')} <ArrowRight className='ml-2 w-4 h-4' />
							</button>
						</Link>
					</div>

					{/* Карточка: Профиль */}
					<div className='bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100'>
						<div className='bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 mb-4 text-white'>
							<User className='w-7 h-7' />
						</div>
						<h2 className='text-lg font-semibold text-gray-900 mb-2'>
							{t('profile_title')}
						</h2>
						<p className='text-gray-600 mb-4 text-sm'>{t('profile_desc')}</p>
						<Link href='../profile'>
							<button className='inline-flex items-center px-5 py-2 bg-purple-600 hover:bg-pink-600 text-white rounded-lg font-medium shadow transition-all'>
								{t('profile_btn')} <ArrowRight className='ml-2 w-4 h-4' />
							</button>
						</Link>
					</div>

					{/* Карточка: Сообщить об отмене */}
					<div className='bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100'>
						<div className='bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 mb-4 text-white'>
							<AlertCircle className='w-7 h-7' />
						</div>
						<h2 className='text-lg font-semibold text-gray-900 mb-2'>
							{t('report_title')}
						</h2>
						<p className='text-gray-600 mb-4 text-sm'>{t('report_desc')}</p>
						<Link href='../report'>
							<button className='inline-flex items-center px-5 py-2 bg-orange-500 hover:bg-red-500 text-white rounded-lg font-medium shadow transition-all'>
								{t('report_btn')} <ArrowRight className='ml-2 w-4 h-4' />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

interface ProfileStatsProps {
	t: (key: string) => string
}

export default function ProfileStats({ t }: ProfileStatsProps) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 mb-8'>
			<div className='text-center'>
				<div className='text-2xl font-bold text-blue-600'>2</div>
				<div className='text-sm text-gray-500'>{t('Active Routes')}</div>
			</div>
			<div className='text-center'>
				<div className='text-2xl font-bold text-green-600'>98%</div>
				<div className='text-sm text-gray-500'>{t('On-Time Rate')}</div>
			</div>
			<div className='text-center'>
				<div className='text-2xl font-bold text-purple-600'>156</div>
				<div className='text-sm text-gray-500'>{t('Days This Year')}</div>
			</div>
		</div>
	)
}

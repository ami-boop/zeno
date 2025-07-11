import { Check, Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ReportSuccessProps {
	onReset: () => void
}

export default function ReportSuccess({ onReset }: ReportSuccessProps) {
	const t = useTranslations('Report')
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
			<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
				<Check className='w-8 h-8 text-green-600' />
			</div>
			<h2 className='text-xl font-semibold text-gray-900 mb-2'>
				{t('successTitle')}
			</h2>
			<p className='text-gray-600 mb-6'>{t('successMessage')}</p>
			<div className='bg-blue-50 rounded-lg p-4 mb-6 flex items-center justify-center gap-2'>
				<Info className='w-4 h-4 text-blue-500' />
				<span className='text-blue-800 font-medium text-sm'>
					{t('estimatedArrival')}
				</span>
			</div>
			<button
				onClick={onReset}
				className='w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200'
			>
				{t('backButton')}
			</button>
		</div>
	)
}

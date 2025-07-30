import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface ReportSuccessProps {
	onReset: () => void
}

export default function ReportSuccess({ onReset }: ReportSuccessProps) {
	const [isReset, setIsReset] = useState(false)
	const t = useTranslations('Report')
	return (
		<div className='text-center'>
			<div className='flex justify-center mb-4'>
				<Check className='w-8 h-8 text-green-500 mr-2' />
			</div>
			<h2 className='text-xl font-bold text-gray-900 mb-2'>
				{t('successTitle')}
			</h2>
			<p className='text-gray-600 mb-4'>{t('successMessage')}</p>
			<button
				onClick={() => {
					setIsReset(true)
					onReset()
				}}
				disabled={isReset}
				className={`px-4 py-2 ${
					isReset ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'
				} text-white rounded-md`}
			>
				{isReset ? '...' : t('resetBtn')}
			</button>
		</div>
	)
}

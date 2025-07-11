import { MapPin } from 'lucide-react'

interface ProfileAddressProps {
	address: string
	t: (key: string) => string
}

export default function ProfileAddress({ address, t }: ProfileAddressProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900'>
					{t('Home Address')}
				</h2>
			</div>
			<div className='p-6'>
				<div className='flex items-start space-x-3'>
					<MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
					<p className='text-gray-700 text-sm leading-relaxed'>{address}</p>
				</div>
			</div>
		</div>
	)
}

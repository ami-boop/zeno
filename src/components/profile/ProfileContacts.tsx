import { User, Phone } from 'lucide-react'

interface Contact {
	name: string
	relationship: string
	phone: string
	email: string
	isPrimary: boolean
}

interface ProfileContactsProps {
	contacts: Contact[]
	t: (key: string) => string
}

export default function ProfileContacts({ contacts, t }: ProfileContactsProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900 flex items-center'>
					<User className='w-5 h-5 mr-2 text-blue-600' />
					{t('Parent/Guardian Contact')}
				</h2>
			</div>
			<div className='p-6 space-y-4'>
				{contacts.map(contact => (
					<div
						key={contact.name}
						className='border border-gray-200 rounded-lg p-4'
					>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='font-medium text-gray-900'>{contact.name}</h3>
							{contact.isPrimary && (
								<span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium'>
									Primary
								</span>
							)}
						</div>
						<div className='space-y-2 text-sm'>
							<div className='flex items-center text-gray-600'>
								<span className='w-20 text-gray-500'>
									{contact.relationship}
								</span>
							</div>
							<div className='flex items-center text-gray-600'>
								<Phone className='w-4 h-4 mr-2 text-gray-400' />
								<a
									href={`tel:${contact.phone}`}
									className='text-blue-600 hover:text-blue-800'
								>
									{contact.phone}
								</a>
							</div>
							<div className='flex items-center text-gray-600'>
								<span className='w-4 h-4 mr-2 text-gray-400'>@</span>
								<a
									href={`mailto:${contact.email}`}
									className='text-blue-600 hover:text-blue-800 truncate'
								>
									{contact.email}
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

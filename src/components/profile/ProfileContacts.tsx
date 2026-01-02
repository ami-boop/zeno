import { User, Phone } from 'lucide-react'
import Link from 'next/link'

interface Contact {
	name: string
	relationship: string
	phone: string
	email: string
	isPrimary: boolean
}

interface ProfileContactsProps {
	contacts: Contact[]
	t: string[]
}

export default function ProfileContacts({ contacts, t }: ProfileContactsProps) {
	const [parentGuardianContact, noContacts, noContactsDescription, primary] = t

	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
			<div className='px-6 py-4 border-b border-gray-200'>
				<h2 className='text-lg font-semibold text-gray-900 flex items-center'>
					<User
						className='w-5 h-5 mr-2 text-blue-600'
						data-testid='user-icon'
					/>
					{parentGuardianContact}
				</h2>
			</div>
			<div className='p-6 space-y-4'>
				{(!contacts || contacts.length === 0) && (
					<div className='flex flex-col items-center justify-center py-8'>
						<span className='text-xl font-semibold text-gray-400'>
							{noContacts}
						</span>
						<span className='text-sm text-gray-400 mt-1'>
							{noContactsDescription}
						</span>
					</div>
				)}
				{contacts?.map(contact => (
					<div
						key={contact.name}
						data-testid='contacts-div'
						className='border border-gray-200 rounded-lg p-4'
					>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='font-medium text-gray-900'>{contact.name}</h3>
							{contact.isPrimary && (
								<span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium'>
									{primary}
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
								<Phone
									className='w-4 h-4 mr-2 text-gray-400'
									data-testid='phone-icon'
								/>
								<Link
									href={`tel:${contact.phone}`}
									className='text-blue-600 hover:text-blue-800'
								>
									{contact.phone}
								</Link>
							</div>
							<div className='flex items-center text-gray-600'>
								<span className='w-4 h-4 mr-2 text-gray-400'>@</span>
								<Link
									href={`mailto:${contact.email}`}
									className='text-blue-600 hover:text-blue-800 truncate'
								>
									{contact.email}
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

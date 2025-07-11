import { Edit3 } from 'lucide-react'

interface ProfileHeaderProps {
	user: {
		name: string
		class: string
		studentId: string
		schoolYear: string
		avatar: string
	}
	t: (key: string) => string
}

export default function ProfileHeader({ user, t }: ProfileHeaderProps) {
	return (
		<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-8'>
			<div className='px-6 py-8'>
				<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
					<div className='flex items-center gap-6'>
						<div className='relative'>
							<div
								className='w-24 h-24 bg-center bg-cover rounded-full border-4 border-white shadow-lg'
								style={{ backgroundImage: `url('${user.avatar}')` }}
							/>
							<div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full'></div>
						</div>
						<div>
							<h1 className='text-2xl font-bold text-gray-900 mb-1'>
								{user.name}
							</h1>
							<p className='text-gray-600 mb-2'>{user.class}</p>
							<div className='flex flex-wrap gap-4 text-sm text-gray-500'>
								<span>ID: {user.studentId}</span>
								<span>•</span>
								<span>{user.schoolYear}</span>
							</div>
						</div>
					</div>
					<button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200'>
						<Edit3 className='w-4 h-4 mr-2' />
						{t('Edit Profile')}
					</button>
				</div>
			</div>
		</div>
	)
}

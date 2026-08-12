'use client'

import { Phone, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Parent } from './types'

interface ProfileContactsProps {
	contacts: Parent[]
	t: string[]
}

export default function ProfileContacts({ contacts, t }: ProfileContactsProps) {
	const [parentGuardianContact, contactHint, noContacts, noContactsDescription, primary] = t

	return (
		<motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16, duration: 0.4 }} className='rounded-3xl border border-gray-200 bg-white shadow-sm'>
			<div className='border-b border-gray-100 px-6 py-5'>
				<div className='flex items-start gap-3'>
					<span className='flex size-10 items-center justify-center rounded-xl bg-[#eef3f0] text-[#486b58]'>
						<Users className='size-5' data-testid='user-icon' />
					</span>
					<div>
						<h2 className='text-lg font-bold text-[#15232d]'>{parentGuardianContact}</h2>
						<p className='mt-1 text-sm text-gray-500'>{contactHint}</p>
					</div>
				</div>
			</div>
			<div className='space-y-3 p-4'>
				{(!contacts || contacts.length === 0) && (
					<div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
						<span className='text-xl font-semibold text-gray-400'>{noContacts}</span>
						<span className='mt-1 text-sm text-gray-400'>{noContactsDescription}</span>
					</div>
				)}
				{contacts?.map((contact, index) => (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.22 + index * 0.06, duration: 0.3 }}
						key={`${contact.name}-${contact.phone}`}
						data-testid='contacts-div'
						className='rounded-2xl border border-gray-100 bg-[#fafbfb] p-4 transition hover:border-[#c8d6cd] hover:bg-[#f6faf7]'
					>
						<div className='mb-3 flex items-center justify-between gap-3'>
							<h3 className='font-semibold text-[#15232d]'>{contact.name}</h3>
							{contact.isPrimary && (
								<span className='rounded-full bg-[#e4f1e7] px-2 py-1 text-xs font-semibold text-[#486b58]'>
									{primary}
								</span>
							)}
						</div>
						<div className='flex items-center justify-between gap-3 text-sm'>
							<span className='text-gray-500'>{contact.relationship}</span>
							<Link
								href={`tel:${contact.phone}`}
								className='inline-flex items-center gap-2 font-semibold text-[#486b58] hover:text-[#2f4c3c]'
							>
								<Phone className='size-4' data-testid='phone-icon' />
								{contact.phone}
							</Link>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}

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
		<motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16, duration: 0.4 }} className='rounded-zeno border border-zeno-line bg-white shadow-zeno-card'>
			<div className='border-b border-zeno-line px-6 py-5'>
				<div className='flex items-start gap-3'>
					<span className='flex size-10 items-center justify-center rounded-xl bg-zeno-sage-soft text-zeno-sage'>
						<Users className='size-5' data-testid='user-icon' />
					</span>
					<div>
						<h2 className='text-lg font-bold text-zeno-ink'>{parentGuardianContact}</h2>
						<p className='mt-1 text-sm text-zeno-muted'>{contactHint}</p>
					</div>
				</div>
			</div>
			<div className='space-y-3 p-4'>
				{(!contacts || contacts.length === 0) && (
					<div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
						<span className='text-xl font-semibold text-zeno-muted'>{noContacts}</span>
						<span className='mt-1 text-sm text-zeno-muted'>{noContactsDescription}</span>
					</div>
				)}
				{contacts?.map((contact, index) => (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.22 + index * 0.06, duration: 0.3 }}
						key={`${contact.name}-${contact.phone}`}
						data-testid='contacts-div'
						className='rounded-2xl border border-zeno-line bg-zeno-paper-soft p-4 transition hover:border-zeno-line-strong hover:bg-zeno-sage-soft'
					>
						<div className='mb-3 flex items-center justify-between gap-3'>
							<h3 className='font-semibold text-zeno-ink'>{contact.name}</h3>
							{contact.isPrimary && (
								<span className='rounded-full bg-zeno-sage-soft px-2 py-1 text-xs font-semibold text-zeno-sage'>
									{primary}
								</span>
							)}
						</div>
						<div className='flex items-center justify-between gap-3 text-sm'>
							<span className='text-zeno-muted'>{contact.relationship}</span>
							<Link
								href={`tel:${contact.phone}`}
								className='inline-flex items-center gap-2 font-semibold text-zeno-sage hover:text-zeno-ink-soft'
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

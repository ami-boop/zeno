'use client'

import { useState, useEffect } from 'react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { sanitizeInput } from '@/lib/validation'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useTranslations } from 'next-intl'
import { submitFeedback } from '@/app/actions/feedback'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function HelpPage() {
	const t = useTranslations()
	const [question, setQuestion] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [success, setSuccess] = useState(false)
	const [waitTime, setWaitTime] = useState<number>(0)

	useEffect(() => {
		let timer: NodeJS.Timeout | undefined
		if (waitTime > 0) {
			timer = setInterval(() => {
				setWaitTime(w => (w > 1 ? w - 1 : 0))
			}, 1000)
			return () => clearInterval(timer)
		} else {
			const lastSent = localStorage.getItem('help_feedback_last_sent')
			if (lastSent) {
				const diff = 600 - Math.floor((Date.now() - Number(lastSent)) / 1000)
				if (diff > 0) setWaitTime(diff)
			}
		}
	}, [waitTime])

	const validate = () => {
		if (!question.trim()) return t('help.form.required')
		return ''
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSuccess(false)
		setError('')
		const err = validate()
		setError(err)
		if (err) return
		if (waitTime > 0) return
		setSubmitting(true)
		try {
			const sanitizedQuestion = sanitizeInput(question)
			const result = await submitFeedback(sanitizedQuestion)
			if (result.success) {
				setSuccess(true)
				setQuestion('')
				const now = Date.now()
				localStorage.setItem('help_feedback_last_sent', String(now))
				setWaitTime(600)
			}
		} catch (_e) {
			setError(t('help.form.error'))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className='relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden'>
			<div className='layout-container flex h-full grow flex-col'>
				<div className='px-40 flex flex-1 justify-center py-5'>
					<div className='layout-content-container flex flex-col max-w-[960px] flex-1'>
						<div className='flex flex-wrap justify-between gap-3 p-4'>
							<div className='flex min-w-72 flex-col gap-3'>
								<p className='text-[#111518] tracking-light text-[32px] font-bold leading-tight'>
									{t('help.title')}
								</p>
								<p className='text-[#617889] text-sm font-normal leading-normal'>
									{t('help.subtitle')}
								</p>
							</div>
						</div>
						<h2 className='text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5'>
							{t('help.faqTitle')}
						</h2>
						<Accordion
							type='single'
							data-testid='faq-accordion'
							collapsible
							className='flex flex-col p-4 gap-3'
						>
							{[1, 2, 3].map(itemNumber => (
								<AccordionItem
									key={itemNumber}
									value={`item-${itemNumber}`}
									className='rounded-xl border border-[#dbe1e6] bg-white px-[15px] py-[7px]'
								>
									<AccordionTrigger className='text-[#111518] text-sm font-medium leading-normal py-2'>
										{t(`help.faq.${itemNumber}.q`)}
									</AccordionTrigger>
									<AccordionContent
										className='text-[#617889] text-sm font-normal leading-normal pb-2'
										data-testid='accordion-content'
									>
										{t(`help.faq.${itemNumber}.a`)}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
						<h2 className='text-[#111518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5'>
							{t('help.contactTitle')}
						</h2>
						<form
							onSubmit={handleSubmit}
							className='flex flex-col gap-0 w-full max-w-[600px] bg-transparent p-0 px-4'
						>
							<div className='relative mb-2'>
								<textarea
									placeholder={t('help.form.placeholder')}
									className={`w-full rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-[#138deb]/20 focus:border-[#138deb] bg-white text-[#111518] text-base font-normal outline-none min-h-36 resize-none p-[15px] ${
										error ? 'border-red-300' : 'border-[#dbe1e6]'
									}`}
									value={question}
									onChange={e => {
										setQuestion(e.target.value)
										setError('')
									}}
									disabled={submitting || waitTime > 0}
								/>
								{error && (
									<p
										className='flex items-center gap-1 text-red-400 text-xs mt-1 animate-fade-in'
										data-testid='error'
									>
										{error}
									</p>
								)}
							</div>
							<div className='flex pt-2 pb-2'>
								<button
									type='submit'
									className='flex min-w-[100px] max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#138deb] text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:bg-[#0e6fc6] focus:bg-[#0e6fc6] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#138deb]/30'
									disabled={submitting || waitTime > 0}
								>
									{submitting
										? `${t('help.form.submit')}...`
										: t('help.form.submit')}
								</button>
							</div>
							<div className='min-h-[24px]'>
								{success && (
									<p className='text-green-600 text-xs px-0 pb-1 animate-fade-in'>
										{t('help.form.success')}
									</p>
								)}
								{waitTime > 0 && (
									<p className='text-yellow-600 text-xs px-0 pb-1 animate-fade-in'>
										{t('help.form.wait', { minutes: Math.ceil(waitTime / 60) })}
									</p>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

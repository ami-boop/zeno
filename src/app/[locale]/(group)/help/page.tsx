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
import { motion } from 'framer-motion'
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
			} else {
				setError(result.error || t('help.form.error'))
			}
		} catch {
			setError(t('help.form.error'))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className='zeno-page relative flex size-full flex-col overflow-x-hidden'>
			<div className='layout-container flex h-full grow flex-col'>
				<div className='flex flex-1 justify-center px-4 py-8 sm:px-6 lg:px-8'>
					<div className='layout-content-container flex flex-col max-w-[960px] flex-1'>
						<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className='flex flex-wrap justify-between gap-3 pb-6'>
							<div className='flex min-w-72 flex-col gap-3'>
								<p className='text-3xl font-bold leading-tight tracking-tight text-zeno-ink'>
									{t('help.title')}
								</p>
								<p className='mt-2 text-sm leading-6 text-zeno-ink-soft'>
									{t('help.subtitle')}
								</p>
							</div>
						</motion.div>
						<motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08, duration: 0.4 }} className='pb-3 pt-5 text-xl font-bold leading-tight tracking-tight text-zeno-ink'>
							{t('help.faqTitle')}
						</motion.h2>
						<motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.45 }}>
							<Accordion
								type='single'
								data-testid='faq-accordion'
								collapsible
								className='flex flex-col gap-3'
							>
								{[1, 2, 3].map(itemNumber => (
									<AccordionItem
										key={itemNumber}
										value={`item-${itemNumber}`}
										className='rounded-2xl border border-zeno-line bg-white px-4 py-2 shadow-zeno-card transition hover:border-zeno-line-strong'
									>
										<AccordionTrigger className='py-2 text-sm font-semibold leading-normal text-zeno-ink'>
											{t(`help.faq.${itemNumber}.q`)}
										</AccordionTrigger>
										<AccordionContent
											className='pb-2 text-sm leading-6 text-zeno-ink-soft'
											data-testid='accordion-content'
										>
											{t(`help.faq.${itemNumber}.a`)}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</motion.div>
						<motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }} className='pb-8 pt-5 text-xl font-bold leading-tight tracking-tight text-zeno-ink'>
							{t('help.contactTitle')}
						</motion.h2>
						<motion.form
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.26, duration: 0.45 }}
							onSubmit={handleSubmit}
							className='flex w-full max-w-[600px] flex-col gap-0 bg-transparent p-0'
						>
							<div className='relative mb-2'>
								<textarea
									placeholder={t('help.form.placeholder')}
									className={`zeno-focus min-h-36 w-full resize-none rounded-2xl border bg-white p-4 text-base text-zeno-ink outline-none transition-all duration-200 focus:border-zeno-amber ${
										error ? 'border-zeno-danger/40' : 'border-zeno-line'
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
							<div className='flex py-3'>
								<button
									type='submit'
									className='zeno-focus zeno-primary flex h-11 min-w-[120px] max-w-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-bold leading-normal tracking-[0.015em] disabled:cursor-not-allowed disabled:opacity-60'
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
						</motion.form>
					</div>
				</div>
			</div>
		</div>
	)
}

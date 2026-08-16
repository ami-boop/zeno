'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { setLocaleCookie } from '@/lib/setlocale'
import { locales } from '@/i18n/routing'
import { localeLabel } from '@/utils/setLocaleLabel'

export default function LangSelector({
	locale,
	path,
}: {
	locale: string
	path: string
}) {
	const [open, setOpen] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const onPointerDown = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
		}
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false)
		}
		document.addEventListener('pointerdown', onPointerDown)
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('pointerdown', onPointerDown)
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [])

	return (
		<div ref={ref} className='relative flex items-center'>
			<button
				type='button'
				aria-haspopup='menu'
				aria-expanded={open}
				onClick={() => setOpen(o => !o)}
				className='zeno-focus flex h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-bold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'
			>
				{locale.toUpperCase()}
				<ChevronDown
					className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
				/>
			</button>

			{open && (
				<div
					role='menu'
					className='absolute end-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-zeno border border-zeno-line bg-white p-1 shadow-zeno-card'
				>
					{locales.map(loc => (
						<Link
							key={loc}
							href={path}
							locale={loc}
							role='menuitem'
							onClick={() => {
								setLocaleCookie(loc)
								setOpen(false)
							}}
							className='flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zeno-ink transition hover:bg-zeno-sage-soft'
						>
							{localeLabel(loc)}
							{loc === locale && <Check className='size-4 text-zeno-amber-ink' />}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

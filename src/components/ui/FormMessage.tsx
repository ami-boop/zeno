import type { HTMLAttributes, ReactNode } from 'react'

type Tone = 'error' | 'success' | 'warning'

const toneClass: Record<Tone, string> = {
	error: 'text-red-600',
	success: 'text-green-600',
	warning: 'text-yellow-600',
}

type Props = {
	tone?: Tone
	alert?: boolean
	className?: string
	children: ReactNode
} & HTMLAttributes<HTMLParagraphElement>

export default function FormMessage({ tone = 'error', alert = false, className = '', children, ...rest }: Props) {
	return (
		<p
			{...(alert ? { role: 'alert' } : {})}
			className={`animate-fade-in text-xs ${toneClass[tone]} ${className}`}
			{...rest}
		>
			{children}
		</p>
	)
}

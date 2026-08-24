import type { ReactNode } from 'react'

type Width = 'narrow' | 'md' | 'lg' | 'xl'

const widthClass: Record<Width, string> = {
	narrow: 'max-w-3xl',
	md: 'max-w-5xl',
	lg: 'max-w-6xl',
	xl: 'max-w-[960px]',
}

type Props = {
	width?: Width | (string & {})
	children: ReactNode
	className?: string
}

export default function PageShell({ width = 'lg', children, className = '' }: Props) {
	const container = width in widthClass ? widthClass[width as Width] : width

	return (
		<div className="zeno-page">
			<div className={`mx-auto px-4 py-8 sm:px-6 lg:px-8 ${container} ${className}`}>{children}</div>
		</div>
	)
}

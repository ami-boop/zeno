import type { ReactNode } from 'react'

type Props = {
	eyebrow?: ReactNode
	title: ReactNode
	description?: ReactNode
	size?: 'md' | 'lg'
	className?: string
}

const titleClass = {
	md: 'text-3xl font-bold tracking-tight text-zeno-ink sm:text-4xl',
	lg: 'text-4xl font-bold tracking-tight text-zeno-ink sm:text-5xl',
}

export default function PageHeader({ eyebrow, title, description, size = 'md', className = '' }: Props) {
	return (
		<div className={`max-w-2xl ${className}`}>
			{eyebrow && <p className="zeno-kicker">{eyebrow}</p>}
			<h1 className={`${eyebrow ? 'mt-3' : ''} ${titleClass[size]}`}>{title}</h1>
			{description && <p className="mt-3 text-base leading-7 text-zeno-muted">{description}</p>}
		</div>
	)
}

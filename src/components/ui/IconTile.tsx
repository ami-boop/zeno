import type { ReactNode } from 'react'

type Tone = 'sage' | 'amber'

const toneClass: Record<Tone, string> = {
	sage: 'bg-zeno-sage-soft text-zeno-sage',
	amber: 'bg-zeno-amber text-zeno-amber-fg',
}

type Props = {
	tone?: Tone
	size?: 'sm' | 'md'
	className?: string
	children: ReactNode
}

const sizeClass = {
	sm: 'size-9',
	md: 'size-10',
}

export default function IconTile({ tone = 'sage', size = 'md', className = '', children }: Props) {
	return (
		<span
			className={`flex shrink-0 items-center justify-center rounded-xl ${sizeClass[size]} ${toneClass[tone]} ${className}`}
		>
			{children}
		</span>
	)
}

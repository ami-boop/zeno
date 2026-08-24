'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = {
	children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

export default function IconButton({ children, ...rest }: Props) {
	return (
		<button
			type="button"
			className="zeno-focus flex h-10 items-center justify-center rounded-xl bg-zeno-sage-soft px-2.5 text-sm font-bold text-zeno-ink"
			{...rest}
		>
			{children}
		</button>
	)
}

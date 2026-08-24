import type { ReactNode } from 'react'

type Props = {
	active: boolean
	onClick: () => void
	icon?: ReactNode
	label: ReactNode
	description?: ReactNode
	disabled?: boolean
	className?: string
}

export default function OptionCard({ active, onClick, icon, label, description, disabled, className = '' }: Props) {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			disabled={disabled}
			className={`group rounded-2xl border p-4 text-start transition focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2 ${
				active
					? 'border-zeno-night bg-zeno-night text-white'
					: 'border-zeno-line bg-zeno-surface text-zeno-ink hover:border-zeno-line-strong hover:bg-zeno-paper-soft'
			} ${className}`}
		>
			{icon && (
				<span
					className={`flex size-10 items-center justify-center rounded-xl ${
						active ? 'bg-zeno-amber text-zeno-amber-fg' : 'bg-zeno-sage-soft text-zeno-sage'
					}`}
				>
					{icon}
				</span>
			)}
			<span className={`block font-semibold ${icon ? 'mt-4' : ''}`}>{label}</span>
			{description && <span className="mt-1 block text-xs text-zeno-muted">{description}</span>}
		</button>
	)
}

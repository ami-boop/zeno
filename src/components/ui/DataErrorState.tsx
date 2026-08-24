'use client'

type Props = {
	eyebrow: string
	title: string
	description: string
	actionLabel: string
}

export default function DataErrorState({ eyebrow, title, description, actionLabel }: Props) {
	return (
		<section role='alert' className='rounded-zeno border border-zeno-danger/25 bg-zeno-surface p-6 shadow-zeno-card sm:p-8'>
			<p className='text-xs font-semibold uppercase tracking-[0.2em] text-zeno-danger'>{eyebrow}</p>
			<h1 className='mt-3 text-2xl font-bold tracking-tight text-zeno-ink'>{title}</h1>
			<p className='mt-2 max-w-xl text-sm leading-6 text-zeno-ink-soft'>{description}</p>
			<button
				type='button'
				onClick={() => window.location.reload()}
			className='mt-6 rounded-xl bg-zeno-night px-4 py-3 text-sm font-semibold text-white transition hover:bg-zeno-night/90 focus:outline-none focus:ring-2 focus:ring-zeno-amber/50 focus:ring-offset-2'
			>
				{actionLabel}
			</button>
		</section>
	)
}

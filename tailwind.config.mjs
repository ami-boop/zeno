const config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './messages/**/*.{json}'],
	theme: {
		extend: {
			colors: {
				zeno: {
					ink: 'var(--zeno-ink)',
					'ink-soft': 'var(--zeno-ink-soft)',
					muted: 'var(--zeno-muted)',
					paper: 'var(--zeno-paper)',
					'paper-soft': 'var(--zeno-paper-soft)',
					surface: 'var(--zeno-surface)',
					night: 'var(--zeno-night)',
					amber: 'var(--zeno-amber)',
					'amber-deep': 'var(--zeno-amber-deep)',
					'amber-ink': 'var(--zeno-amber-ink)',
					'amber-fg': 'var(--zeno-amber-fg)',
					sage: 'var(--zeno-sage)',
					'sage-soft': 'var(--zeno-sage-soft)',
					line: 'var(--zeno-line)',
					'line-strong': 'var(--zeno-line-strong)',
					cream: 'var(--zeno-cream)',
					'cream-surface': 'var(--zeno-cream-surface)',
					danger: 'var(--zeno-danger)',
					'danger-soft': 'var(--zeno-danger-soft)',
				},
			},
			fontFamily: {
				sans: ['"Inter Variable"', '"Noto Sans Hebrew"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				display: ['"Unbounded Variable"', '"Suez One"', '"Inter Variable"', '"Noto Sans Hebrew"', 'sans-serif'],
			},
			borderRadius: {
				zeno: '1.5rem',
				'zeno-lg': '2rem',
				'zeno-sm': '0.75rem',
			},
			boxShadow: {
				'zeno-card': '0 12px 32px -24px rgb(21 35 45 / 0.35)',
				'zeno-board': '0 24px 60px -28px rgb(21 35 45 / 0.7)',
			},
			transitionTimingFunction: {
				zeno: 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
		},
	},
}

export default config

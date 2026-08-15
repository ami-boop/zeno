const config = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './messages/**/*.{json}'],
	theme: {
		extend: {
			colors: {
				zeno: {
					ink: '#15232d',
					'ink-soft': '#40515c',
					muted: '#74818a',
					paper: '#f5f7f8',
					'paper-soft': '#f8faf9',
					amber: '#f4b860',
					'amber-deep': '#b77a13',
					'amber-ink': '#795313',
					sage: '#486b58',
					'sage-soft': '#eef3f0',
					line: '#dfe5e8',
					'line-strong': '#c8d6dc',
					cream: '#fff8e8',
					'cream-surface': '#fffdf7',
					danger: '#b42318',
					'danger-soft': '#fef3f2',
				},
			},
			fontFamily: {
				sans: ['var(--font-inter)', 'var(--font-noto-sans-hebrew)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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

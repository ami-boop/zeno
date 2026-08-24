'use client'

import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/context/ThemeContext'
import IconButton from '@/components/ui/IconButton'

export default function ThemeToggle() {
	const t = useTranslations('Header')
	const { theme, toggleTheme } = useTheme()
	const isDark = theme === 'dark'

	return (
		<IconButton onClick={toggleTheme} aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}>
			{isDark ? <Sun className='size-5' /> : <Moon className='size-5' />}
		</IconButton>
	)
}
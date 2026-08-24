'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import React from 'react'

export const THEME_COOKIE = 'zeno-theme'

export function resolveTheme(pref?: string | null): 'light' | 'dark' {
	if (pref === 'light' || pref === 'dark') return pref
	if (typeof window !== 'undefined' && window.matchMedia) {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
	return 'light'
}

const ThemeContext = createContext<{ theme: 'light' | 'dark'; toggleTheme: () => void }>({
	theme: 'light',
	toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')

	useEffect(() => {
		setTheme(resolveTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'))
	}, [])

	useEffect(() => {
		const root = document.documentElement
		const isDark = theme === 'dark'
		root.classList.toggle('dark', isDark)
		root.classList.toggle('light', !isDark)
		document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=31536000;SameSite=Lax;Secure`
	}, [theme])

	const toggleTheme = useCallback(() => {
		setTheme(t => (t === 'dark' ? 'light' : 'dark'))
	}, [])

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
	return useContext(ThemeContext)
}

export function ThemeScript() {
	const script = `(function(){try{var r=document.documentElement,c=document.cookie.match(/(?:^|; )zeno-theme=([^;]*)/);var d=c&&c[1]==='dark'?true:c&&c[1]==='light'?false:!window.matchMedia||!window.matchMedia('(prefers-color-scheme: dark)').matches?false:true;r.classList.toggle('dark',d);r.classList.toggle('light',!d);}catch(e){}})()`
	return <script dangerouslySetInnerHTML={{ __html: script }} />
}
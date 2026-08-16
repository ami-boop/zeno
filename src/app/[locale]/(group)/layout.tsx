import Header from '@/components/Header'
import PageTransition from '@/components/PageTransition'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<PageTransition>{children}</PageTransition>
		</>
	)
}

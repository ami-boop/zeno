'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const GradientWaves = dynamic(() => import('@/components/GradientWaves'), {
	ssr: false,
	loading: () => null,
})

export default function Waves({ opacity = 0.95 }: { opacity?: number }) {
	const [ok, setOk] = useState(false)

	useEffect(() => {
		try {
			const probe = document.createElement('canvas')
			setOk(Boolean(probe.getContext('webgl2')))
		} catch {
			setOk(false)
		}
	}, [])

	if (!ok) return null

	return (
		<div className='pointer-events-none absolute inset-0'>
			<GradientWaves
				horizonColor='#f8f5ef'
				waveColor='#93a69c'
				crestColor='#e3bf8b'
				brightness={0.9}
				opacity={opacity}
				speed={0.5}
				amplitude={2.2}
				fogDepth={18}
				detail='medium'
				grain={false}
				mouseInteraction={false}
			/>
		</div>
	)
}

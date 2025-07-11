'use client'

import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

export default function CustomSwitch() {
	const [enabled, setEnabled] = useState(false)

	return (
		<Switch
			checked={enabled}
			onCheckedChange={setEnabled}
			className={`scale-[1.3] transition-colors duration-150 
				data-[state=checked]:bg-blue-500 
				data-[state=unchecked]:bg-gray-500
				[&_[data-slot=switch-thumb]]:bg-white`}
		/>
	)
}

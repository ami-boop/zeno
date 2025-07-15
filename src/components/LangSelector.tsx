import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@/i18n/navigation'
import { setLocaleCookie } from '@/lib/setlocale'
import { locales } from '@/i18n/routing'
import { localeLabel } from '@/utils/setLocaleLabel'
import React from 'react'

export default React.memo(function LangSelector({
	locale,
}: {
	locale: string
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{locale.toUpperCase()}</DropdownMenuTrigger>
			<DropdownMenuContent>
				{locales.map((loc: string) => (
					<DropdownMenuItem key={loc}>
						<Link href='/' locale={loc} onClick={() => setLocaleCookie(loc)}>
							{localeLabel(loc)}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
})

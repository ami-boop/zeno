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
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default React.memo(function LangSelector({
	locale,
}: {
	locale: string
}) {
	const user = useCurrentUser()
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>{locale.toUpperCase()}</DropdownMenuTrigger>
			<DropdownMenuContent>
				{user === undefined ? (
					<div className='px-4 py-2 text-gray-400'>...</div>
				) : (
					locales.map((loc: string) => (
						<DropdownMenuItem key={loc}>
							<Link
								href={user ? '/dashboard' : '/'}
								locale={loc}
								onClick={() => setLocaleCookie(loc)}
							>
								{localeLabel(loc)}
							</Link>
						</DropdownMenuItem>
					))
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
})

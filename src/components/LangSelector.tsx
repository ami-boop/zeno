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

export default function LangSelector({
	locale,
	path,
}: {
	locale: string
	path: string
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='zeno-focus rounded-xl px-3 py-2 text-xs font-bold text-zeno-ink-soft transition hover:bg-zeno-sage-soft hover:text-zeno-ink'>
				{locale.toUpperCase()}
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{locales.map((loc: string) => (
					<DropdownMenuItem key={loc}>
						<Link href={path} locale={loc} onClick={() => setLocaleCookie(loc)}>
							{localeLabel(loc)}
						</Link>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

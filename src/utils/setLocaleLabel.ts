export const localeLabel = (locale: string) => {
	switch (locale) {
		case 'en':
			return 'English'
		case 'ru':
			return 'Русский'
		case 'he':
			return 'עברית'
		default:
			return locale
	}
}

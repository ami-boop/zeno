import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import '@fontsource-variable/inter/index.css'
import '@fontsource-variable/unbounded/index.css'
import '@fontsource/noto-sans-hebrew/400.css'
import '@fontsource/noto-sans-hebrew/500.css'
import '@fontsource/noto-sans-hebrew/600.css'
import '@fontsource/noto-sans-hebrew/700.css'
import '@fontsource/noto-sans-hebrew/800.css'
import '@fontsource/suez-one/index.css'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Zeno — School Bus Tracking',
  description:
    'Always know where your school bus is. Real-time tracking for students and parents.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Metadata } from 'next'
import { Inter, Noto_Sans_Hebrew } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
})

const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-noto-sans-hebrew',
})

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
    <html
      lang={locale}
      dir={locale === 'he' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${notoSansHebrew.variable}`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}

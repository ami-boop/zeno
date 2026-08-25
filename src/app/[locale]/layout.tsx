import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Metadata, Viewport } from 'next'
import { getTranslations } from 'next-intl/server'
import { ThemeProvider, ThemeScript } from '@/context/ThemeContext'
import MotionProvider from '@/components/MotionProvider'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'
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

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f7f8' },
    { media: '(prefers-color-scheme: dark)', color: '#0e171b' },
  ],
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

  const t = await getTranslations({ locale, namespace: 'A11y' })

  return (
    <html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ServiceWorkerRegistrar />
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-zeno-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zeno-ink focus:shadow-zeno-card'
        >
          {t('skipToContent')}
        </a>
        <ThemeProvider>
          <MotionProvider>
            <NextIntlClientProvider>
              <div id='main-content'>{children}</div>
            </NextIntlClientProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

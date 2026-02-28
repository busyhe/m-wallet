import { Metadata, Viewport } from 'next'
import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { Analytics } from '@/components/analytics'
import { fontSans, fontMono } from '@/lib/fonts'
import { siteConfig } from '@/config/site'
import { AppShell } from '@/components/app-shell'
import { t } from '@/lib/i18n'

export const metadata: Metadata = {
  title: {
    default: t('meta.title'),
    template: `%s - ${t('meta.title')}`
  },
  metadataBase: new URL(siteConfig.url),
  description: t('meta.description'),
  keywords: [
    'subscription manager',
    'wallet',
    '订阅管理',
    '费用追踪',
    'Notion',
    'expense tracker',
    '订阅费用',
    'M-Wallet'
  ],
  authors: [{ name: 'busyhe', url: 'https://github.com/busyhe' }],
  creator: 'busyhe',
  openGraph: {
    type: 'website',
    locale: t('settings.language') === 'Language' ? 'en_US' : 'zh_CN',
    url: siteConfig.url,
    title: t('meta.title'),
    description: t('meta.ogDescription'),
    siteName: siteConfig.name
  },
  twitter: {
    card: 'summary',
    title: t('meta.title'),
    description: t('meta.twitterDescription'),
    creator: '@busyhe_'
  },
  icons: {
    icon: 'https://assets.busyhe.com/touxiang60_60.png',
    shortcut: 'https://assets.busyhe.com/favicon.ico',
    apple: 'https://assets.busyhe.com/touxiang60_60.png'
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'M-Wallet'
  },
  formatDetection: {
    telephone: false
  },
  robots: {
    index: true,
    follow: true
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0b' }
  ]
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

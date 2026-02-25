import { Metadata, Viewport } from 'next'
import '@workspace/ui/globals.css'
import { Providers } from '@/components/providers'
import { Analytics } from '@/components/analytics'
import { fontSans, fontMono } from '@/lib/fonts'
import { siteConfig } from '@/config/site'
import { AppShell } from '@/components/app-shell'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  metadataBase: new URL(siteConfig.url),
  description: '订阅费用管理工具，轻松追踪和管理所有订阅支出',
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
    locale: 'zh_CN',
    url: siteConfig.url,
    title: 'M-Wallet - 订阅费用管理',
    description: '基于 Notion 数据驱动的订阅费用管理工具，Linear UI 设计风格',
    siteName: siteConfig.name
  },
  twitter: {
    card: 'summary',
    title: 'M-Wallet - 订阅费用管理',
    description: '基于 Notion 数据驱动的订阅费用管理工具',
    creator: '@busyhe_'
  },
  icons: {
    icon: 'https://assets.busyhe.com/touxiang60_60.png',
    shortcut: 'https://assets.busyhe.com/favicon.ico',
    apple: 'https://assets.busyhe.com/touxiang60_60.png'
  },
  manifest: undefined,
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
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="M-Wallet" />
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}

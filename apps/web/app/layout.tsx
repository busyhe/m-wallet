import { Metadata } from 'next'
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
  description: siteConfig.description,
  keywords: ['Wallet', 'Subscription', 'Manager'],
  authors: [
    {
      name: 'busyhe',
      url: 'https://github.com/busyhe'
    }
  ],
  creator: 'busyhe',
  icons: {
    icon: 'https://assets.busyhe.com/touxiang60_60.png',
    shortcut: 'https://assets.busyhe.com/favicon.ico'
  }
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

import { Metadata } from 'next'
import Link from 'next/link'

import { t } from '@/lib/i18n'

export const metadata: Metadata = {
  title: t('notfound.title'),
  description: t('notfound.desc')
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-foreground/20 mb-2">404</h1>
      <p className="text-sm text-muted-foreground mb-6">{t('notfound.title')}</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        {t('notfound.back')}
      </Link>
    </div>
  )
}

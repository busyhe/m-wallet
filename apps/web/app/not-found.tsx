import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '页面未找到',
  description: '您访问的页面不存在'
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-foreground/20 mb-2">404</h1>
      <p className="text-sm text-muted-foreground mb-6">页面未找到</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  )
}

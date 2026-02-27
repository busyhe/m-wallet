'use client'

import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { Home, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { icon: Home, label: '首页', href: '/' },
  { icon: BarChart3, label: '统计', href: '/stats' },
  { icon: Settings, label: '设置', href: '/settings' }
]

export function NavBar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-lg mx-auto px-4 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2 px-2 mb-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg shadow-black/5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <motion.button
                key={item.href}
                whileTap={{ scale: 0.92 }}
                onClick={() => router.push(item.href)}
                className="relative flex flex-col items-center gap-0.5 py-1.5 px-3"
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span
                  className={`text-[10px] transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

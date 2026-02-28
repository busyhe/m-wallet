'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, LogOut, Shield, Palette, GripVertical, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSortMode } from '@/lib/hooks/use-sort-mode'
import { logout } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'
import type { SortMode } from '@/lib/types'
import { version } from '@/package.json'
import { useTranslation } from '@/lib/i18n'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { sortMode, setSortMode } = useSortMode()
  const router = useRouter()
  const { t } = useTranslation()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    router.refresh()
    window.location.reload()
  }

  const themeOptions = [
    { key: 'light', label: t('settings.themeLight'), icon: Sun },
    { key: 'dark', label: t('settings.themeDark'), icon: Moon },
    { key: 'system', label: t('settings.themeSystem'), icon: Palette }
  ]

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-foreground"
        >
          {t('settings.title')}
        </motion.h1>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t('settings.appearance')}</h3>
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            {themeOptions.map((opt, i) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.key}
                  onClick={() => setTheme(opt.key)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors hover:bg-secondary/50 ${
                    i < themeOptions.length - 1 ? 'border-b border-border/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{opt.label}</span>
                  </div>
                  {theme === opt.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Sorting */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t('settings.listSorting')}</h3>
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            {[
              { key: 'custom', label: t('settings.sortCustom'), icon: GripVertical },
              { key: 'price-desc', label: t('settings.sortPriceDesc'), icon: ArrowDown },
              { key: 'price-asc', label: t('settings.sortPriceAsc'), icon: ArrowUp },
              { key: 'name-asc', label: t('settings.sortNameAsc'), icon: ArrowUpDown }
            ].map((opt, i, arr) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.key}
                  onClick={() => setSortMode(opt.key as SortMode)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-colors hover:bg-secondary/50 ${
                    i < arr.length - 1 ? 'border-b border-border/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{opt.label}</span>
                  </div>
                  {sortMode === opt.key && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t('settings.security')}</h3>
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{t('settings.passwordProtection')}</span>
              </div>
              <span className="text-xs text-muted-foreground">{t('settings.enabled')}</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{loggingOut ? t('settings.loggingOut') : t('settings.logout')}</span>
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">{t('settings.about')}</h3>
          <div className="rounded-xl bg-card border border-border/50 p-4">
            <p className="text-sm text-foreground font-medium">Wallet</p>
            <p className="text-xs text-muted-foreground mt-1">{t('settings.aboutDesc')}</p>
            <p className="text-xs text-muted-foreground mt-0.5">v{version}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

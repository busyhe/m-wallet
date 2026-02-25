'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, LogOut, Shield, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'
import { logout } from '@/lib/actions/auth'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    router.refresh()
    window.location.reload()
  }

  const themeOptions = [
    { key: 'light', label: '浅色', icon: Sun },
    { key: 'dark', label: '深色', icon: Moon },
    { key: 'system', label: '跟随系统', icon: Palette }
  ]

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-foreground"
        >
          设置
        </motion.h1>
      </div>

      <div className="space-y-6">
        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">外观</h3>
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

        {/* Security */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">安全</h3>
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">密码保护</span>
              </div>
              <span className="text-xs text-muted-foreground">已启用</span>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{loggingOut ? '退出中...' : '退出登录'}</span>
            </button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 px-1">关于</h3>
          <div className="rounded-xl bg-card border border-border/50 p-4">
            <p className="text-sm text-foreground font-medium">M-Wallet</p>
            <p className="text-xs text-muted-foreground mt-1">订阅管理工具 · 基于 Notion 数据驱动</p>
            <p className="text-xs text-muted-foreground mt-0.5">v0.4.1</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

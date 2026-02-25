'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { checkAuth } from '@/lib/actions/auth'
import { LockScreen } from '@/components/lock-screen'
import { NavBar } from '@/components/nav-bar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    checkAuth().then(setAuthenticated)
  }, [])

  // Loading state
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>{!authenticated && <LockScreen onUnlocked={() => setAuthenticated(true)} />}</AnimatePresence>

      {authenticated && (
        <>
          <main className="min-h-screen pb-24">{children}</main>
          <NavBar />
        </>
      )}
    </>
  )
}

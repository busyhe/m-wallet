'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { verifyPassword } from '@/lib/actions/auth'
import { Lock, Delete, Eye, EyeOff } from 'lucide-react'

interface LockScreenProps {
  onUnlocked: () => void
}

export function LockScreen({ onUnlocked }: LockScreenProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleInput = useCallback(
    (digit: string) => {
      if (password.length >= 20) return
      setError(false)
      setPassword((prev) => prev + digit)
    },
    [password]
  )

  const handleDelete = useCallback(() => {
    setPassword((prev) => prev.slice(0, -1))
    setError(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!password) return
    setLoading(true)
    const success = await verifyPassword(password)
    if (success) {
      onUnlocked()
    } else {
      setError(true)
      setPassword('')
    }
    setLoading(false)
  }, [password, onUnlocked])

  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-chart-2/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-xs px-4">
        {/* Lock icon */}
        <motion.div
          animate={error ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10"
        >
          <Lock className="w-7 h-7 text-primary" />
        </motion.div>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">M-Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter password to continue</p>
        </div>

        {/* Password display */}
        <div className="relative w-full">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary/60 border border-border">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="flex-1 bg-transparent text-center text-lg tracking-widest outline-none text-foreground placeholder:text-muted-foreground"
              placeholder="••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -bottom-6 left-0 right-0 text-center text-xs text-destructive"
              >
                Password incorrect
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full mt-2">
          {numpadKeys.map((key, i) => {
            if (key === '') return <div key={i} />
            if (key === 'del') {
              return (
                <motion.button
                  key="del"
                  whileTap={{ scale: 0.92 }}
                  onClick={handleDelete}
                  className="flex items-center justify-center h-14 rounded-xl text-muted-foreground hover:bg-secondary/80 transition-colors"
                >
                  <Delete className="w-5 h-5" />
                </motion.button>
              )
            }
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleInput(key)}
                className="flex items-center justify-center h-14 rounded-xl text-lg font-medium text-foreground hover:bg-secondary/80 active:bg-secondary transition-colors"
              >
                {key}
              </motion.button>
            )
          })}
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading || !password}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 transition-all hover:opacity-90"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mx-auto"
            />
          ) : (
            'Unlock'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

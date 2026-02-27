'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface StatsCardProps {
  label: string
  amount: number
  prefix?: string
  suffix?: string
  color?: string
  delay?: number
  isInteger?: boolean
}

// Animated counter hook
function useAnimatedValue(target: number, duration = 1000) {
  const [value, setValue] = useState(0)
  const rafRef = useRef<number>(0)
  const startTime = useRef<number>(0)

  useEffect(() => {
    startTime.current = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

export function StatsCard({ label, amount, prefix = '¥', suffix, color, delay = 0, isInteger }: StatsCardProps) {
  const animatedAmount = useAnimatedValue(amount, 1200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-4 rounded-xl bg-card border border-border/50"
    >
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-0.5">
        <span className="text-xs text-muted-foreground">{prefix}</span>
        <span className="text-xl font-bold tabular-nums" style={color ? { color } : undefined}>
          {isInteger ? Math.round(animatedAmount) : animatedAmount.toFixed(2)}
        </span>
        {suffix && <span className="text-xs text-muted-foreground ml-0.5">{suffix}</span>}
      </div>
    </motion.div>
  )
}

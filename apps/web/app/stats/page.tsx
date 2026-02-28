'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Subscription } from '@/lib/types'
import { getSubscriptions } from '@/lib/actions/subscriptions'
import { StatsView } from '@/components/stats-view'
import { useTranslation } from '@/lib/i18n'

export default function StatsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    getSubscriptions().then((data) => {
      setSubscriptions(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="pt-6 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold text-foreground"
        >
          {t('nav.stats')}
        </motion.h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 rounded-xl bg-secondary/50 animate-pulse" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-secondary/50 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <StatsView subscriptions={subscriptions} />
      )}
    </div>
  )
}

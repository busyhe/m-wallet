'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Subscription } from '@/lib/types'
import { getSubscriptions } from '@/lib/actions/subscriptions'
import { formatPrice, calculateStats } from '@/lib/subscription-utils'
import { AnimatedNumber } from '@/components/animated-number'
import { SubscriptionList } from '@/components/subscription-list'
import { SubscriptionDetail } from '@/components/subscription-detail'
import { useTranslation } from '@/lib/i18n'

export default function HomePage() {
  const { t, lang } = useTranslation()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getSubscriptions()
    setSubscriptions(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = calculateStats(subscriptions)

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Header */}
      <div className="pt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">Wallet</h1>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/new')}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Monthly stats card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10"
        >
          <p className="text-xs text-muted-foreground mb-1">{t('home.monthlyActual')}</p>
          <div className="flex items-baseline gap-1">
            <AnimatedNumber
              value={stats.totalMonthly}
              format={formatPrice}
              className="text-3xl font-bold text-foreground tabular-nums"
            />
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground">{t('home.yearlyRemaining')}</p>
              <AnimatedNumber
                value={stats.totalYearly}
                format={formatPrice}
                className="text-sm font-medium text-foreground tabular-nums"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{t('stats.activeCount')}</p>
              <AnimatedNumber
                value={stats.count}
                format={(n) => (lang === 'en' ? String(Math.round(n)) : `${Math.round(n)} 个`)}
                className="text-sm font-medium text-foreground tabular-nums"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{t('home.costPerDay')}</p>
              <AnimatedNumber
                value={stats.totalMonthly / 30}
                format={formatPrice}
                className="text-sm font-medium text-foreground tabular-nums"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subscriptions title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-foreground">{t('home.subscriptionList')}</h2>
        <span className="text-xs text-muted-foreground">
          {subscriptions.length} {t('home.items')}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <SubscriptionList subscriptions={subscriptions} onSelect={setSelectedSub} />
      )}

      {/* Detail sheet */}
      {selectedSub && (
        <SubscriptionDetail
          subscription={selectedSub}
          open={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          onEdit={(sub) => {
            router.push(`/edit/${sub.id}`)
            setSelectedSub(null)
          }}
          onDeleted={loadData}
        />
      )}
    </div>
  )
}

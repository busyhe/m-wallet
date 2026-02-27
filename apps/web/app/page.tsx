'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet } from 'lucide-react'
import type { Subscription } from '@/lib/types'
import { getSubscriptions } from '@/lib/actions/subscriptions'
import { formatPrice, calculateStats } from '@/lib/subscription-utils'
import { SubscriptionList } from '@/components/subscription-list'
import { SubscriptionDetail } from '@/components/subscription-detail'

export default function HomePage() {
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
          className="flex items-center gap-2 mb-6"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">M-Wallet</h1>
        </motion.div>

        {/* Monthly stats card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10"
        >
          <p className="text-xs text-muted-foreground mb-1">本月实际支出</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground tabular-nums">{formatPrice(stats.totalMonthly)}</span>
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <p className="text-[10px] text-muted-foreground">年度剩余</p>
              <p className="text-sm font-medium text-foreground tabular-nums">{formatPrice(stats.totalYearly)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">活跃订阅</p>
              <p className="text-sm font-medium text-foreground">{stats.count} 个</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">日均</p>
              <p className="text-sm font-medium text-foreground tabular-nums">{formatPrice(stats.totalMonthly / 30)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subscriptions title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-foreground">订阅列表</h2>
        <span className="text-xs text-muted-foreground">{subscriptions.length} 项</span>
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
          onEdit={() => {
            // TODO: navigate to edit page
            setSelectedSub(null)
          }}
          onDeleted={loadData}
        />
      )}
    </div>
  )
}

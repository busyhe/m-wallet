'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Subscription } from '@/lib/types'
import { getMonthlyEquivalent, getYearlyEquivalent, formatPrice } from '@/lib/subscription-utils'
import { StatsCard } from './stats-card'

type StatsPeriod = 'monthly' | 'yearly' | 'all'

interface StatsViewProps {
  subscriptions: Subscription[]
}

export function StatsView({ subscriptions }: StatsViewProps) {
  const [period, setPeriod] = useState<StatsPeriod>('monthly')

  const stats = useMemo(() => {
    const active = subscriptions.filter((s) => {
      if (s.endDate && new Date(s.endDate) < new Date()) return false
      return true
    })

    const totalMonthly = active.reduce((sum, s) => sum + getMonthlyEquivalent(s), 0)
    const totalYearly = active.reduce((sum, s) => sum + getYearlyEquivalent(s), 0)
    const totalOneTime = active.filter((s) => s.cycle === 'one-time').reduce((sum, s) => sum + s.price, 0)

    // Group by category
    const byCategory = new Map<string, number>()
    active.forEach((s) => {
      const cat = s.category || '其他'
      const amount =
        period === 'monthly'
          ? getMonthlyEquivalent(s)
          : period === 'yearly'
            ? getYearlyEquivalent(s)
            : getYearlyEquivalent(s) + (s.cycle === 'one-time' ? s.price : 0)
      byCategory.set(cat, (byCategory.get(cat) || 0) + amount)
    })

    const categories = Array.from(byCategory.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }))

    return { totalMonthly, totalYearly, totalAll: totalYearly + totalOneTime, count: active.length, categories }
  }, [subscriptions, period])

  const totalAmount =
    period === 'monthly' ? stats.totalMonthly : period === 'yearly' ? stats.totalYearly : stats.totalAll
  const maxCategoryAmount = stats.categories[0]?.amount ?? 0

  const periods: { key: StatsPeriod; label: string }[] = [
    { key: 'monthly', label: '月度' },
    { key: 'yearly', label: '年度' },
    { key: 'all', label: '全部' }
  ]

  return (
    <div className="space-y-6">
      {/* Period tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/60">
        {periods.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`relative flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              period === p.key ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {period === p.key && (
              <motion.div
                layoutId="statsPeriod"
                className="absolute inset-0 bg-card rounded-lg shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatsCard
          label={period === 'monthly' ? '月度支出' : period === 'yearly' ? '年度支出' : '总支出'}
          amount={totalAmount}
          delay={0}
        />
        <StatsCard label="活跃订阅" amount={stats.count} prefix="" suffix="个" delay={0.1} />
        <StatsCard label="日均花费" amount={stats.totalMonthly / 30} delay={0.2} />
        <StatsCard label="年度预估" amount={stats.totalYearly} delay={0.3} />
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">分类统计</h3>
        <div className="space-y-3">
          {stats.categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-foreground">{cat.name}</span>
                <span className="font-medium text-foreground tabular-nums">{formatPrice(cat.amount)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${maxCategoryAmount > 0 ? (cat.amount / maxCategoryAmount) * 100 : 0}%` }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </motion.div>
          ))}
          {stats.categories.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">暂无数据</p>}
        </div>
      </div>
    </div>
  )
}

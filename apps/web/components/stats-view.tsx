'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Subscription } from '@/lib/types'
import { getCostInPeriod, formatPrice } from '@/lib/subscription-utils'
import { StatsCard } from './stats-card'
import { BarChart } from './bar-chart'
import {
  startOfMonth as startOfMonthFn,
  endOfMonth as endOfMonthFn,
  eachDayOfInterval,
  format,
  startOfYear as startOfYearFn,
  eachMonthOfInterval,
  eachYearOfInterval,
  startOfDay,
  endOfDay,
  endOfYear as endOfYearFn
} from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslation } from '@/lib/i18n'

type StatsPeriod = 'monthly' | 'yearly' | 'all'

interface StatsViewProps {
  subscriptions: Subscription[]
}

export function StatsView({ subscriptions }: StatsViewProps) {
  const [period, setPeriod] = useState<StatsPeriod>('monthly')
  const now = useMemo(() => new Date(), [])
  const { t, lang } = useTranslation()
  const dateLocale = lang === 'en' ? enUS : zhCN

  const stats = useMemo(() => {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const beginningOfTime = new Date(0)

    const totalMonthly = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, startOfMonth, endOfMonth), 0)
    const totalYearly = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, startOfYear, now), 0)
    const totalAll = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, beginningOfTime, now), 0)

    // Group by category based on selected period
    const byCategory = new Map<string, number>()
    const [periodStart, periodEnd] =
      period === 'monthly'
        ? [startOfMonth, endOfMonth]
        : period === 'yearly'
          ? [startOfYear, now]
          : [beginningOfTime, now]

    subscriptions.forEach((s) => {
      const cat = s.category || t('category.other')
      const amount = getCostInPeriod(s, periodStart, periodEnd)
      if (amount > 0) {
        byCategory.set(cat, (byCategory.get(cat) || 0) + amount)
      }
    })

    const categories = Array.from(byCategory.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }))

    const activeCount = subscriptions.filter((s) => {
      if (s.cycle === 'one-time') return true
      if (s.endDate && new Date(s.endDate) < now) return false
      return true
    }).length

    // Calculate chart data based on period
    let chartData: { label: string; value: number; fullLabel?: string }[] = []

    if (period === 'monthly') {
      const days = eachDayOfInterval({ start: startOfMonthFn(now), end: endOfMonthFn(now) })
      chartData = days.map((day) => {
        // Actual transaction amount on this day
        const actualAmount = subscriptions.reduce(
          (sum, s) => sum + getCostInPeriod(s, startOfDay(day), endOfDay(day)),
          0
        )

        // Pro-rated daily cost (to ensure chart isn't empty)
        const proratedAmount = subscriptions.reduce((sum, s) => {
          // If active in this month
          const monthStart = startOfMonthFn(day)
          const monthEnd = endOfMonthFn(day)
          const costInMonth = getCostInPeriod(s, monthStart, monthEnd)
          return sum + costInMonth / 30 // Simplified pro-rating
        }, 0)

        const value = actualAmount > 0 ? actualAmount : proratedAmount

        return {
          label: format(day, 'd'),
          fullLabel: format(day, lang === 'en' ? 'MMM d, yyyy' : 'yyyy年MM月dd日', { locale: dateLocale }),
          value: value
        }
      })
    } else if (period === 'yearly') {
      const months = eachMonthOfInterval({ start: startOfYearFn(now), end: endOfYearFn(now) })
      chartData = months.map((month) => {
        const monthStart = month
        const monthEnd = endOfMonthFn(month)
        const amount = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, monthStart, monthEnd), 0)
        return {
          label: format(month, lang === 'en' ? 'MMM' : 'M月', { locale: dateLocale }),
          fullLabel: format(month, lang === 'en' ? 'MMM yyyy' : 'yyyy年MM月', { locale: dateLocale }),
          value: amount
        }
      })
    } else {
      // 'all' - show last 5 years or from first sub
      const firstSubDate = subscriptions.reduce((min, s) => {
        const start = new Date(s.startDate)
        return start < min ? start : min
      }, now)
      const startYear = Math.min(now.getFullYear() - 4, firstSubDate.getFullYear())
      const years = eachYearOfInterval({ start: new Date(startYear, 0, 1), end: now })
      chartData = years.map((year) => {
        const yearStart = startOfYearFn(year)
        // For the current year, cap at today instead of end of year
        const yearEnd =
          year.getFullYear() === now.getFullYear() ? now : new Date(year.getFullYear(), 11, 31, 23, 59, 59)
        const amount = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, yearStart, yearEnd), 0)
        return {
          label: format(year, 'yyyy'),
          fullLabel: format(year, lang === 'en' ? 'yyyy' : 'yyyy年'),
          value: amount
        }
      })
    }

    // Calculate default active index for current date
    let defaultActiveIndex: number | undefined
    if (period === 'monthly') {
      defaultActiveIndex = now.getDate() - 1
    } else if (period === 'yearly') {
      defaultActiveIndex = now.getMonth()
    } else {
      defaultActiveIndex = chartData.length - 1
    }

    return {
      totalMonthly,
      totalYearly: totalYearly,
      totalAll: totalAll,
      count: activeCount,
      categories,
      chartData,
      defaultActiveIndex
    }
  }, [subscriptions, period, now, t, dateLocale, lang])

  const totalAmount =
    period === 'monthly' ? stats.totalMonthly : period === 'yearly' ? stats.totalYearly : stats.totalAll
  const maxCategoryAmount = stats.categories[0]?.amount ?? 0

  const periods: { key: StatsPeriod; label: string }[] = [
    { key: 'monthly', label: t('stats.monthly') },
    { key: 'yearly', label: t('stats.yearly') },
    { key: 'all', label: t('stats.all') }
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
          label={
            period === 'monthly'
              ? t('stats.monthlyActual')
              : period === 'yearly'
                ? t('stats.yearlyActual')
                : t('stats.allActual')
          }
          amount={totalAmount}
          delay={0}
        />
        <StatsCard
          label={t('stats.activeCount')}
          amount={stats.count}
          prefix=""
          suffix={lang === 'en' ? '' : '个'}
          isInteger
          delay={0.04}
        />
        <StatsCard
          label={
            period === 'monthly'
              ? t('stats.dailyAverage')
              : period === 'yearly'
                ? t('stats.monthlyAverage')
                : t('stats.monthlyEstimate')
          }
          amount={
            period === 'monthly'
              ? totalAmount / 30
              : period === 'yearly'
                ? totalAmount / (now.getMonth() + 1)
                : totalAmount / 12
          }
          delay={0.08}
        />
      </div>

      {/* Category breakdown */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">{t('stats.categories')}</h3>
        <div className="space-y-3 p-4 rounded-xl bg-card border border-border/50">
          {stats.categories.map((cat, i) => {
            const percentage = totalAmount > 0 ? (cat.amount / totalAmount) * 100 : 0
            const percentageStr = percentage > 0 && percentage < 0.1 ? '<0.1%' : `${percentage.toFixed(1)}%`

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-foreground">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground tabular-nums">{formatPrice(cat.amount)}</span>
                    <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">{percentageStr}</span>
                  </div>
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
            )
          })}
          {stats.categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">{t('stats.noData')}</p>
          )}
        </div>
      </div>

      {/* Chart */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">{t('stats.spendingTrend')}</h3>
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <BarChart key={period} data={stats.chartData} defaultActiveIndex={stats.defaultActiveIndex} />
        </div>
      </div>
    </div>
  )
}

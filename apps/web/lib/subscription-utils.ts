import { addMonths, addDays, addYears, format, differenceInDays, isAfter } from 'date-fns'
import type { Subscription, SubscriptionCycle, Currency } from '@/lib/types'

// Calculate the next billing date
export function getNextBillingDate(sub: Subscription): Date | null {
  if (sub.cycle === 'one-time') return null
  if (!sub.startDate) return null

  const start = new Date(sub.startDate)
  const now = new Date()
  let next = start

  while (next <= now) {
    switch (sub.cycle) {
      case 'monthly':
        next = addMonths(next, 1)
        break
      case 'quarterly':
        next = addMonths(next, 3)
        break
      case 'yearly':
        next = addYears(next, 1)
        break
      case 'custom':
        next = addDays(next, sub.customCycleDays || 30)
        break
    }
  }

  // Check if past end date
  if (sub.endDate && isAfter(next, new Date(sub.endDate))) return null
  return next
}

// Format next billing date display
export function formatNextBilling(sub: Subscription): string {
  if (sub.cycle === 'one-time') return '一次性'
  const next = getNextBillingDate(sub)
  if (!next) return '已到期'
  const days = differenceInDays(next, new Date())
  if (days === 0) return '今天'
  if (days === 1) return '明天'
  if (days <= 7) return `${days}天后`
  return format(next, 'MM/dd')
}

// Calculate monthly equivalent cost
export function getMonthlyEquivalent(sub: Subscription): number {
  switch (sub.cycle) {
    case 'monthly':
      return sub.price
    case 'quarterly':
      return sub.price / 3
    case 'yearly':
      return sub.price / 12
    case 'one-time':
      return 0
    case 'custom':
      return sub.customCycleDays ? (sub.price / sub.customCycleDays) * 30 : sub.price
    default:
      return sub.price
  }
}

// Calculate yearly equivalent cost
export function getYearlyEquivalent(sub: Subscription): number {
  return getMonthlyEquivalent(sub) * 12
}

// Format price with currency symbol
export function formatPrice(amount: number, currency: Currency = 'CNY'): string {
  const symbol = currency === 'CNY' ? '¥' : '$'
  return `${symbol}${amount.toFixed(2)}`
}

// Calculate total monthly/yearly/all stats
export function calculateStats(subscriptions: Subscription[]) {
  const active = subscriptions.filter((s) => {
    if (s.cycle === 'one-time') return true
    if (s.endDate && isAfter(new Date(), new Date(s.endDate))) return false
    return true
  })

  const totalMonthly = active.reduce((sum, s) => sum + getMonthlyEquivalent(s), 0)
  const totalYearly = active.reduce((sum, s) => sum + getYearlyEquivalent(s), 0)
  const totalOneTime = active.filter((s) => s.cycle === 'one-time').reduce((sum, s) => sum + s.price, 0)

  return {
    totalMonthly,
    totalYearly,
    totalAll: totalYearly + totalOneTime,
    count: active.length,
    currency: 'CNY' as Currency
  }
}

// Format cycle label
export function getCycleLabel(cycle: SubscriptionCycle): string {
  const labels: Record<SubscriptionCycle, string> = {
    monthly: '月',
    quarterly: '季',
    yearly: '年',
    'one-time': '买断',
    custom: '自定义'
  }
  return labels[cycle]
}

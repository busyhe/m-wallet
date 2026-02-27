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

// Get all billing dates for a subscription within a date range
export function getBillingDatesInPeriod(sub: Subscription, start: Date, end: Date): Date[] {
  if (sub.cycle === 'one-time') {
    const purchaseDate = new Date(sub.startDate)
    return purchaseDate >= start && purchaseDate <= end ? [purchaseDate] : []
  }

  const startDate = new Date(sub.startDate)
  const endDate = sub.endDate ? new Date(sub.endDate) : null
  const dates: Date[] = []

  let current = startDate
  while (current <= end) {
    if (endDate && current > endDate) break

    if (current >= start) {
      dates.push(new Date(current))
    }

    switch (sub.cycle) {
      case 'monthly':
        current = addMonths(current, 1)
        break
      case 'quarterly':
        current = addMonths(current, 3)
        break
      case 'yearly':
        current = addYears(current, 1)
        break
      case 'custom':
        current = addDays(current, sub.customCycleDays || 30)
        break
    }
  }

  return dates
}

// Calculate total cost for a subscription in a period
export function getCostInPeriod(sub: Subscription, start: Date, end: Date): number {
  const billingDates = getBillingDatesInPeriod(sub, start, end)
  return billingDates.length * sub.price
}

/** @deprecated Use getCostInPeriod instead for actual spending calculation */
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

/** @deprecated Use getCostInPeriod instead for actual spending calculation */
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
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59)

  // Monthly stats: Actual payments in current month
  const totalMonthly = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, startOfMonth, endOfMonth), 0)

  // Yearly stats: Remaining payments from CURRENT DATE to end of year
  // User said "之前花费不计算入内" (previous spending not included)
  const totalYearlyRemaining = subscriptions.reduce((sum, s) => sum + getCostInPeriod(s, now, endOfYear), 0)

  // Active count
  const activeCount = subscriptions.filter((s) => {
    if (s.cycle === 'one-time') return true
    if (s.endDate && isAfter(now, new Date(s.endDate))) return false
    return true
  }).length

  return {
    totalMonthly,
    totalYearly: totalYearlyRemaining,
    totalAll: totalYearlyRemaining, // Adjust based on need, here we use remaining yearly
    count: activeCount,
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

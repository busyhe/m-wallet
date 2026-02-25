// Subscription cycle types
export type SubscriptionCycle = 'monthly' | 'quarterly' | 'yearly' | 'one-time' | 'custom'

// Currency types
export type Currency = 'CNY' | 'USD'

// Sort mode for subscription list
export type SortMode = 'custom' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

// Subscription data model
export interface Subscription {
  id: string
  name: string
  icon: string
  price: number
  currency: Currency
  cycle: SubscriptionCycle
  customCycleDays?: number
  startDate: string
  endDate?: string
  description: string
  category: string
  position: number
  color: string
}

// Form data for creating/updating subscription
export interface SubscriptionFormData {
  name: string
  icon: string
  price: number
  currency: Currency
  cycle: SubscriptionCycle
  customCycleDays?: number
  startDate: string
  endDate?: string
  description: string
  category: string
  color: string
}

// Preset service definition
export interface PresetService {
  name: string
  icon: string
  category: string
  color: string
}

// Stats data structure
export interface StatsData {
  totalMonthly: number
  totalYearly: number
  totalAll: number
  count: number
  currency: Currency
}

// Cycle label mapping
export const CYCLE_LABELS: Record<SubscriptionCycle, string> = {
  monthly: '月付',
  quarterly: '季付',
  yearly: '年付',
  'one-time': '买断',
  custom: '自定义'
}

// Currency symbols
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  CNY: '¥',
  USD: '$'
}

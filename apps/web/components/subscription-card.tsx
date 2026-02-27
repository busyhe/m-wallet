'use client'

import { motion } from 'framer-motion'
import type { Subscription } from '@/lib/types'
import { formatPrice, formatNextBilling, getCycleLabel } from '@/lib/subscription-utils'
import { ServiceIcon } from './service-icon'

interface SubscriptionCardProps {
  subscription: Subscription
  onClick?: () => void
  index?: number
}

export function SubscriptionCard({ subscription, onClick, index = 0 }: SubscriptionCardProps) {
  const { name, icon, price, currency, cycle, color } = subscription
  const nextBilling = formatNextBilling(subscription)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group flex items-center gap-3.5 p-3.5 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm transition-all cursor-pointer"
    >
      {/* Service icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <ServiceIcon icon={icon} name={name} color={color} size={20} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{nextBilling}</p>
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold text-foreground">{formatPrice(price, currency)}</p>
        <p className="text-[10px] text-muted-foreground">/{getCycleLabel(cycle)}</p>
      </div>
    </motion.div>
  )
}

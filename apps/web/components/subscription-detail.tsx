'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit3, Trash2, Calendar, Clock, Tag } from 'lucide-react'
import type { Subscription } from '@/lib/types'
import { CYCLE_LABELS, CURRENCY_SYMBOLS } from '@/lib/types'
import { formatPrice, formatNextBilling, getMonthlyEquivalent } from '@/lib/subscription-utils'
import { deleteSubscription } from '@/lib/actions/subscriptions'
import { format } from 'date-fns'

interface SubscriptionDetailProps {
  subscription: Subscription
  open: boolean
  onClose: () => void
  onEdit: (sub: Subscription) => void
  onDeleted: () => void
}

export function SubscriptionDetail({ subscription: sub, open, onClose, onEdit, onDeleted }: SubscriptionDetailProps) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    await deleteSubscription(sub.id)
    setDeleting(false)
    onDeleted()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-card border-t border-border"
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-5 pb-8 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: `${sub.color}15` }}
                  >
                    {sub.icon ? (
                      <img src={sub.icon} alt={sub.name} className="w-6 h-6 object-contain" crossOrigin="anonymous" />
                    ) : (
                      <span className="text-lg font-bold" style={{ color: sub.color }}>
                        {sub.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{sub.name}</h2>
                    <p className="text-sm text-muted-foreground">{sub.category}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Price highlight */}
              <div className="p-4 rounded-xl bg-secondary/50">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(sub.price, sub.currency)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{CYCLE_LABELS[sub.cycle]}</p>
                  </div>
                  {sub.cycle !== 'one-time' && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        ≈ {formatPrice(getMonthlyEquivalent(sub), sub.currency)}/月
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <DetailRow
                  icon={<Calendar className="w-4 h-4" />}
                  label="开始时间"
                  value={sub.startDate ? format(new Date(sub.startDate), 'yyyy-MM-dd') : '-'}
                />
                {sub.endDate && (
                  <DetailRow
                    icon={<Calendar className="w-4 h-4" />}
                    label="结束时间"
                    value={format(new Date(sub.endDate), 'yyyy-MM-dd')}
                  />
                )}
                <DetailRow icon={<Clock className="w-4 h-4" />} label="下次扣费" value={formatNextBilling(sub)} />
                <DetailRow icon={<Tag className="w-4 h-4" />} label="分类" value={sub.category || '-'} />
                {sub.description && (
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-1">备注</p>
                    <p className="text-sm text-foreground">{sub.description}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onEdit(sub)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    confirmDelete
                      ? 'bg-destructive text-white'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? '删除中...' : confirmDelete ? '确认删除' : '删除'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

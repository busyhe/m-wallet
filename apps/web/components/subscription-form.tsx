'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { SubscriptionFormData, SubscriptionCycle, Currency } from '@/lib/types'
import { CYCLE_LABELS } from '@/lib/types'
import { PRESET_SERVICES, getServiceCategories } from '@/lib/services'
import { createSubscription, updateSubscription } from '@/lib/actions/subscriptions'
import type { Subscription } from '@/lib/types'
import { ServiceIcon } from './service-icon'

interface SubscriptionFormProps {
  editData?: Subscription
}

type Step = 'service' | 'details'

export function SubscriptionForm({ editData }: SubscriptionFormProps) {
  const router = useRouter()
  const isEdit = !!editData
  const [step, setStep] = useState<Step>(isEdit ? 'details' : 'service')
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [form, setForm] = useState<SubscriptionFormData>({
    name: editData?.name || '',
    icon: editData?.icon || '',
    price: editData?.price || 0,
    currency: editData?.currency || 'CNY',
    cycle: editData?.cycle || 'monthly',
    customCycleDays: editData?.customCycleDays,
    startDate: editData?.startDate || new Date().toISOString().slice(0, 10),
    endDate: editData?.endDate || '',
    description: editData?.description || '',
    category: editData?.category || '',
    color: editData?.color || '#6366f1'
  })

  const categories = getServiceCategories()
  const isInitialView = !searchQuery && !selectedCategory

  const filteredServices = useMemo(() => {
    let items = PRESET_SERVICES
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      items = items.filter((s) => s.name.toLowerCase().includes(q))
    }
    if (selectedCategory) {
      items = items.filter((s) => s.category === selectedCategory)
    }
    return items
  }, [searchQuery, selectedCategory])

  const handleSelectService = (service: (typeof PRESET_SERVICES)[number]) => {
    setForm((prev) => ({
      ...prev,
      name: service.name,
      icon: service.icon,
      category: service.category,
      color: service.color
    }))
    setStep('details')
  }

  const handleCustomService = () => {
    setStep('details')
  }

  const handleSubmit = async () => {
    if (!form.name || !form.price) return
    setSubmitting(true)

    if (isEdit && editData) {
      await updateSubscription(editData.id, form)
    } else {
      await createSubscription(form)
    }

    setSubmitting(false)
    window.location.href = '/'
  }

  const updateField = <K extends keyof SubscriptionFormData>(key: K, value: SubscriptionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const cycles: SubscriptionCycle[] = ['monthly', 'quarterly', 'yearly', 'one-time', 'custom']
  const currencies: Currency[] = ['CNY', 'USD']

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          <button
            onClick={() => (step === 'details' && !isEdit ? setStep('service') : router.back())}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-sm font-semibold text-foreground">
            {isEdit ? '编辑订阅' : step === 'service' ? '选择服务' : '订阅详情'}
          </h1>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          {step === 'service' ? (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col h-[calc(100dvh-4rem)]"
            >
              {/* Sticky search & category filter */}
              <div className="shrink-0 space-y-3 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="搜索服务..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      !selectedCategory ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable service grid */}
              <div className="flex-1 overflow-y-auto space-y-3 pb-10 overscroll-contain">
                <motion.div
                  key={selectedCategory ?? '__all__'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {filteredServices.map((service, i) => {
                    const stagger = isInitialView ? Math.min(i, 8) * 0.06 : 0
                    return (
                      <motion.button
                        key={service.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: stagger, duration: 0.25 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSelectService(service)}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm text-left transition-all"
                      >
                        <div
                          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                          style={{ backgroundColor: `${service.color}15` }}
                        >
                          <ServiceIcon icon={service.icon} name={service.name} color={service.color} size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{service.name}</p>
                          <p className="text-[10px] text-muted-foreground">{service.category}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCustomService}
                  className="w-full p-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  + 自定义服务
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-5"
            >
              {/* Selected service preview */}
              {form.name && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: `${form.color}15` }}
                  >
                    <ServiceIcon icon={form.icon} name={form.name} color={form.color} size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{form.name}</p>
                    <p className="text-xs text-muted-foreground">{form.category}</p>
                  </div>
                </div>
              )}

              {/* Name (for custom) */}
              {!form.icon && (
                <FormField label="服务名称">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="输入服务名称"
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </FormField>
              )}

              {/* Price & Currency */}
              <FormField label="价格">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {form.currency === 'CNY' ? '¥' : '$'}
                    </span>
                    <input
                      type="number"
                      value={form.price || ''}
                      onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors tabular-nums"
                    />
                  </div>
                  <div className="flex rounded-xl bg-secondary/60 border border-border/50 overflow-hidden">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateField('currency', c)}
                        className={`px-3 py-2.5 text-xs font-medium transition-colors ${
                          form.currency === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </FormField>

              {/* Cycle */}
              <FormField label="订阅周期">
                <div className="flex flex-wrap gap-1.5">
                  {cycles.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateField('cycle', c)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        form.cycle === c
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'bg-secondary/60 text-muted-foreground border border-transparent hover:bg-secondary'
                      }`}
                    >
                      {form.cycle === c && <Check className="w-3 h-3" />}
                      {CYCLE_LABELS[c]}
                    </button>
                  ))}
                </div>
                {form.cycle === 'custom' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">每</span>
                      <input
                        type="number"
                        value={form.customCycleDays || ''}
                        onChange={(e) => updateField('customCycleDays', parseInt(e.target.value) || undefined)}
                        className="w-20 px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 text-sm text-center outline-none focus:border-primary/50"
                        placeholder="30"
                      />
                      <span className="text-sm text-muted-foreground">天</span>
                    </div>
                  </motion.div>
                )}
              </FormField>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="开始日期">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </FormField>
                <FormField label="结束日期（可选）">
                  <input
                    type="date"
                    value={form.endDate || ''}
                    onChange={(e) => updateField('endDate', e.target.value || undefined)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField label="备注（可选）">
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="添加备注..."
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </FormField>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.price}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 transition-all hover:opacity-90 mb-24"
              >
                {submitting ? '保存中...' : isEdit ? '更新订阅' : '添加订阅'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronLeft, Check, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { SubscriptionFormData, SubscriptionCycle, Currency, BundledService } from '@/lib/types'
import { PRESET_SERVICES, getServiceCategories } from '@/lib/services'
import { createSubscription, updateSubscription } from '@/lib/actions/subscriptions'
import type { Subscription } from '@/lib/types'
import { ServiceIcon } from './service-icon'
import { DatePicker } from './date-picker'
import { useTranslation } from '@/lib/i18n'

interface SubscriptionFormProps {
  editData?: Subscription
}

type Step = 'service' | 'details'

export function SubscriptionForm({ editData }: SubscriptionFormProps) {
  const router = useRouter()
  const { t } = useTranslation()
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
    color: editData?.color || '#6366f1',
    bundledServices: editData?.bundledServices || []
  })

  const [showBundlePicker, setShowBundlePicker] = useState(false)
  const [bundleSearch, setBundleSearch] = useState('')
  const [bundleCategory, setBundleCategory] = useState<string | null>(null)

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

  const addBundledService = (service: BundledService) => {
    setForm((prev) => ({
      ...prev,
      bundledServices: [...(prev.bundledServices || []), service]
    }))
    setShowBundlePicker(false)
    setBundleSearch('')
    setBundleCategory(null)
  }

  const removeBundledService = (index: number) => {
    setForm((prev) => ({
      ...prev,
      bundledServices: prev.bundledServices?.filter((_, i) => i !== index) || []
    }))
  }

  // Filter preset services for bundle picker (exclude the main service)
  const bundleFilteredServices = useMemo(() => {
    let items = PRESET_SERVICES.filter((s) => s.name !== form.name)
    const existingNames = new Set(form.bundledServices?.map((b) => b.name) || [])
    items = items.filter((s) => !existingNames.has(s.name))
    if (bundleSearch) {
      const q = bundleSearch.toLowerCase()
      items = items.filter((s) => s.name.toLowerCase().includes(q))
    }
    if (bundleCategory) {
      items = items.filter((s) => s.category === bundleCategory)
    }
    return items
  }, [bundleSearch, bundleCategory, form.name, form.bundledServices])

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
            {isEdit ? t('form.edit') : step === 'service' ? t('form.selectService') : t('form.subscriptionDetails')}
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
                    placeholder={t('form.searchService')}
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
                    {t('category.all')}
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
                  {t('form.customService')}
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
                <FormField label={t('form.name')}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder={t('form.enterName')}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors"
                  />
                </FormField>
              )}

              {/* Price & Currency */}
              <FormField label={t('form.price')}>
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
              <FormField label={t('form.cycle')}>
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
                      {t(`cycle.${c}`)}
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
                      <span className="text-sm text-muted-foreground">{t('form.every')}</span>
                      <input
                        type="number"
                        value={form.customCycleDays || ''}
                        onChange={(e) => updateField('customCycleDays', parseInt(e.target.value) || undefined)}
                        className="w-20 px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 text-sm text-center outline-none focus:border-primary/50"
                        placeholder="30"
                      />
                      <span className="text-sm text-muted-foreground">{t('form.days')}</span>
                    </div>
                  </motion.div>
                )}
              </FormField>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <FormField label={t('form.startDate')}>
                  <DatePicker value={form.startDate} onChange={(val) => updateField('startDate', val)} />
                </FormField>
                <FormField label={t('form.endDateOptional')}>
                  <DatePicker
                    value={form.endDate || ''}
                    onChange={(val) => updateField('endDate', val || undefined)}
                    placeholder={t('form.noEndDate')}
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField label={t('form.memoOptional')}>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder={t('form.addMemo')}
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </FormField>

              {/* Bundled services */}
              <FormField label={t('form.bundledOptional')}>
                <div className="space-y-2">
                  {form.bundledServices?.map((bs, i) => (
                    <div key={`${bs.name}-${i}`} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/40">
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                        style={{ backgroundColor: `${bs.color}15` }}
                      >
                        <ServiceIcon icon={bs.icon} name={bs.name} color={bs.color} size={16} />
                      </div>
                      <span className="flex-1 text-sm text-foreground truncate">{bs.name}</span>
                      <button
                        onClick={() => removeBundledService(i)}
                        className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowBundlePicker(true)}
                    className="flex items-center gap-1.5 w-full p-2.5 rounded-xl border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('form.addBundled')}
                  </button>
                </div>
              </FormField>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.price}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm disabled:opacity-40 transition-all hover:opacity-90 mb-24"
              >
                {submitting ? t('form.saving') : isEdit ? t('form.updateSubscription') : t('form.add')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bundle picker dialog */}
        <AnimatePresence>
          {showBundlePicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
              onClick={() => setShowBundlePicker(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-background rounded-t-2xl border-t border-border/50 max-h-[70vh] flex flex-col"
              >
                <div className="p-4 border-b border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{t('form.selectBundled')}</h3>
                    <button
                      onClick={() => setShowBundlePicker(false)}
                      className="p-1 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={t('form.searchService')}
                      value={bundleSearch}
                      onChange={(e) => setBundleSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/60 border border-border/50 text-sm outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setBundleCategory(null)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                        !bundleCategory ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      {t('category.all')}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBundleCategory(cat === bundleCategory ? null : cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          bundleCategory === cat
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
                  <div className="grid grid-cols-2 gap-2">
                    {bundleFilteredServices.map((service) => (
                      <button
                        key={service.name}
                        onClick={() =>
                          addBundledService({ name: service.name, icon: service.icon, color: service.color })
                        }
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-card border border-border/50 hover:border-border hover:shadow-sm text-left transition-all"
                      >
                        <div
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{ backgroundColor: `${service.color}15` }}
                        >
                          <ServiceIcon icon={service.icon} name={service.name} color={service.color} size={16} />
                        </div>
                        <span className="text-xs font-medium text-foreground truncate">{service.name}</span>
                      </button>
                    ))}
                  </div>
                  {bundleFilteredServices.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">{t('form.noMatch')}</p>
                  )}
                </div>
              </motion.div>
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

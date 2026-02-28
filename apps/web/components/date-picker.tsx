'use client'

import { useRef } from 'react'
import { Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'
import { useTranslation } from '@/lib/i18n'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const locale = t('settings.language') === 'Language' ? enUS : zhCN

  const handleClick = () => {
    inputRef.current?.showPicker()
  }

  const displayValue = value ? format(parseISO(value), 'PPP', { locale }) : placeholder || t('form.selectDate')

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-secondary/60 border border-border/50 text-sm text-left outline-none focus:border-primary/50 transition-colors"
      >
        <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{displayValue}</span>
        <Calendar className="w-4 h-4 text-muted-foreground" />
      </button>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
        tabIndex={-1}
      />
    </div>
  )
}

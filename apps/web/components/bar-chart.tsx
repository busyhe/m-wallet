'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo, useCallback } from 'react'

interface BarChartData {
  label: string
  value: number
  fullLabel?: string
}

interface BarChartProps {
  data: BarChartData[]
  height?: number
  color?: string
  defaultActiveIndex?: number
}

// Format Y-axis value for display
function formatYValue(value: number): string {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}w`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
  if (value === 0) return '0'
  return value.toFixed(0)
}

export function BarChart({ data, height = 140, color = 'var(--primary)', defaultActiveIndex }: BarChartProps) {
  const safeDefault =
    defaultActiveIndex !== undefined && defaultActiveIndex >= 0 && defaultActiveIndex < data.length
      ? defaultActiveIndex
      : null
  const [activeIndex, setActiveIndex] = useState<number | null>(safeDefault)

  const maxValue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 0)
    return max === 0 ? 1 : max * 1.1
  }, [data])

  // Generate Y-axis tick values
  const yTicks = useMemo(() => {
    const ticks = [0, 0.25, 0.5, 0.75, 1]
    return ticks.map((t) => Math.round(maxValue * t))
  }, [maxValue])

  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  // Handle click outside to deselect
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-bar]')) return
    setActiveIndex(null)
  }, [])

  return (
    <div className="w-full">
      <div className="flex" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between items-end pr-2 py-0 shrink-0">
          {yTicks
            .slice()
            .reverse()
            .map((tick, i) => (
              <span key={i} className="text-[9px] text-muted-foreground/60 tabular-nums leading-none">
                {formatYValue(tick)}
              </span>
            ))}
        </div>

        {/* Chart area */}
        <div className="relative flex-1 overflow-hidden" onClick={handleContainerClick}>
          {/* Background Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-2">
            {gridLines
              .slice()
              .reverse()
              .map((line) => (
                <div key={line} className="w-full border-t border-border/20 border-dashed" style={{ height: '1px' }} />
              ))}
          </div>

          <div className="relative flex items-end gap-1 w-full h-full overflow-x-auto no-scrollbar pt-6">
            <AnimatePresence mode="popLayout">
              {data.map((item, index) => {
                const percentage = (item.value / maxValue) * 100
                const isActive = activeIndex === index
                const isFirst = index <= 2
                const isLast = index >= data.length - 3

                return (
                  <motion.div
                    key={item.label}
                    data-bar
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: index * (0.3 / data.length),
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="relative flex-1 min-w-3 group h-full cursor-pointer"
                    style={{ originY: 1 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveIndex(isActive ? null : index)
                    }}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute top-0 px-2 py-1.5 bg-background/80 backdrop-blur-md border border-border/50 rounded-lg transition-all duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl flex flex-col items-center gap-0.5 ${
                        isActive
                          ? 'opacity-100 scale-100'
                          : 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
                      }`}
                      style={{
                        // Position tooltip: left-align for first items, right-align for last items, center otherwise
                        ...(isFirst
                          ? { left: 0 }
                          : isLast
                            ? { right: 0 }
                            : { left: '50%', transform: 'translateX(-50%)' })
                      }}
                    >
                      <span className="text-[10px] font-medium text-foreground">{item.fullLabel || item.label}</span>
                      <span className="text-xs font-bold text-primary">
                        {process.env.NEXT_PUBLIC_LANGUAGE === 'en' ? '$' : '¥'}
                        {item.value.toFixed(2)}
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="relative w-full h-full flex items-end">
                      <motion.div
                        className={`w-full rounded-t-sm transition-all duration-200 ${
                          isActive ? 'brightness-125 shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]' : ''
                        } group-hover:brightness-125 group-hover:shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]`}
                        style={{
                          height: `${Math.max(percentage, 1)}%`,
                          backgroundColor: item.value > 0 ? color : 'var(--secondary)',
                          backgroundImage:
                            item.value > 0 ? 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)' : 'none',
                          opacity: item.value > 0 ? 1 : 0.2
                        }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* X-Axis labels (minimal) */}
      <div className="flex justify-between px-1 border-t border-border/50 pt-2" style={{ marginLeft: '36px' }}>
        {data.length > 0 ? (
          <>
            <span className="text-[10px] font-medium text-muted-foreground uppercase">{data[0]?.label}</span>
            {data.length > 6 && (
              <span className="text-[10px] font-medium text-muted-foreground uppercase">
                {data[Math.floor(data.length / 2)]?.label}
              </span>
            )}
            <span className="text-[10px] font-medium text-muted-foreground uppercase">
              {data[data.length - 1]?.label}
            </span>
          </>
        ) : null}
      </div>
    </div>
  )
}

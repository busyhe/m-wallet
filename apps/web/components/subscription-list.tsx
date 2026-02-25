'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from 'lucide-react'
import type { Subscription, SortMode } from '@/lib/types'
import { reorderSubscriptions } from '@/lib/actions/subscriptions'
import { SubscriptionCard } from './subscription-card'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onSelect: (sub: Subscription) => void
}

// Sortable wrapper for subscription card
function SortableSubscriptionCard({
  subscription,
  onClick,
  index,
  dragMode
}: {
  subscription: Subscription
  onClick: () => void
  index: number
  dragMode: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: subscription.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className={`relative ${isDragging ? 'opacity-40' : ''}`} {...attributes}>
      <div className="flex items-center gap-1">
        {dragMode && (
          <div
            {...listeners}
            className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <div className="flex-1">
          <SubscriptionCard subscription={subscription} onClick={onClick} index={index} />
        </div>
      </div>
    </div>
  )
}

const SORT_OPTIONS: { mode: SortMode; label: string; icon?: React.ReactNode }[] = [
  { mode: 'custom', label: '自定义' },
  { mode: 'price-desc', label: '金额↓', icon: <ArrowDown className="w-3 h-3" /> },
  { mode: 'price-asc', label: '金额↑', icon: <ArrowUp className="w-3 h-3" /> },
  { mode: 'name-asc', label: '名称', icon: <ArrowUpDown className="w-3 h-3" /> }
]

export function SubscriptionList({ subscriptions: initialSubs, onSelect }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubs)
  const [sortMode, setSortMode] = useState<SortMode>('custom')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  const sortedSubscriptions = useMemo(() => {
    const items = [...subscriptions]
    switch (sortMode) {
      case 'price-desc':
        return items.sort((a, b) => b.price - a.price)
      case 'price-asc':
        return items.sort((a, b) => a.price - b.price)
      case 'name-asc':
        return items.sort((a, b) => a.name.localeCompare(b.name))
      case 'name-desc':
        return items.sort((a, b) => b.name.localeCompare(a.name))
      default:
        return items
    }
  }, [subscriptions, sortMode])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = subscriptions.findIndex((s) => s.id === active.id)
      const newIndex = subscriptions.findIndex((s) => s.id === over.id)
      const reordered = arrayMove(subscriptions, oldIndex, newIndex)
      setSubscriptions(reordered)

      // Persist to Notion
      await reorderSubscriptions(reordered.map((s) => s.id))
    },
    [subscriptions]
  )

  const activeSub = activeId ? subscriptions.find((s) => s.id === activeId) : null
  const isDragMode = sortMode === 'custom'

  return (
    <div className="space-y-3">
      {/* Sort controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {SORT_OPTIONS.map((opt) => (
          <motion.button
            key={opt.mode}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortMode(opt.mode)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              sortMode === opt.mode ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            {opt.icon}
            {opt.label}
          </motion.button>
        ))}
      </div>

      {/* Subscription list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sortedSubscriptions.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sortedSubscriptions.map((sub, i) => (
                <SortableSubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onClick={() => onSelect(sub)}
                  index={i}
                  dragMode={isDragMode}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>

        <DragOverlay>
          {activeSub && (
            <div className="opacity-90 shadow-xl rounded-xl">
              <SubscriptionCard subscription={activeSub} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {sortedSubscriptions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground text-sm"
        >
          暂无订阅，点击 + 添加
        </motion.div>
      )}
    </div>
  )
}

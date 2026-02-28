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
import { GripVertical } from 'lucide-react'
import type { Subscription } from '@/lib/types'
import { reorderSubscriptions } from '@/lib/actions/subscriptions'
import { useSortMode } from '@/lib/hooks/use-sort-mode'
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
        <div className="flex-1">
          <SubscriptionCard subscription={subscription} onClick={onClick} index={index} />
        </div>
      </div>
    </div>
  )
}

export function SubscriptionList({ subscriptions: initialSubs, onSelect }: SubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubs)
  const { sortMode } = useSortMode()
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

import { useState, useEffect } from 'react'
import type { SortMode } from '@/lib/types'

const SORT_MODE_KEY = 'm-wallet:sort-mode'

export function useSortMode() {
  const [sortMode, setSortModeState] = useState<SortMode>('custom')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SORT_MODE_KEY)
      if (stored) {
        setSortModeState(stored as SortMode)
      }
    } catch (e) {
      console.error('Failed to load sort mode', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const setSortMode = (mode: SortMode) => {
    setSortModeState(mode)
    try {
      localStorage.setItem(SORT_MODE_KEY, mode)
      window.dispatchEvent(new Event('m-wallet:sort-mode-change'))
    } catch (e) {
      console.error('Failed to save sort mode', e)
    }
  }

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(SORT_MODE_KEY)
        if (stored) {
          setSortModeState(stored as SortMode)
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener('m-wallet:sort-mode-change', handleStorage)
    return () => window.removeEventListener('m-wallet:sort-mode-change', handleStorage)
  }, [])

  return { sortMode, setSortMode, isLoaded }
}

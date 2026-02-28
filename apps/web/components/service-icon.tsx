'use client'

import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'

interface ServiceIconProps {
  icon?: string | null
  name: string
  color: string
  size?: number
  className?: string
}

/**
 * Unified service icon component.
 * Supports both iconify slug (e.g. 'simple-icons:netflix') and legacy URL formats.
 * Falls back to the first character of the service name when icon is unavailable or fails to load.
 */
export function ServiceIcon({ icon, name, color, size = 20, className }: ServiceIconProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Use the first letter of the name as a fallback. Default to '?' if name is missing.
  const fallbackLetter = (name?.trim()?.[0] || '?').toUpperCase()

  // Timeout-based fallback for Iconify slugs (since they don't have a reliable onError)
  useEffect(() => {
    if (icon && !icon.startsWith('http') && !isLoaded) {
      const timer = setTimeout(() => {
        if (!isLoaded) {
          setHasError(true)
        }
      }, 1500) // 1.5s timeout for icon loading
      return () => clearTimeout(timer)
    }
  }, [icon, isLoaded])

  const renderFallback = () => (
    <span
      className={`font-semibold flex items-center justify-center ${className || ''}`}
      style={{
        color,
        fontSize: `${Math.round(size * 0.8)}px`,
        width: size,
        height: size,
        lineHeight: 1
      }}
    >
      {fallbackLetter}
    </span>
  )

  // If there's an error or no icon, show the fallback letter
  if (hasError || !icon || typeof icon !== 'string') {
    return renderFallback()
  }

  // Legacy URL format: render as img tag for backward compatibility
  if (icon.startsWith('http')) {
    return (
      <img
        src={icon}
        alt={name}
        width={size}
        height={size}
        className={`object-contain ${className || ''}`}
        crossOrigin="anonymous"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    )
  }

  // Iconify slug format
  return (
    <Icon
      icon={icon}
      width={size}
      height={size}
      style={{ color }}
      className={className}
      onLoad={() => setIsLoaded(true)}
    />
  )
}

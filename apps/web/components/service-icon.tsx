'use client'

import { Icon } from '@iconify/react'

interface ServiceIconProps {
  icon: string
  name: string
  color: string
  size?: number
  className?: string
}

/**
 * Unified service icon component.
 * Supports both iconify slug (e.g. 'simple-icons:netflix') and legacy URL formats.
 * Falls back to the first character of the service name when icon is unavailable.
 */
export function ServiceIcon({ icon, name, color, size = 20, className }: ServiceIconProps) {
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
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.textContent = name.charAt(0).toUpperCase()
            parent.style.color = color
            parent.style.fontWeight = '600'
            parent.style.fontSize = `${Math.round(size * 0.8)}px`
          }
        }}
      />
    )
  }

  // Empty icon: show fallback letter
  if (!icon) {
    return (
      <span className={`font-semibold ${className || ''}`} style={{ color, fontSize: `${Math.round(size * 0.8)}px` }}>
        {name.charAt(0).toUpperCase()}
      </span>
    )
  }

  // Iconify slug format
  return <Icon icon={icon} width={size} height={size} style={{ color }} className={className} />
}

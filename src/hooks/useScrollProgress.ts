'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to track scroll progress as a percentage (0-1)
 * Used for the signature route line scroll indicator
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const newProgress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0
      setProgress(newProgress)
    }

    // Initial calculation
    handleScroll()

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return progress
}

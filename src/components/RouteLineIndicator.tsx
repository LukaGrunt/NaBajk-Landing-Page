'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './RouteLineIndicator.module.css'

/**
 * Signature Element: Route Line Scroll Indicator
 *
 * An animated SVG path that draws itself as the user scrolls,
 * reminiscent of a cycling route on a map. The path runs along
 * the left edge of the viewport, creating a visual scroll progress
 * indicator that ties directly to the cycling/routes theme.
 */
export function RouteLineIndicator() {
  const pathRef = useRef<SVGPathElement>(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setIsVisible(false)
      return
    }

    const path = pathRef.current
    if (!path) return

    // Get the total length of the path
    const pathLength = path.getTotalLength()

    // Set up the path for drawing animation
    path.style.strokeDasharray = `${pathLength}`
    path.style.strokeDashoffset = `${pathLength}`

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollTop = window.scrollY
      const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0

      // Draw the path based on scroll progress
      const drawLength = pathLength * progress
      path.style.strokeDashoffset = `${pathLength - drawLength}`
    }

    // Initial calculation
    handleScroll()

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className={styles.container} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox="0 0 60 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Route path - designed to look like a winding cycling route */}
        <path
          ref={pathRef}
          className={styles.path}
          d="
            M 30 0
            C 30 50, 45 80, 35 120
            S 15 180, 30 220
            C 45 260, 50 300, 35 340
            S 10 400, 30 450
            C 50 500, 45 540, 30 580
            S 15 640, 35 680
            C 55 720, 45 760, 30 800
            S 20 860, 35 900
            C 50 940, 40 970, 30 1000
          "
        />

        {/* Animated dot that follows the path end */}
        <circle
          className={styles.dot}
          cx="30"
          cy="0"
          r="4"
        >
          <animateMotion
            dur="0.1s"
            repeatCount="indefinite"
            calcMode="linear"
          >
            <mpath href="#routePath" />
          </animateMotion>
        </circle>
      </svg>

      {/* Glow effect layer */}
      <svg
        className={styles.glowSvg}
        viewBox="0 0 60 1000"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className={styles.glowPath}
          d="
            M 30 0
            C 30 50, 45 80, 35 120
            S 15 180, 30 220
            C 45 260, 50 300, 35 340
            S 10 400, 30 450
            C 50 500, 45 540, 30 580
            S 15 640, 35 680
            C 55 720, 45 760, 30 800
            S 20 860, 35 900
            C 50 940, 40 970, 30 1000
          "
        />
      </svg>
    </div>
  )
}

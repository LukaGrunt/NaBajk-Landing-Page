'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import styles from './ElevationAnimation.module.css'

const PATH_D = "M 0,242 C 30,240 55,237 80,234 C 105,231 130,234 155,232 C 178,230 200,220 225,207 C 252,193 278,172 308,150 C 335,130 368,110 400,95 C 422,84 445,77 468,74 C 482,72 490,71 498,71 C 518,71 535,87 552,106 C 570,126 586,152 612,175 C 632,192 652,210 678,217 C 698,222 720,220 745,217 C 768,214 790,198 814,176 C 834,158 856,136 880,113 C 898,96 909,87 918,83 C 928,79 936,80 945,84 C 960,92 972,114 984,138 C 996,162 1012,188 1040,208 C 1062,222 1090,232 1118,237 C 1142,241 1168,242 1200,242"

export function ElevationAnimation() {
  const { locale } = useLanguage()
  const sl = locale === 'sl'
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const fcRef = useRef<SVGRectElement>(null)
  const lcRef = useRef<SVGRectElement>(null)
  const cyclistRef = useRef<SVGGElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const dot2Ref = useRef<SVGCircleElement>(null)
  const progRef = useRef<HTMLDivElement>(null)
  const kmRef = useRef<HTMLSpanElement>(null)
  const altRef = useRef<HTMLSpanElement>(null)
  const lvRef = useRef<SVGGElement>(null)
  const lbRef = useRef<SVGGElement>(null)
  const lmRef = useRef<SVGGElement>(null)
  const rafRef = useRef<number | null>(null)
  const tRef = useRef<number | null>(null)
  const totalLengthRef = useRef(0)

  const DUR = 6000
  const PAUSE = 1400
  const TOTAL = DUR + PAUSE

  function easeInOut(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v))
  }

  function y2alt(y: number) {
    return Math.round(200 + (1 - clamp((y - 71) / 181, 0, 1)) * (2055 - 200))
  }

  useEffect(() => {
    const line = lineRef.current
    if (!line) return

    // Get total path length after mount
    totalLengthRef.current = line.getTotalLength()

    const peaks = [
      { ref: lvRef, s: [0.35, 0.58] },
      { ref: lbRef, s: [0.52, 0.67] },
      { ref: lmRef, s: [0.70, 0.90] },
    ]

    function tick(ts: number) {
      if (tRef.current === null) tRef.current = ts
      const elapsed = (ts - tRef.current) % TOTAL
      const p = easeInOut(Math.min(elapsed / DUR, 1))
      const L = totalLengthRef.current

      if (fcRef.current) fcRef.current.setAttribute('width', String(Math.max(0, p * 1200 - 2)))
      if (lcRef.current) lcRef.current.setAttribute('width', String(Math.min(p * 1200 + 2, 1200)))

      if (line && L > 0) {
        const pt = line.getPointAtLength(p * L)
        const pt2 = line.getPointAtLength(Math.max(0, p * L - 8))
        const angle = Math.atan2(pt.y - pt2.y, pt.x - pt2.x) * 180 / Math.PI

        if (p > 0.01 && cyclistRef.current) {
          cyclistRef.current.setAttribute('opacity', '1')
          cyclistRef.current.setAttribute('transform', `translate(${pt.x},${pt.y}) rotate(${angle})`)
        }

        const dotOpacity = p < 0.98 ? 0.8 : (1 - (p - 0.98) / 0.02) * 0.8
        if (dotRef.current) {
          dotRef.current.setAttribute('cx', String(pt.x))
          dotRef.current.setAttribute('cy', String(pt.y))
          dotRef.current.setAttribute('opacity', String(dotOpacity))
        }
        if (dot2Ref.current) {
          dot2Ref.current.setAttribute('cx', String(pt.x))
          dot2Ref.current.setAttribute('cy', String(pt.y))
          dot2Ref.current.setAttribute('opacity', String(dotOpacity * 0.35))
        }

        if (altRef.current) altRef.current.textContent = y2alt(pt.y) + ' m'
      }

      if (progRef.current) progRef.current.style.width = (p * 100) + '%'
      if (kmRef.current) kmRef.current.textContent = Math.round(p * 127) + ' km'

      peaks.forEach(pk => {
        const el = pk.ref.current
        if (!el) return
        const [s, e2] = pk.s
        let op = 0
        if (p >= s && p <= e2) op = clamp(Math.min((p - s) / 0.04, (e2 - p) / 0.04), 0, 1)
        el.style.opacity = String(op)
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    function start() {
      if (!rafRef.current) {
        tRef.current = null
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    function stop() {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }

    const observer = new IntersectionObserver(
      entries => { entries[0].isIntersecting ? start() : stop() },
      { threshold: 0.05 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    start()

    return () => {
      stop()
      observer.disconnect()
    }
  }, [])

  return (
    <section className={styles.section} id="elevation" ref={sectionRef}>
      <div className={`${styles.header} ${styles.container}`}>
        <div>
          <div className={styles.routeName}>
            {sl ? 'Vršič · Mangart · Soška zanka' : 'Vršič · Mangart · Soča Loop'}
          </div>
          <div className={styles.routeSub}>Kranjska Gora → Bovec → Kobarid</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statV}>127 km</span>
            <span className={styles.statL}>{sl ? 'razdalja' : 'distance'}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statV}>2,410 m</span>
            <span className={styles.statL}>{sl ? 'vzpon ↑' : 'elevation ↑'}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statV} ref={altRef}>— m</span>
            <span className={styles.statL}>{sl ? 'višina' : 'altitude'}</span>
          </div>
        </div>
      </div>

      <div className={styles.svgWrap}>
        <svg id="elev-svg" viewBox="0 0 1200 290" preserveAspectRatio="xMidYMid meet" aria-hidden="true" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
          <defs>
            <linearGradient id="eTF" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00BF76" stopOpacity=".16"/>
              <stop offset="65%" stopColor="#00BF76" stopOpacity=".05"/>
              <stop offset="100%" stopColor="#00BF76" stopOpacity=".01"/>
            </linearGradient>
            <linearGradient id="eLG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#00995E"/>
              <stop offset="50%" stopColor="#00BF76"/>
              <stop offset="100%" stopColor="#33CC91"/>
            </linearGradient>
            <filter id="eGlow" x="-5%" y="-100%" width="110%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b1"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="b2"/>
              <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="eCG" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <clipPath id="eFC"><rect ref={fcRef} id="e-fc" x="0" y="0" width="0" height="290"/></clipPath>
            <clipPath id="eLC"><rect ref={lcRef} id="e-lc" x="0" y="0" width="0" height="290"/></clipPath>
          </defs>

          <line x1="0" y1="88"  x2="1200" y2="88"  stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
          <line x1="0" y1="128" x2="1200" y2="128" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
          <line x1="0" y1="170" x2="1200" y2="170" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
          <line x1="0" y1="212" x2="1200" y2="212" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>

          <text x="6" y="85"  fontFamily="JetBrains Mono,monospace" fontSize="11" fill="rgba(255,255,255,.08)">2000m</text>
          <text x="6" y="125" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="rgba(255,255,255,.08)">1600m</text>
          <text x="6" y="167" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="rgba(255,255,255,.08)">1200m</text>
          <text x="6" y="209" fontFamily="JetBrains Mono,monospace" fontSize="11" fill="rgba(255,255,255,.08)">800m</text>

          <path d={PATH_D + " L 1200,268 L 0,268 Z"} fill="url(#eTF)" clipPath="url(#eFC)"/>
          <path d={PATH_D} stroke="rgba(0,191,118,.08)" strokeWidth="10" fill="none" clipPath="url(#eLC)"/>
          <path ref={lineRef} d={PATH_D} stroke="url(#eLG)" strokeWidth="2.5" fill="none" filter="url(#eGlow)" clipPath="url(#eLC)"/>

          <circle ref={dotRef} cx="0" cy="0" r="4" fill="#00BF76" opacity="0" filter="url(#eGlow)"/>
          <circle ref={dot2Ref} cx="0" cy="0" r="8" fill="none" stroke="#00BF76" strokeWidth="1" opacity="0"/>

          {/* Peak labels */}
          <g ref={lvRef} style={{ opacity: 0, transition: 'opacity .5s ease' }}>
            <line x1="498" y1="71" x2="498" y2="50" stroke="rgba(0,191,118,.3)" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="498" y="44" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="13" fontWeight="600" fill="#00BF76" filter="url(#eGlow)">Vršič</text>
            <text x="498" y="58" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="rgba(255,255,255,.4)">1611 m</text>
          </g>
          <g ref={lbRef} style={{ opacity: 0, transition: 'opacity .5s ease' }}>
            <line x1="678" y1="217" x2="678" y2="196" stroke="rgba(0,191,118,.3)" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="678" y="191" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="11" fontWeight="600" fill="#00BF76" filter="url(#eGlow)">Bovec</text>
            <text x="678" y="204" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="rgba(255,255,255,.4)">450 m</text>
          </g>
          <g ref={lmRef} style={{ opacity: 0, transition: 'opacity .5s ease' }}>
            <line x1="918" y1="83" x2="918" y2="58" stroke="rgba(0,191,118,.3)" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="918" y="52" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="13" fontWeight="600" fill="#00BF76" filter="url(#eGlow)">Mangart</text>
            <text x="918" y="66" textAnchor="middle" fontFamily="JetBrains Mono,monospace" fontSize="10" fill="rgba(255,255,255,.4)">2055 m</text>
          </g>

          {/* Cyclist */}
          <g ref={cyclistRef} opacity="0" filter="url(#eCG)">
            <circle cx="-11" cy="5" r="7.5" stroke="#00BF76" strokeWidth="1.5" fill="none"/>
            <circle cx="11" cy="5" r="7.5" stroke="#00BF76" strokeWidth="1.5" fill="none"/>
            <line x1="-11" y1="5" x2="1" y2="-4" stroke="#00BF76" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="-4" x2="-1" y2="2" stroke="#00BF76" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="-4" x2="11" y2="5" stroke="#00BF76" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="-4" x2="7" y2="-11" stroke="#00BF76" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="7" y1="-11" x2="11" y2="-11" stroke="#00BF76" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="11" y1="-11" x2="11" y2="5" stroke="#00BF76" strokeWidth="1" strokeLinecap="round"/>
            <path d="M -1,2 Q 3,-9 10,-11" stroke="#33CC91" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="12" cy="-14" r="4" fill="#00BF76"/>
          </g>

          <line x1="0" y1="268" x2="1200" y2="268" stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
        </svg>
      </div>

      <div className={`${styles.progWrap} ${styles.container}`}>
        <span className={styles.progLabel}>KM 0</span>
        <div className={styles.progTrack}>
          <div className={styles.progFill} ref={progRef} />
        </div>
        <span className={styles.kmLabel} ref={kmRef}>0 km</span>
      </div>
    </section>
  )
}

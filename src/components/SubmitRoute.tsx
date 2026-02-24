'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { supabase } from '@/lib/supabaseClient'
import { parseGpxFile } from '@/lib/gpx-parser'
import { REGIONS, DIFFICULTIES } from '@/lib/database.types'
import styles from './SubmitRoute.module.css'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const MAX_GPX_SIZE = 5 * 1024 * 1024 // 5MB

export function SubmitRoute() {
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [formState, setFormState] = useState<FormState>('idle')

  // Form fields
  const [title, setTitle] = useState('')
  const [region, setRegion] = useState<string>(REGIONS[0].value)
  const [difficulty, setDifficulty] = useState<string>('Srednja')
  const [whyGood, setWhyGood] = useState('')
  const [traffic, setTraffic] = useState('')
  const [roadCondition, setRoadCondition] = useState('')

  // GPX state
  const [gpxData, setGpxData] = useState<string | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [elevationM, setElevationM] = useState<number | null>(null)
  const [gpxParsing, setGpxParsing] = useState(false)
  const [gpxError, setGpxError] = useState<string | null>(null)
  const [gpxFileName, setGpxFileName] = useState<string | null>(null)

  // Honeypot
  const [honeypot, setHoneypot] = useState('')

  function resetForm() {
    setTitle('')
    setRegion(REGIONS[0].value)
    setDifficulty('Srednja')
    setWhyGood('')
    setTraffic('')
    setRoadCondition('')
    setGpxData(null)
    setDistanceKm(null)
    setElevationM(null)
    setGpxError(null)
    setGpxFileName(null)
    setFormState('idle')
  }

  function openModal() {
    resetForm()
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
  }

  async function handleGpxUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.gpx')) {
      setGpxError(t('submitRouteInvalidFile'))
      return
    }

    if (file.size > MAX_GPX_SIZE) {
      setGpxError(t('submitRouteFileTooLarge'))
      return
    }

    setGpxParsing(true)
    setGpxError(null)

    try {
      const result = await parseGpxFile(file)

      if (result.error) {
        setGpxError(result.error)
        return
      }

      // Read file content for storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setGpxData(content)
        setDistanceKm(result.distance_km)
        setElevationM(result.elevation_m)
        setGpxFileName(file.name)
      }
      reader.readAsText(file)
    } catch {
      setGpxError(t('submitRouteError'))
    } finally {
      setGpxParsing(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Bot check
    if (honeypot) return

    if (!gpxData || !title.trim()) return

    setFormState('loading')

    try {
      if (!supabase) {
        console.log('[DEV MODE] Would submit route:', { title })
        await new Promise(resolve => setTimeout(resolve, 800))
        setFormState('success')
        return
      }

      const { error } = await supabase
        .from('routes')
        .insert({
          title: title.trim(),
          gpx_data: gpxData,
          distance_km: distanceKm,
          elevation_m: elevationM,
          difficulty,
          region,
          traffic: traffic.trim() || null,
          road_condition: roadCondition.trim() || null,
          why_good: whyGood.trim() || null,
          published: true,
        })

      if (error) {
        console.error('Route submission error:', error)
        setFormState('error')
      } else {
        setFormState('success')
      }
    } catch (err) {
      console.error('Route submission error:', err)
      setFormState('error')
    }
  }

  return (
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.tagline}>{t('submitRouteTagline')}</p>
            <h2 className={styles.title}>{t('submitRouteTitle')}</h2>
            <p className={styles.description}>{t('submitRouteDescription')}</p>
            <button onClick={openModal} className={styles.ctaButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15V17C3 19.2091 4.79086 21 7 21H17C19.2091 21 21 19.2091 21 17V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {t('submitRouteButton')}
            </button>
          </div>
        </div>
      </section>

      {showModal && (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{t('submitRouteModalTitle')}</h3>
              <button onClick={closeModal} className={styles.modalClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {formState === 'success' ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className={styles.successMessage}>{t('submitRouteSuccess')}</p>
                <button onClick={closeModal} className={styles.cancelBtn}>OK</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.modalBody}>
                  {formState === 'error' && (
                    <div className={styles.error} role="alert">{t('submitRouteError')}</div>
                  )}

                  {/* GPX Upload */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      {t('submitRouteGpxLabel')} <span className={styles.formHint}>({t('submitRouteGpxHint')})</span>
                    </label>
                    <input
                      type="file"
                      accept=".gpx"
                      onChange={handleGpxUpload}
                      className={styles.fileInput}
                      disabled={gpxParsing}
                    />
                    {gpxParsing && <p className={styles.gpxInfo}>Parsing...</p>}
                    {gpxError && <p className={styles.gpxError}>{gpxError}</p>}
                    {distanceKm !== null && elevationM !== null && (
                      <p className={styles.gpxInfo}>
                        {t('submitRouteCalculated')}: {distanceKm} km, {elevationM} m
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('submitRouteTitleLabel')}</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={styles.formInput}
                      required
                    />
                  </div>

                  {/* Region + Difficulty */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t('submitRouteRegionLabel')}</label>
                      <select value={region} onChange={(e) => setRegion(e.target.value)} className={styles.formSelect}>
                        {REGIONS.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>{t('submitRouteDifficultyLabel')}</label>
                      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={styles.formSelect}>
                        {DIFFICULTIES.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Why good */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('submitRouteWhyGoodLabel')}</label>
                    <textarea
                      value={whyGood}
                      onChange={(e) => setWhyGood(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </div>

                  {/* Traffic */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('submitRouteTrafficLabel')}</label>
                    <textarea
                      value={traffic}
                      onChange={(e) => setTraffic(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </div>

                  {/* Road condition */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>{t('submitRouteConditionLabel')}</label>
                    <textarea
                      value={roadCondition}
                      onChange={(e) => setRoadCondition(e.target.value)}
                      className={styles.formTextarea}
                    />
                  </div>

                  {/* Honeypot */}
                  <input
                    type="text"
                    name="company"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
                    aria-hidden="true"
                  />
                </div>

                <div className={styles.modalFooter}>
                  <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={formState === 'loading' || !gpxData || !title.trim()}
                  >
                    {formState === 'loading' ? (
                      <>
                        <span className={styles.spinner} />
                        {t('submitRouteSubmitting')}
                      </>
                    ) : (
                      t('submitRouteSubmitButton')
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

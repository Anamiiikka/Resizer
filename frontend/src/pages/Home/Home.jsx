import React, { useState, useCallback, useRef, useLayoutEffect } from 'react'
import styles from './Home.module.css'
import ImageUploader from '../../components/ImageUploader'
import AspectRatioSelector from '../../components/AspectRatioSelector'
import ImagePreview from '../../components/ImagePreview'
import Loader from '../../components/Loader'
import { useImageProcess } from '../../hooks/useImageProcess'

const HOW_IT_WORKS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'UPLOAD YOUR IMAGE',
    desc: 'Choose the image you want to extend. Supports JPEG, PNG, and WebP.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: 'SELECT OUTPUT SIZE',
    desc: 'Pick a preset aspect ratio or manually drag the canvas to your target dimensions.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'GENERATE & DOWNLOAD',
    desc: 'Click generate and download your AI-extended image in full resolution.',
  },
]

const FRAME_PADDING = 56

/**
 * Fits a target aspect ratio inside the available panel, returning
 * the largest width/height that respects both the panel bounds and the ratio.
 */
function fitToPanel(panel, ratio) {
  const availW = Math.max(0, panel.width - FRAME_PADDING)
  const availH = Math.max(0, panel.height - FRAME_PADDING)
  if (availW <= 0 || availH <= 0) return { w: 0, h: 0 }
  let w = availW
  let h = w / ratio
  if (h > availH) {
    h = availH
    w = h * ratio
  }
  return { w, h }
}

export default function Home() {
  const [file, setFile]             = useState(null)
  const [targetSize, setTargetSize] = useState({ width: 1920, height: 1080 })
  const [imgError, setImgError]     = useState(false)
  const rightPanelRef               = useRef(null)
  const [frameSize, setFrameSize]   = useState({ w: 0, h: 0 })

  useLayoutEffect(() => {
    const panel = rightPanelRef.current
    if (!panel) return
    const ratio = targetSize.width / targetSize.height
    const update = () => {
      const rect = panel.getBoundingClientRect()
      setFrameSize(fitToPanel(rect, ratio))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(panel)
    return () => ro.disconnect()
  }, [targetSize.width, targetSize.height])

  const { loading, error, result, generate, fetchDimensions, reset } =
    useImageProcess()

  const handleFileSelect = useCallback(async (selectedFile) => {
    setFile(selectedFile)
    reset()
    if (selectedFile) {
      await fetchDimensions(selectedFile)
    }
  }, [reset, fetchDimensions])

  const handleGenerate = () => {
    if (!file) return
    generate(file, targetSize.width, targetSize.height)
  }

  const handleReset = () => {
    setFile(null)
    reset()
  }

  const outputUrl    = result?.output_url

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>

        {/* ── Two-column card ── */}
        <div className={styles.mainCard}>

          {/* Left panel — controls */}
          <div className={styles.leftPanel}>
            <div className={styles.titleBlock}>
              <h1 className={styles.titleLine1}>SEAMLESS AI</h1>
              <h1 className={styles.titleLine2}>OUTPAINTING</h1>
              <p className={styles.titleDesc}>
                Upload an image and let AI extend it beyond its original boundaries — seamlessly.
              </p>
            </div>

            <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />

            <div className={styles.sizeSection}>
              <AspectRatioSelector onChange={setTargetSize} disabled={loading} />
            </div>

            {error && (
              <div className={styles.error}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={!file || loading}
              title={!file ? 'Upload an image first' : ''}
            >
              {loading ? (
                <>
                  <span className={styles.btnSpinner} aria-hidden="true" />
                  <span>Generating…</span>
                </>
              ) : (
                <>
                  <span>{outputUrl ? 'Generate Again' : 'Generate Outpainted Image'}</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M11.85 4.22l-.13-.98c-.03-.24-.23-.41-.47-.41s-.44.17-.47.41l-.13.98c-.38 2.87-2.64 5.13-5.51 5.51l-.98.13c-.24.03-.41.23-.41.47s.17.44.41.47l.98.13c2.87.38 5.13 2.64 5.51 5.51l.13.98c.03.24.23.41.47.41s.44-.17.47-.41l.13-.98c.38-2.87 2.64-5.13 5.51-5.51l.98-.13c.24-.03.41-.23.41-.47s-.17-.44-.41-.47l-.98-.13c-2.87-.38-5.13-2.64-5.51-5.51z" />
                  </svg>
                  <span className={styles.creditBadge}>10</span>
                </>
              )}
            </button>

            <p className={styles.helperText}>
              {loading
                ? 'Hold tight — this usually takes 20–60 seconds'
                : !file
                  ? 'Upload an image to create your AI-extended version'
                  : outputUrl
                    ? `Result ready · ${targetSize.width} × ${targetSize.height}px → download on the right`
                    : `Ready to extend · ${targetSize.width} × ${targetSize.height}px`}
            </p>
          </div>

          {/* Right panel — animated canvas / loader / result */}
          <div className={styles.rightPanel} ref={rightPanelRef}>
            {loading ? (
              <Loader />
            ) : outputUrl ? (
              <ImagePreview outputUrl={outputUrl} originalFile={file} onReset={handleReset} />
            ) : imgError ? (
              <div className={styles.sampleImgFallback}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Drop sample-preview.jpg into /public</span>
              </div>
            ) : (
              <>
                <div className={styles.gridBackdrop} aria-hidden="true" />
                <div
                  className={styles.canvasFrame}
                  style={{
                    width: frameSize.w ? `${frameSize.w}px` : 0,
                    height: frameSize.h ? `${frameSize.h}px` : 0,
                    opacity: frameSize.w ? 1 : 0,
                  }}
                >
                  <img
                    src="/animal-eye-staring-close-up-watch-nature-generative-ai.jpg"
                    alt="AI Outpainting sample output"
                    className={styles.canvasImg}
                    onError={() => setImgError(true)}
                  />
                  <div className={styles.canvasShine} />
                </div>
                <div className={styles.sampleBadge}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  <span className={styles.badgeLabel}>Sample output</span>
                  <span className={styles.badgeDivider} aria-hidden="true" />
                  <span className={styles.badgeDims}>
                    {targetSize.width}
                    <span className={styles.badgeTimes}>×</span>
                    {targetSize.height}
                  </span>
                </div>
              </>
            )}
          </div>

        </div>

        {/* ── How It Works — visible on scroll ── */}
        <div className={styles.howSection}>
          <div className={styles.howDivider} />
          <h2 className={styles.howTitle}>HOW IT WORKS</h2>
          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.title} className={styles.howCard}>
                <div className={styles.howIcon}>{step.icon}</div>
                <h3 className={styles.howCardTitle}>{step.title}</h3>
                <p className={styles.howCardDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

import React, { useState, useCallback, useEffect, useRef } from 'react'
import styles from './Home.module.css'
import ImageUploader from '../../components/ImageUploader'
import AspectRatioSelector from '../../components/AspectRatioSelector'
import CanvasResizer from '../../components/CanvasResizer'
import ImagePreview from '../../components/ImagePreview'
import Loader from '../../components/Loader'
import { useImageProcess } from '../../hooks/useImageProcess'

const MODES = [
  { id: 'preset', label: 'Preset Sizes' },
  { id: 'canvas', label: 'Manual Extend' },
]

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

export default function Home() {
  const [file, setFile]             = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [mode, setMode]             = useState('preset')
  const [targetSize, setTargetSize] = useState({ width: 1024, height: 1024 })

  // Stable object URL — revoke previous one when file changes
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const { loading, error, result, originalDimensions, generate, fetchDimensions, reset } =
    useImageProcess()

  const handleFileSelect = useCallback(async (selectedFile) => {
    setFile(selectedFile)
    reset()
    if (selectedFile) {
      const dims = await fetchDimensions(selectedFile)
      if (dims) setTargetSize({ width: dims.width, height: dims.height })
    }
  }, [reset, fetchDimensions])

  const handleModeSwitch = (id) => {
    setMode(id)
    if (originalDimensions) {
      setTargetSize({ width: originalDimensions.width, height: originalDimensions.height })
    }
  }

  const handleGenerate = () => {
    if (!file) return
    generate(file, targetSize.width, targetSize.height)
  }

  const handleReset = () => {
    setFile(null)
    setMode('preset')
    reset()
  }

  const outputUrl = result?.output_url

  return (
    <div className={styles.page}>
      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbInner}>
          <nav className={styles.breadcrumb}>
            <a href="#" className={styles.breadcrumbLink}>Apps</a>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>AI Outpainting</span>
          </nav>
          <a href="#" className={styles.myGenerations}>
            My Generations
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className={styles.wrapper}>
        <div className={styles.mainCard}>
          {/* Left panel */}
          <div className={styles.leftPanel}>
            <div className={styles.titleBlock}>
              <h1 className={styles.titleLine1}>SEAMLESS AI</h1>
              <h1 className={styles.titleLine2}>OUTPAINTING</h1>
              <p className={styles.titleDesc}>
                Upload an image and let AI extend it beyond its original boundaries — seamlessly.
              </p>
            </div>

            {!outputUrl ? (
              <>
                <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />

                <div className={styles.sizeSection}>
                  <div className={styles.modeTabs}>
                    {MODES.map((m) => (
                      <button
                        key={m.id}
                        className={`${styles.modeTab} ${mode === m.id ? styles.modeTabActive : ''}`}
                        onClick={() => handleModeSwitch(m.id)}
                        disabled={loading || (m.id === 'canvas' && !file)}
                        title={m.id === 'canvas' && !file ? 'Upload an image first' : ''}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {mode === 'preset' ? (
                    <AspectRatioSelector onChange={setTargetSize} disabled={loading} />
                  ) : (
                    <CanvasResizer
                      imageFile={file}
                      originalDimensions={originalDimensions}
                      onChange={setTargetSize}
                    />
                  )}
                </div>

                {error && (
                  <div className={styles.error}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}

                {loading ? (
                  <Loader />
                ) : (
                  <button
                    className={styles.generateBtn}
                    onClick={handleGenerate}
                    disabled={!file || loading}
                    title={!file ? 'Upload an image first' : ''}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Generate Outpainted Image
                    <span className={styles.creditBadge}>+ 10</span>
                  </button>
                )}

                <p className={styles.helperText}>
                  {!file
                    ? 'Upload an image to create your AI-extended version'
                    : `Ready to extend · ${targetSize.width} × ${targetSize.height}px`}
                </p>
              </>
            ) : (
              <div className={styles.resultActions}>
                <div className={styles.successTag}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Generated successfully
                </div>
                <button className={styles.resetBtn} onClick={handleReset}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-3.32" />
                  </svg>
                  Start Over
                </button>
              </div>
            )}
          </div>

          {/* Right panel — preview */}
          <div className={styles.rightPanel}>
            {outputUrl ? (
              <ImagePreview outputUrl={outputUrl} originalFile={file} onReset={handleReset} />
            ) : previewUrl ? (
              <div className={styles.previewBox}>
                <div
                  className={styles.previewFrame}
                  style={{ aspectRatio: `${targetSize.width} / ${targetSize.height}` }}
                >
                  <img
                    src={previewUrl}
                    alt="Uploaded preview"
                    className={styles.previewImg}
                  />
                  <span className={styles.dimBadge}>
                    {targetSize.width} × {targetSize.height}
                  </span>
                </div>
                {loading && (
                  <div className={styles.previewOverlay}>
                    <div className={styles.previewSpinner} />
                    <span>Generating…</span>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.previewPlaceholder}>
                <div className={styles.placeholderIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <p className={styles.placeholderText}>Your image preview will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* ── How It Works ── */}
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

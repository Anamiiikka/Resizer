import React, { useState, useCallback } from 'react'
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

export default function Home() {
  const [file, setFile]           = useState(null)
  const [mode, setMode]           = useState('preset')
  const [targetSize, setTargetSize] = useState({ width: 1024, height: 1024 })

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
    // reset to original dims when switching so canvas starts neutral
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
      <div className={styles.hero}>
        <p className={styles.badge}>Powered by Fal AI</p>
        <h1 className={styles.heading}>AI Image Outpainting</h1>
        <p className={styles.subheading}>
          Extend any image beyond its original boundaries using generative AI.
          Upload an image, pick your target dimensions, and watch it grow.
        </p>
      </div>

      <div className={styles.container}>
        {!outputUrl ? (
          <div className={styles.card}>
            {/* Step 1 */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Upload Image</h2>
              <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />
            </section>

            <div className={styles.divider} />

            {/* Step 2 — mode tabs */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>2. Choose Output Size</h2>

                {/* Tab switcher */}
                <div className={styles.tabs}>
                  {MODES.map((m) => (
                    <button
                      key={m.id}
                      className={`${styles.tab} ${mode === m.id ? styles.tabActive : ''}`}
                      onClick={() => handleModeSwitch(m.id)}
                      disabled={loading || (m.id === 'canvas' && !file)}
                      title={m.id === 'canvas' && !file ? 'Upload an image first' : ''}
                    >
                      {m.id === 'preset' ? (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                        </svg>
                      ) : (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                          <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                        </svg>
                      )}
                      {m.label}
                    </button>
                  ))}
                </div>
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
            </section>

            <div className={styles.divider} />

            {/* Step 3 — generate */}
            <section className={styles.section}>
              {error && (
                <div className={styles.error}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Generate Outpainted Image
                </button>
              )}
            </section>
          </div>
        ) : (
          <div className={styles.card}>
            <ImagePreview outputUrl={outputUrl} originalFile={file} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState, useCallback } from 'react'
import styles from './Home.module.css'
import ImageUploader from '../../components/ImageUploader'
import AspectRatioSelector from '../../components/AspectRatioSelector'
import ImagePreview from '../../components/ImagePreview'
import Loader from '../../components/Loader'
import { useImageProcess } from '../../hooks/useImageProcess'

export default function Home() {
  const [file, setFile] = useState(null)
  const [targetSize, setTargetSize] = useState({ width: 1024, height: 1024 })
  const { loading, error, result, generate, reset } = useImageProcess()

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    reset()
  }, [reset])

  const handleGenerate = () => {
    if (!file) return
    generate(file, targetSize.width, targetSize.height)
  }

  const handleReset = () => {
    setFile(null)
    reset()
  }

  const outputUrl = result?.output_url || result?.result?.image?.url

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.badge}>Powered by Fal AI</p>
        <h1 className={styles.heading}>AI Image Outpainting</h1>
        <p className={styles.subheading}>
          Extend any image beyond its original boundaries using generative AI. Upload an image,
          choose your target dimensions, and let the model do the rest.
        </p>
      </div>

      <div className={styles.container}>
        {!outputUrl ? (
          <div className={styles.card}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Upload Image</h2>
              <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />
            </section>

            <div className={styles.divider} />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Choose Output Size</h2>
              <AspectRatioSelector onChange={setTargetSize} disabled={loading} />
            </section>

            <div className={styles.divider} />

            <section className={styles.section}>
              {error && (
                <div className={styles.error}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              {loading ? (
                <Loader message="Generating your image... this may take a moment" />
              ) : (
                <button
                  className={styles.generateBtn}
                  onClick={handleGenerate}
                  disabled={!file || loading}
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
            <ImagePreview outputUrl={outputUrl} onReset={handleReset} />
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import styles from './ImagePreview.module.css'
import DownloadButton from '../DownloadButton'

export default function ImagePreview({ outputUrl, originalFile, onReset }) {
  const [view, setView] = useState('output')
  const originalUrl = originalFile ? URL.createObjectURL(originalFile) : null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Result</h3>
          <p className={styles.subtitle}>Your image has been extended</p>
        </div>
        <button className={styles.resetBtn} onClick={onReset}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3.32" />
          </svg>
          Start over
        </button>
      </div>

      {originalUrl && (
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${view === 'output' ? styles.toggleActive : ''}`}
            onClick={() => setView('output')}
          >
            Output
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'original' ? styles.toggleActive : ''}`}
            onClick={() => setView('original')}
          >
            Original
          </button>
        </div>
      )}

      <div className={styles.imageWrap}>
        <img
          src={view === 'output' ? outputUrl : originalUrl}
          alt={view === 'output' ? 'Outpainted result' : 'Original image'}
          className={styles.image}
        />
        <span className={styles.badge}>{view === 'output' ? 'AI Extended' : 'Original'}</span>
      </div>

      <div className={styles.actions}>
        <div className={styles.successTag}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Generated successfully
        </div>
        <DownloadButton url={outputUrl} filename="outpainted.png" />
      </div>
    </div>
  )
}

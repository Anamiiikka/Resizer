import React, { useState } from 'react'
import styles from './DownloadButton.module.css'
import { downloadImage } from '../../utils/imageUtils'

export default function DownloadButton({ url, filename }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadImage(url, filename)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <button className={styles.btn} onClick={handleDownload} disabled={downloading}>
      {downloading ? (
        'Downloading...'
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Image
        </>
      )}
    </button>
  )
}

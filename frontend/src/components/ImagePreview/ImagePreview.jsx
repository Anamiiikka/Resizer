import React from 'react'
import styles from './ImagePreview.module.css'
import DownloadButton from '../DownloadButton'

export default function ImagePreview({ outputUrl, onReset }) {
  if (!outputUrl) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Output Image</h3>
        <button className={styles.resetBtn} onClick={onReset}>
          Start over
        </button>
      </div>
      <div className={styles.imageWrap}>
        <img src={outputUrl} alt="Outpainted result" className={styles.image} />
      </div>
      <div className={styles.actions}>
        <DownloadButton url={outputUrl} filename="outpainted.png" />
      </div>
    </div>
  )
}

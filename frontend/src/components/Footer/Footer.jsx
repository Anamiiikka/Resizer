import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>
          <span className={styles.b}>B</span>ehooked
        </span>
        <span className={styles.sep}>·</span>
        <span className={styles.copy}>AI Image Outpainting</span>
        <span className={styles.sep}>·</span>
        <a href="https://fal.ai/models/fal-ai/smart-resize" target="_blank" rel="noreferrer" className={styles.link}>
          Powered by fal-ai/smart-resize
        </a>
      </div>
    </footer>
  )
}

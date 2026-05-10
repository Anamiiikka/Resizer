import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="/" className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
              <path d="M9 10h6.5a4.5 4.5 0 0 1 0 9H9V10z" fill="white" />
              <path d="M15.5 19H22l-4 8h-6l3.5-8z" fill="white" opacity="0.7" />
            </svg>
            <span className={styles.logoText}>Behooked</span>
          </a>
          <p className={styles.tagline}>
            Made with <span className={styles.heart}>💙</span> and passion in India
          </p>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <a href="https://behooked.co" target="_blank" rel="noreferrer" className={styles.domain}>
            BeHooked.co
          </a>
        </div>
      </div>
    </footer>
  )
}

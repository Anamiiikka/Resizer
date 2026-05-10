import React from 'react'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" className={styles.logoIcon}>
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M9 10h6.5a4.5 4.5 0 0 1 0 9H9V10z" fill="white" />
            <path d="M15.5 19H22l-4 8h-6l3.5-8z" fill="white" opacity="0.7" />
          </svg>
          <span className={styles.logoText}>Behooked</span>
        </a>
      </div>
    </header>
  )
}

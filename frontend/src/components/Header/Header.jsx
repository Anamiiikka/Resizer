import React from 'react'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="https://behooked.co" target="_blank" rel="noreferrer" className={styles.logo}>
          <span className={styles.logoMark}>B</span>
          <span className={styles.logoText}>ehooked</span>
        </a>
        <nav className={styles.nav}>
          <span className={styles.navLabel}>AI Image Outpainting</span>
        </nav>
      </div>
    </header>
  )
}

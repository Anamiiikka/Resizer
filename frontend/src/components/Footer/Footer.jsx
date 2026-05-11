import React from 'react'
import styles from './Footer.module.css'
import logoUrl from '../../assets/behooked blue logo.svg'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="/" className={styles.logo}>
            <img src={logoUrl} alt="BeHooked" className={styles.logoImg} />
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

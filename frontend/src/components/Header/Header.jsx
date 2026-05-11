import React from 'react'
import styles from './Header.module.css'
import logoUrl from '../../assets/behooked blue logo.svg'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src={logoUrl} alt="BeHooked" className={styles.logoImg} />
        </a>
      </div>
    </header>
  )
}

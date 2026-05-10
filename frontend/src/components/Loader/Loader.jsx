import React from 'react'
import styles from './Loader.module.css'

export default function Loader({ message = 'Generating...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  )
}

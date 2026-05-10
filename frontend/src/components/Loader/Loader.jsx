import React, { useState, useEffect } from 'react'
import styles from './Loader.module.css'

const STEPS = [
  'Uploading image...',
  'Analyzing content...',
  'Extending boundaries...',
  'Finishing up...',
]

export default function Loader() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setStepIndex((i) => (i < STEPS.length - 1 ? i + 1 : i))
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        <div className={styles.spinner} />
        <div className={styles.icon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>
      <p className={styles.step}>{STEPS[stepIndex]}</p>
      <p className={styles.hint}>This usually takes 20–60 seconds</p>
      <div className={styles.dots}>
        {STEPS.map((_, i) => (
          <span key={i} className={`${styles.dot} ${i <= stepIndex ? styles.dotActive : ''}`} />
        ))}
      </div>
    </div>
  )
}

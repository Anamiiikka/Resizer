import React, { useState, useEffect } from 'react'
import styles from './AspectRatioSelector.module.css'
import { ASPECT_RATIOS, clamp } from '../../utils/imageUtils'

export default function AspectRatioSelector({ onChange, disabled }) {
  const [selected, setSelected] = useState(ASPECT_RATIOS[0])
  const [customW, setCustomW] = useState(1024)
  const [customH, setCustomH] = useState(1024)

  useEffect(() => {
    if (selected.value === 'custom') {
      onChange({ width: customW, height: customH })
    } else {
      onChange({ width: selected.width, height: selected.height })
    }
  }, [selected, customW, customH, onChange])

  const handlePreset = (ratio) => setSelected(ratio)

  const handleCustomInput = (dimension, raw) => {
    const val = clamp(parseInt(raw, 10) || 64, 64, 4096)
    if (dimension === 'w') setCustomW(val)
    else setCustomH(val)
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>Target size / aspect ratio</p>
      <div className={styles.grid}>
        {ASPECT_RATIOS.map((ratio) => (
          <button
            key={ratio.value}
            className={`${styles.presetBtn} ${selected.value === ratio.value ? styles.active : ''}`}
            onClick={() => handlePreset(ratio)}
            disabled={disabled}
          >
            <span className={styles.presetLabel}>{ratio.label}</span>
            {ratio.width && (
              <span className={styles.presetDims}>{ratio.width}×{ratio.height}</span>
            )}
          </button>
        ))}
      </div>

      {selected.value === 'custom' && (
        <div className={styles.customRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Width (px)</label>
            <input
              type="number"
              className={styles.input}
              value={customW}
              min={64}
              max={4096}
              onChange={(e) => handleCustomInput('w', e.target.value)}
              disabled={disabled}
            />
          </div>
          <span className={styles.times}>×</span>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Height (px)</label>
            <input
              type="number"
              className={styles.input}
              value={customH}
              min={64}
              max={4096}
              onChange={(e) => handleCustomInput('h', e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>
      )}

      {selected.value !== 'custom' && (
        <p className={styles.dims}>
          Output: <strong>{selected.width} × {selected.height}px</strong>
        </p>
      )}
    </div>
  )
}

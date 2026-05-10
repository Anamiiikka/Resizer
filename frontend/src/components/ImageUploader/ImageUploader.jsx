import React, { useRef, useState, useCallback } from 'react'
import styles from './ImageUploader.module.css'
import { formatBytes } from '../../utils/imageUtils'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ onFileSelect, disabled }) {
  const inputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)

  const handleFile = useCallback((file) => {
    if (!file || !ACCEPTED_TYPES.includes(file.type)) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setFileInfo({ name: file.name, size: formatBytes(file.size) })
    onFileSelect(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleChange = (e) => handleFile(e.target.files[0])

  const handleClear = () => {
    setPreview(null)
    setFileInfo(null)
    if (inputRef.current) inputRef.current.value = ''
    onFileSelect(null)
  }

  return (
    <div className={styles.wrapper}>
      {!preview ? (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
          aria-label="Upload image"
        >
          <div className={styles.icon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className={styles.primary}>Drop your image here</p>
          <p className={styles.secondary}>or click to browse</p>
          <p className={styles.hint}>Supports JPEG, PNG, WebP — max 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleChange}
            className={styles.hiddenInput}
            disabled={disabled}
          />
        </div>
      ) : (
        <div className={styles.preview}>
          <img src={preview} alt="Uploaded preview" className={styles.previewImg} />
          <div className={styles.previewMeta}>
            <span className={styles.fileName}>{fileInfo?.name}</span>
            <span className={styles.fileSize}>{fileInfo?.size}</span>
            <button className={styles.clearBtn} onClick={handleClear} disabled={disabled}>
              Change image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

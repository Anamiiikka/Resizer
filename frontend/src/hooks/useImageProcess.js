import { useState, useCallback } from 'react'
import { processImage } from '../services/api'

export function useImageProcess() {
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState(null)
  const [result, setResult]                     = useState(null)
  const [originalDimensions, setOriginalDimensions] = useState(null)

  const fetchDimensions = useCallback((file) => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file)
      const img = new window.Image()
      img.onload = () => {
        const dims = { width: img.naturalWidth, height: img.naturalHeight }
        setOriginalDimensions(dims)
        URL.revokeObjectURL(url)
        resolve(dims)
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        resolve(null)
      }
      img.src = url
    })
  }, [])

  const generate = useCallback(async (file, targetWidth, targetHeight) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await processImage(file, targetWidth, targetHeight)
      setResult(data)
    } catch (err) {
      const message = err.response?.data?.detail || err.message || 'Something went wrong.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setOriginalDimensions(null)
  }, [])

  return { loading, error, result, originalDimensions, generate, fetchDimensions, reset }
}

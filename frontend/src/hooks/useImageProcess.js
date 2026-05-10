import { useState, useCallback } from 'react'
import { processImage, getImageDimensions } from '../services/api'

export function useImageProcess() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [originalDimensions, setOriginalDimensions] = useState(null)

  const fetchDimensions = useCallback(async (file) => {
    try {
      const dims = await getImageDimensions(file)
      setOriginalDimensions(dims)
      return dims
    } catch {
      return null
    }
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

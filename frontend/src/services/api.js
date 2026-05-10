import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: BASE_URL })

export async function processImage(file, targetWidth, targetHeight) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('target_width', targetWidth)
  formData.append('target_height', targetHeight)

  const { data } = await api.post('/api/image/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function getImageDimensions(file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('/api/image/dimensions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1:1', width: 1024, height: 1024 },
  { label: '16:9 Landscape', value: '16:9', width: 1920, height: 1080 },
  { label: '9:16 Portrait', value: '9:16', width: 1080, height: 1920 },
  { label: '4:3 Standard', value: '4:3', width: 1024, height: 768 },
  { label: '3:4 Portrait', value: '3:4', width: 768, height: 1024 },
  { label: '21:9 Ultrawide', value: '21:9', width: 2560, height: 1080 },
  { label: 'Custom', value: 'custom', width: null, height: null },
]

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export async function downloadImage(url, filename = 'outpainted.png') {
  const response = await fetch(url)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(objectUrl)
}

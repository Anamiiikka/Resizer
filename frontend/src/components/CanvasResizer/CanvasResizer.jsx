import React, { useEffect, useRef, useState, useCallback } from 'react'
import styles from './CanvasResizer.module.css'

const MAX_DISPLAY_W = 460
const MAX_DISPLAY_H = 280
const MAX_EXT_DISPLAY = 130
const BLUR_PX = 12
const EDGE_SAMPLE = 40 // display-px of edge to sample for the blur-stretch

export default function CanvasResizer({ imageFile, originalDimensions, onChange }) {
  const [ext, setExt] = useState({ top: 0, bottom: 0, left: 0, right: 0 })
  const dragging  = useRef(null)
  const canvasRef = useRef(null)
  const imgRef    = useRef(null)
  const [imgReady, setImgReady] = useState(false)

  // Load a hidden Image object for drawImage
  useEffect(() => {
    if (!imageFile) return
    setImgReady(false)
    const url = URL.createObjectURL(imageFile)
    const img = new Image()
    img.onload = () => { imgRef.current = img; setImgReady(true) }
    img.src = url
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  // Reset extensions when file changes
  useEffect(() => { setExt({ top: 0, bottom: 0, left: 0, right: 0 }) }, [imageFile])

  if (!originalDimensions) return null

  const { width: origW, height: origH } = originalDimensions
  const scale = Math.min(MAX_DISPLAY_W / origW, MAX_DISPLAY_H / origH, 1)
  const dispW  = Math.round(origW * scale)
  const dispH  = Math.round(origH * scale)

  const realExt = {
    top:    Math.round(ext.top    / scale),
    bottom: Math.round(ext.bottom / scale),
    left:   Math.round(ext.left   / scale),
    right:  Math.round(ext.right  / scale),
  }
  const finalW = origW + realExt.left + realExt.right
  const finalH = origH + realExt.top  + realExt.bottom

  useEffect(() => { onChange({ width: finalW, height: finalH }) }, [finalW, finalH, onChange])

  // ── Canvas redraw ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !imgRef.current || !imgReady) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const img    = imgRef.current
    const { top, bottom, left, right } = ext
    const totalW = dispW + left + right
    const totalH = dispH + top  + bottom

    canvas.width  = totalW
    canvas.height = totalH

    ctx.clearRect(0, 0, totalW, totalH)
    ctx.fillStyle = '#0c0c10'
    ctx.fillRect(0, 0, totalW, totalH)

    // Natural dimensions for source coords
    const nw = img.naturalWidth
    const nh = img.naturalHeight
    // How many natural pixels equal EDGE_SAMPLE display pixels
    const edgeNH = Math.round(EDGE_SAMPLE * nh / dispH)
    const edgeNW = Math.round(EDGE_SAMPLE * nw / dispW)

    // Draw a blurred-stretch slice within a clip region
    const blurredSlice = (clipX, clipY, clipW, clipH, sx, sy, sw, sh, dx, dy, dw, dh) => {
      if (clipW <= 0 || clipH <= 0) return
      ctx.save()
      ctx.beginPath()
      ctx.rect(clipX, clipY, clipW, clipH)
      ctx.clip()
      ctx.filter = `blur(${BLUR_PX}px)`
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
      ctx.filter = 'none'
      // Tint overlay
      ctx.fillStyle = 'rgba(0,100,255,0.18)'
      ctx.fillRect(clipX, clipY, clipW, clipH)
      ctx.restore()
    }

    // Top — stretch the top EDGE_SAMPLE rows downward (mirrored feel)
    if (top > 0)
      blurredSlice(
        left, 0, dispW, top,
        0, 0, nw, edgeNH,
        left, -BLUR_PX, dispW, top + BLUR_PX
      )

    // Bottom — stretch the bottom EDGE_SAMPLE rows
    if (bottom > 0)
      blurredSlice(
        left, top + dispH, dispW, bottom,
        0, nh - edgeNH, nw, edgeNH,
        left, top + dispH - BLUR_PX, dispW, bottom + BLUR_PX
      )

    // Left — stretch the left EDGE_SAMPLE columns
    if (left > 0)
      blurredSlice(
        0, top, left, dispH,
        0, 0, edgeNW, nh,
        -BLUR_PX, top, left + BLUR_PX, dispH
      )

    // Right — stretch the right EDGE_SAMPLE columns
    if (right > 0)
      blurredSlice(
        left + dispW, top, right, dispH,
        nw - edgeNW, 0, edgeNW, nh,
        left + dispW - BLUR_PX, top, right + BLUR_PX, dispH
      )

    // Corners — simple dark tint (no good source to sample diagonally)
    ctx.fillStyle = 'rgba(0,70,180,0.15)'
    if (top > 0    && left  > 0) ctx.fillRect(0,            0,            left,  top)
    if (top > 0    && right > 0) ctx.fillRect(left + dispW, 0,            right, top)
    if (bottom > 0 && left  > 0) ctx.fillRect(0,            top + dispH,  left,  bottom)
    if (bottom > 0 && right > 0) ctx.fillRect(left + dispW, top + dispH,  right, bottom)

    // Original image — drawn sharp on top
    ctx.drawImage(img, left, top, dispW, dispH)

    // Dashed boundary ring around the original
    ctx.save()
    ctx.strokeStyle = 'rgba(0,124,255,0.55)'
    ctx.lineWidth   = 1.5
    ctx.setLineDash([5, 5])
    ctx.strokeRect(left + 0.75, top + 0.75, dispW - 1.5, dispH - 1.5)
    ctx.restore()

  }, [ext, dispW, dispH, imgReady])

  // ── Drag logic ────────────────────────────────────────────────────────────
  const startDrag = useCallback((side, e) => {
    e.preventDefault()
    const isV = side === 'top' || side === 'bottom'
    const pos  = e.touches
      ? (isV ? e.touches[0].clientY : e.touches[0].clientX)
      : (isV ? e.clientY : e.clientX)
    dragging.current = { side, startMouse: pos, startExt: ext[side] }
  }, [ext])

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const { side, startMouse, startExt } = dragging.current
      const isV = side === 'top' || side === 'bottom'
      const cur = e.touches
        ? (isV ? e.touches[0].clientY : e.touches[0].clientX)
        : (isV ? e.clientY : e.clientX)
      const delta = cur - startMouse
      let v = (side === 'bottom' || side === 'right') ? startExt + delta : startExt - delta
      v = Math.max(0, Math.min(MAX_EXT_DISPLAY, v))
      setExt(prev => ({ ...prev, [side]: v }))
    }
    const onUp = () => { dragging.current = null }

    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)
    window.addEventListener('touchmove',  onMove, { passive: false })
    window.addEventListener('touchend',   onUp)
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('touchmove',  onMove)
      window.removeEventListener('touchend',   onUp)
    }
  }, [])

  const handleReset = () => setExt({ top: 0, bottom: 0, left: 0, right: 0 })
  const hasExt = finalW !== origW || finalH !== origH

  const { top, bottom, left, right } = ext
  const canvasW = dispW + left + right
  const canvasH = dispH + top  + bottom

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>Drag handles to extend each side — preview updates instantly</p>

      <div className={styles.stage}>
        {/* Positioned container so handles can be absolute inside */}
        <div className={styles.canvasWrap} style={{ width: canvasW, height: canvasH }}>
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Top handle */}
          <div
            className={`${styles.handle} ${styles.handleH}`}
            style={{ top: top - 6, left: left, width: dispW }}
            onMouseDown={(e) => startDrag('top', e)}
            onTouchStart={(e) => startDrag('top', e)}
          >
            <span className={styles.pill} />
            {top > 0 && <span className={styles.extLabel}>+{Math.round(realExt.top)}px</span>}
          </div>

          {/* Bottom handle */}
          <div
            className={`${styles.handle} ${styles.handleH}`}
            style={{ top: top + dispH - 6, left: left, width: dispW }}
            onMouseDown={(e) => startDrag('bottom', e)}
            onTouchStart={(e) => startDrag('bottom', e)}
          >
            <span className={styles.pill} />
            {bottom > 0 && <span className={styles.extLabel}>+{Math.round(realExt.bottom)}px</span>}
          </div>

          {/* Left handle */}
          <div
            className={`${styles.handle} ${styles.handleV}`}
            style={{ left: left - 6, top: top, height: dispH }}
            onMouseDown={(e) => startDrag('left', e)}
            onTouchStart={(e) => startDrag('left', e)}
          >
            <span className={styles.pillV} />
            {left > 0 && <span className={`${styles.extLabel} ${styles.extLabelV}`}>+{Math.round(realExt.left)}px</span>}
          </div>

          {/* Right handle */}
          <div
            className={`${styles.handle} ${styles.handleV}`}
            style={{ left: left + dispW - 6, top: top, height: dispH }}
            onMouseDown={(e) => startDrag('right', e)}
            onTouchStart={(e) => startDrag('right', e)}
          >
            <span className={styles.pillV} />
            {right > 0 && <span className={`${styles.extLabel} ${styles.extLabelV}`}>+{Math.round(realExt.right)}px</span>}
          </div>
        </div>
      </div>

      {/* Dimension readout */}
      <div className={styles.dims}>
        <div className={styles.dimGroup}>
          <span className={styles.dimLabel}>Original</span>
          <span className={styles.dimValue}>{origW} × {origH}px</span>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
        <div className={styles.dimGroup}>
          <span className={styles.dimLabel}>Output</span>
          <span className={`${styles.dimValue} ${hasExt ? styles.dimChanged : ''}`}>
            {finalW} × {finalH}px
          </span>
        </div>
        {hasExt && (
          <button className={styles.resetBtn} onClick={handleReset}>Reset</button>
        )}
      </div>
    </div>
  )
}

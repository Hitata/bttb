'use client'

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react'
import type { CastingResponse } from '@/lib/iching/types'

interface ImageDropZoneProps {
  onCasted: (result: CastingResponse, question: string) => void
}

type Status = 'idle' | 'ready' | 'casting' | 'done' | 'error'

async function hashImageFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  const pixelData = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data.buffer
  const hashBuffer = await crypto.subtle.digest('SHA-256', pixelData)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function ImageDropZone({ onCasted }: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [intentionTime, setIntentionTime] = useState(() => toLocalDatetimeString(new Date()))
  const [question, setQuestion] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSelectFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('error')
      setErrorMsg('Please select an image file')
      return
    }
    // Clean up old preview
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(url)
    setStatus('ready')
    setErrorMsg('')
  }, [previewUrl])

  const handleCast = useCallback(async () => {
    if (!selectedFile) return
    setStatus('casting')

    try {
      const imageHash = await hashImageFile(selectedFile)

      const res = await fetch('/api/iching/cast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageHash,
          intentionTime: new Date(intentionTime).getTime(),
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const result: CastingResponse = await res.json()
      setStatus('done')

      setTimeout(() => {
        onCasted(result, question)
      }, 400)
    } catch {
      setStatus('error')
      setErrorMsg('Casting failed, please try again')
    }
  }, [selectedFile, intentionTime, question, onCasted])

  const handleRemoveImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    setStatus('idle')
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => setIsDragOver(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleSelectFile(file)
  }

  const handleClick = () => inputRef.current?.click()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleSelectFile(file)
    e.target.value = ''
  }

  const isCasting = status === 'casting'
  const isDone = status === 'done'
  const hasImage = !!selectedFile && (status === 'ready' || status === 'casting' || status === 'done')

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-8">
      {/* Câu hỏi — question */}
      <div className="mb-5 flex w-full max-w-sm flex-col items-center gap-1.5">
        <label htmlFor="question" className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Câu hỏi · 問題
        </label>
        <textarea
          id="question"
          rows={2}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Điều bạn muốn hỏi..."
          disabled={isCasting || isDone}
          className="w-full resize-none rounded-md border border-border bg-card/50 px-3 py-1.5 text-sm text-foreground/70 placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary/40 disabled:opacity-40"
        />
      </div>

      {/* Giờ động tâm — moment of intention */}
      <div className="mb-5 flex flex-col items-center gap-1.5">
        <label htmlFor="intention-time" className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Giờ động tâm · 動心時
        </label>
        <input
          id="intention-time"
          type="datetime-local"
          value={intentionTime}
          onChange={(e) => setIntentionTime(e.target.value)}
          disabled={isCasting || isDone}
          className="rounded-md border border-border bg-card/50 px-3 py-1.5 text-center text-sm text-foreground/70 outline-none transition-colors focus:border-primary/40 disabled:opacity-40"
        />
      </div>

      {/* Image selection */}
      <div className="mb-5 flex flex-col items-center gap-1.5">
        <label className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Hình ảnh · 圖像
        </label>

        {hasImage && previewUrl ? (
          // Image preview with remove button
          <div className="relative w-full max-w-sm">
            <div
              className={[
                'relative overflow-hidden rounded-xl border border-border',
                'h-44 w-full',
                isDone ? 'opacity-30' : '',
                'transition-opacity duration-400',
              ].join(' ')}
            >
              <img
                src={previewUrl}
                alt="Selected"
                className="h-full w-full object-cover"
              />
            </div>
            {!isCasting && !isDone && (
              <button
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          // Drop zone
          <div
            role="button"
            tabIndex={0}
            aria-label="Select image"
            onClick={handleClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick()
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={[
              'relative flex flex-col items-center justify-center',
              'h-44 w-full max-w-sm rounded-xl',
              'border-2 border-dashed transition-colors duration-300',
              isDragOver
                ? 'border-primary/40 bg-primary/5'
                : 'border-border hover:border-primary/30 hover:bg-muted/50',
              'cursor-pointer select-none outline-none focus-visible:ring-1 focus-visible:ring-ring/30',
            ].join(' ')}
          >
            <div className="flex flex-col items-center gap-2 px-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/40"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm font-light tracking-wide text-muted-foreground/70">
                Chọn hình ảnh
              </p>
              <p className="text-[10px] tracking-widest text-muted-foreground/40">kéo thả hoặc bấm chọn</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="mb-4 text-sm text-destructive/80">{errorMsg}</p>
      )}

      {/* Cast button */}
      <button
        onClick={handleCast}
        disabled={!hasImage || isCasting || isDone}
        className={[
          'mt-2 flex items-center justify-center gap-2 rounded-xl px-10 py-3.5',
          'text-sm font-medium tracking-wide transition-all duration-200',
          'min-h-[52px] min-w-[200px]',
          hasImage && !isCasting && !isDone
            ? 'border border-primary/30 bg-primary/10 text-primary hover:bg-primary/15 hover:border-primary/40 cursor-pointer'
            : 'border border-border bg-muted/30 text-muted-foreground/40 cursor-not-allowed',
        ].join(' ')}
      >
        {isCasting ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Đang gieo…
          </>
        ) : isDone ? (
          '✓ Đã gieo'
        ) : (
          '☰ Gieo Quẻ'
        )}
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

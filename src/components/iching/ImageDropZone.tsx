'use client'

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react'
import type { CastingResponse } from '@/lib/iching/types'

interface ImageDropZoneProps {
  onCasted: (result: CastingResponse) => void
}

type State =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'loading'; previewUrl: string }
  | { status: 'done'; previewUrl: string }

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
  const [state, setState] = useState<State>({ status: 'idle' })
  const [isDragOver, setIsDragOver] = useState(false)
  const [intentionTime, setIntentionTime] = useState(() => toLocalDatetimeString(new Date()))

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        setState({ status: 'error', message: 'Please drop an image file' })
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setState({ status: 'loading', previewUrl })

      try {
        const imageHash = await hashImageFile(file)

        const res = await fetch('/api/iching/cast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageHash,
            intentionTime: new Date(intentionTime).getTime(),
          }),
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const result: CastingResponse = await res.json()

        // Transition to done so preview can fade out before parent takes over
        setState({ status: 'done', previewUrl })

        // Small delay lets the opacity transition play before parent unmounts this
        setTimeout(() => {
          onCasted(result)
        }, 400)
      } catch {
        URL.revokeObjectURL(previewUrl)
        setState({ status: 'error', message: 'Casting failed, please try again' })
      }
    },
    [onCasted, intentionTime],
  )

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  const handleCoinToss = useCallback(async () => {
    setState({ status: 'loading', previewUrl: '' })
    try {
      const randomBytes = crypto.getRandomValues(new Uint8Array(32))
      const imageHash = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('')

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
      setState({ status: 'done', previewUrl: '' })
      setTimeout(() => onCasted(result), 400)
    } catch {
      setState({ status: 'error', message: 'Casting failed, please try again' })
    }
  }, [onCasted, intentionTime])

  const isLoading = state.status === 'loading'
  const isDone = state.status === 'done'
  const hasPreview = state.status === 'loading' || state.status === 'done'
  const previewUrl = hasPreview ? (state as { previewUrl: string }).previewUrl : null

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4">
      {/* Giờ động tâm — moment of intention */}
      <div className="mb-6 flex flex-col items-center gap-1.5">
        <label htmlFor="intention-time" className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Giờ động tâm · 動心時
        </label>
        <input
          id="intention-time"
          type="datetime-local"
          value={intentionTime}
          onChange={(e) => setIntentionTime(e.target.value)}
          className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-center text-sm text-muted-foreground outline-none transition-colors focus:border-ring"
        />
      </div>

      {/* Error message — rendered above the drop zone */}
      {state.status === 'error' && (
        <p className="mb-4 text-sm text-destructive">{state.message}</p>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Drop image to cast"
        onClick={!isLoading && !isDone ? handleClick : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLoading && !isDone) handleClick()
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          'relative flex flex-col items-center justify-center',
          'h-72 w-full max-w-sm rounded-xl',
          'border-2 border-dashed transition-colors duration-300',
          isDragOver
            ? 'border-foreground/40 bg-foreground/5'
            : 'border-border hover:border-foreground/25 hover:bg-muted/40',
          !isLoading && !isDone ? 'cursor-pointer' : 'cursor-default',
          'select-none outline-none focus-visible:ring-1 focus-visible:ring-ring',
        ].join(' ')}
      >
        {/* Thumbnail preview */}
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className={[
              'absolute inset-0 h-full w-full rounded-xl object-cover',
              'transition-opacity duration-400',
              isDone ? 'opacity-0' : 'opacity-30',
            ].join(' ')}
          />
        )}

        {/* Content layer */}
        <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
          {isLoading ? (
            <>
              {/* Spinner */}
              <svg
                className="h-8 w-8 animate-spin text-white/40"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm tracking-widest text-muted-foreground">Casting…</span>
            </>
          ) : (
            <>
              {/* Drop icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground/50"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-base font-light tracking-wide text-muted-foreground">
                Drop your image to cast
              </p>
              <p className="text-xs tracking-widest text-muted-foreground/50">or click to browse</p>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 flex w-full max-w-sm items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">hoặc</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Coin toss button */}
      <button
        onClick={handleCoinToss}
        disabled={isLoading || isDone}
        className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-6 py-3 text-sm tracking-wide text-muted-foreground transition-colors hover:border-foreground/25 hover:bg-muted/60 hover:text-foreground disabled:opacity-40 disabled:cursor-default"
      >
        <span className="text-lg">☰</span>
        Gieo quẻ · Coin Toss
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

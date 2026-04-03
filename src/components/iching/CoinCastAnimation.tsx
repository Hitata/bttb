'use client'

import { useEffect, useRef, useState } from 'react'
import type { CastingResponse } from '@/lib/iching/types'

interface CoinCastAnimationProps {
  result: CastingResponse
  onComplete: () => void
}

// Per-round timing (ms)
const FLIP_DURATION = 400
const PAUSE_AFTER_LAND = 300
const LINE_FADE_DURATION = 200
const GAP_BETWEEN_ROUNDS = 400
const ROUND_DURATION = FLIP_DURATION + PAUSE_AFTER_LAND + LINE_FADE_DURATION + GAP_BETWEEN_ROUNDS // ~1300ms

type CoinState = 'idle' | 'flipping' | 'landed'
type LineState = 'hidden' | 'visible'

export default function CoinCastAnimation({ result, onComplete }: CoinCastAnimationProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [coinState, setCoinState] = useState<CoinState>('idle')
  const [lineStates, setLineStates] = useState<LineState[]>(Array(6).fill('hidden'))
  const [done, setDone] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (done) return

    let cancelled = false

    const runRound = (round: number) => {
      if (cancelled) return

      // 1. Start coin flip
      setCoinState('flipping')

      // 2. Land coins after FLIP_DURATION
      const landTimer = setTimeout(() => {
        if (cancelled) return
        setCoinState('landed')

        // 3. After pause, draw the line
        const lineTimer = setTimeout(() => {
          if (cancelled) return
          setLineStates((prev) => {
            const next = [...prev]
            next[round] = 'visible'
            return next
          })

          // 4. After line fade + gap, proceed to next round or finish
          const nextTimer = setTimeout(() => {
            if (cancelled) return
            if (round < 5) {
              setCurrentRound(round + 1)
              setCoinState('idle')
              // Small gap before next flip starts — handled by the next runRound call
              const gapTimer = setTimeout(() => runRound(round + 1), GAP_BETWEEN_ROUNDS)
              return () => clearTimeout(gapTimer)
            } else {
              setDone(true)
              onCompleteRef.current()
            }
          }, LINE_FADE_DURATION)

          return () => clearTimeout(nextTimer)
        }, PAUSE_AFTER_LAND)

        return () => clearTimeout(lineTimer)
      }, FLIP_DURATION)

      return () => clearTimeout(landTimer)
    }

    // Kick off round 0 after a short initial delay
    const startTimer = setTimeout(() => runRound(0), 300)

    return () => {
      cancelled = true
      clearTimeout(startTimer)
    }
  }, [done])

  const coinsForRound = result.coins[currentRound] // [CoinFace, CoinFace, CoinFace]
  const lineValue = (round: number) => result.lines[round] // 6 | 7 | 8 | 9
  const isMovingLine = (round: number) => {
    const v = lineValue(round)
    return v === 6 || v === 9
  }
  const isYang = (round: number) => {
    const v = lineValue(round)
    return v === 7 || v === 9 // odd = yang
  }

  return (
    <div
      style={{
        backgroundColor: 'hsl(var(--background))',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Skip button */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.5rem',
          background: 'transparent',
          border: '1px solid hsl(var(--foreground) / 0.15)',
          borderRadius: '6px',
          color: 'hsl(var(--foreground) / 0.35)',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          padding: '0.35rem 0.8rem',
          cursor: 'pointer',
          transition: 'color 0.2s, border-color 0.2s',
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--foreground) / 0.7)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--foreground) / 0.35)'
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLButtonElement).style.color = 'hsl(var(--foreground) / 0.35)'
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(var(--foreground) / 0.15)'
        }}
      >
        SKIP
      </button>

      {/* Round label */}
      <p
        style={{
          color: 'hsl(var(--foreground) / 0.25)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          marginBottom: '2rem',
          textTransform: 'uppercase',
        }}
      >
        Hào {currentRound + 1} / 6
      </p>

      {/* Coin row */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '3.5rem',
          perspective: '600px',
        }}
      >
        {[0, 1, 2].map((coinIdx) => {
          const face = coinsForRound?.[coinIdx] ?? 0 // 0=yin, 1=yang
          const isYangFace = face === 1
          const isFlipping = coinState === 'flipping'
          const isLanded = coinState === 'landed'

          return (
            <div
              key={coinIdx}
              style={{
                width: 44,
                height: 44,
                position: 'relative',
                // 3-D flip card container
                transformStyle: 'preserve-3d',
                transition: `transform ${FLIP_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
                transform: isFlipping
                  ? 'rotateX(540deg)'
                  : isLanded
                    ? 'rotateX(720deg)'
                    : 'rotateX(0deg)',
              }}
            >
              {/* Face shown when landed — yang or yin */}
              <CoinFaceDisplay isYang={isYangFace} visible={isLanded} />
              {/* Neutral spinning face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), rgba(255,255,255,0.04))',
                  border: '2px solid rgba(255,255,255,0.2)',
                  opacity: isLanded ? 0 : 1,
                  transition: `opacity ${FLIP_DURATION / 2}ms ease`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Hexagram stack — lines build bottom-to-top */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {/* Render lines top-to-bottom visually (index 5 = top = Thượng hào) */}
        {[5, 4, 3, 2, 1, 0].map((lineIdx) => {
          const visible = lineStates[lineIdx] === 'visible'
          const yang = isYang(lineIdx)
          const moving = isMovingLine(lineIdx)

          return (
            <HexLine
              key={lineIdx}
              visible={visible}
              isYang={yang}
              isMoving={moving}
              fadeDuration={LINE_FADE_DURATION}
            />
          )
        })}
      </div>

      {/* Subtle ambient glow at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60%',
          height: '200px',
          background:
            'radial-gradient(ellipse at center bottom, rgba(255,200,80,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface CoinFaceDisplayProps {
  isYang: boolean
  visible: boolean
}

function CoinFaceDisplay({ isYang, visible }: CoinFaceDisplayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transition: `opacity ${FLIP_DURATION / 2}ms ease ${FLIP_DURATION / 2}ms`,
        background: isYang
          ? 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.85), rgba(255,255,255,0.55))'
          : 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
        border: isYang
          ? '2px solid rgba(255,255,255,0.9)'
          : '2px solid rgba(255,255,255,0.25)',
        boxShadow: isYang
          ? '0 0 12px rgba(255,255,255,0.3)'
          : 'none',
      }}
    >
      {/* Yin face: horizontal bar through the middle */}
      {!isYang && (
        <div
          style={{
            width: '55%',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: '1px',
          }}
        />
      )}
    </div>
  )
}

interface HexLineProps {
  visible: boolean
  isYang: boolean
  isMoving: boolean
  fadeDuration: number
}

const LINE_WIDTH = 120
const LINE_HEIGHT = 10
const HALF_GAP = 8

function HexLine({ visible, isYang, isMoving, fadeDuration }: HexLineProps) {
  const goldGradient = 'linear-gradient(90deg, color-mix(in oklch, var(--iching-moving) 70%, black), var(--iching-moving), color-mix(in oklch, var(--iching-moving) 70%, black))'
  const solidColor = 'hsl(var(--foreground) / 0.75)'

  const barStyle = (side: 'left' | 'right' | 'full'): React.CSSProperties => {
    let width: number
    let marginLeft = 0
    if (side === 'full') {
      width = LINE_WIDTH
    } else if (side === 'left') {
      width = (LINE_WIDTH - HALF_GAP * 2) / 2
    } else {
      width = (LINE_WIDTH - HALF_GAP * 2) / 2
      marginLeft = HALF_GAP * 2
    }

    return {
      width,
      height: LINE_HEIGHT,
      borderRadius: LINE_HEIGHT / 2,
      background: isMoving ? goldGradient : solidColor,
      boxShadow: isMoving ? '0 0 8px var(--iching-moving-glow), 0 0 16px var(--iching-moving-glow)' : 'none',
      marginLeft,
      flexShrink: 0,
    }
  }

  return (
    <div
      style={{
        width: LINE_WIDTH,
        height: LINE_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity ${fadeDuration}ms ease, transform ${fadeDuration}ms ease`,
      }}
    >
      {isYang ? (
        // Solid bar
        <div style={barStyle('full')} />
      ) : (
        // Two half bars with gap
        <>
          <div style={barStyle('left')} />
          <div style={barStyle('right')} />
        </>
      )}
    </div>
  )
}

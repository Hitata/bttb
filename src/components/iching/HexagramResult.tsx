'use client'

import { useState, useEffect } from 'react'
import { InterpretationDisplay } from '@/components/iching/InterpretationDisplay'
import { PromptGenerator } from '@/components/iching/PromptGenerator'
import type { CastingResponse, HexagramInfo, LineValue, HexagramData } from '@/lib/iching/types'

interface HexagramResultProps {
  result: CastingResponse
  onCastAgain: () => void
}

// Derive the changed hexagram's line values from the primary lines
// 9 (moving yang) → 8 (static yin), 6 (moving yin) → 7 (static yang)
// 7/8 stay as-is
function getChangedLineValues(primaryLines: LineValue[]): LineValue[] {
  return primaryLines.map((v) => {
    if (v === 9) return 8
    if (v === 6) return 7
    return v
  })
}

function isYang(value: LineValue): boolean {
  return value === 7 || value === 9
}

function isMoving(value: LineValue): boolean {
  return value === 6 || value === 9
}

interface LineGraphicProps {
  value: LineValue
  isMovingLine: boolean
}

function LineGraphic({ value, isMovingLine }: LineGraphicProps) {
  const yang = isYang(value)

  if (yang) {
    return (
      <div
        className="line-container"
        style={{ position: 'relative' }}
      >
        <div
          style={{
            width: 'var(--line-width)',
            height: 'var(--line-height)',
            borderRadius: '2px',
            background: isMovingLine
              ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
              : 'rgba(255,255,255,0.75)',
            boxShadow: isMovingLine ? '0 0 8px rgba(251,191,36,0.3)' : undefined,
          }}
        />
        {isMovingLine && (
          <span
            style={{
              position: 'absolute',
              right: '-11px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '7px',
              color: '#FBBF24',
            }}
          >
            ○
          </span>
        )}
      </div>
    )
  }

  // Yin line: two halves
  return (
    <div
      className="line-container"
      style={{ position: 'relative' }}
    >
      <div
        style={{
          display: 'flex',
          gap: 'var(--yin-gap)',
          width: 'var(--line-width)',
        }}
      >
        <div
          style={{
            flex: 1,
            height: 'var(--line-height)',
            borderRadius: '2px',
            background: isMovingLine
              ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
              : 'rgba(255,255,255,0.75)',
            boxShadow: isMovingLine ? '0 0 8px rgba(251,191,36,0.3)' : undefined,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 'var(--line-height)',
            borderRadius: '2px',
            background: isMovingLine
              ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
              : 'rgba(255,255,255,0.75)',
            boxShadow: isMovingLine ? '0 0 8px rgba(251,191,36,0.3)' : undefined,
          }}
        />
      </div>
      {isMovingLine && (
        <span
          style={{
            position: 'absolute',
            right: '-11px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '7px',
            color: '#FBBF24',
          }}
        >
          ○
        </span>
      )}
    </div>
  )
}

interface HexagramDiagramProps {
  info: HexagramInfo
  lineValues: LineValue[]
  label: 'Bản Quái' | 'Biến Quái'
  showMoving: boolean
}

function HexagramDiagram({ info, lineValues, label, showMoving }: HexagramDiagramProps) {
  // lines array is bottom-to-top (index 0 = line 1, index 5 = line 6)
  // Upper trigram: lines 4, 5, 6 (indices 3, 4, 5) — displayed top down: 6, 5, 4
  // Lower trigram: lines 1, 2, 3 (indices 0, 1, 2) — displayed top down: 3, 2, 1

  const upperLines = [
    { num: 6, value: lineValues[5] },
    { num: 5, value: lineValues[4] },
    { num: 4, value: lineValues[3] },
  ]

  const lowerLines = [
    { num: 3, value: lineValues[2] },
    { num: 2, value: lineValues[1] },
    { num: 1, value: lineValues[0] },
  ]

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '16px 6px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}
      className="sm:!p-[24px_12px]"
    >
      {/* Card label */}
      <div
        style={{
          fontSize: 'var(--label-size)',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '10px',
        }}
      >
        {label}
      </div>

      {/* Upper trigram label */}
      <div
        style={{
          fontSize: 'var(--trigram-label-size)',
          color: 'rgba(255,255,255,0.2)',
          marginBottom: '4px',
        }}
      >
        {info.upperTrigram.symbol} {info.upperTrigram.name}
      </div>

      {/* Upper trigram lines (6, 5, 4) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        {upperLines.map(({ num, value }) => {
          const moving = showMoving && isMoving(value)
          return (
            <div
              key={num}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span
                style={{
                  fontSize: 'var(--num-size)',
                  color: 'rgba(255,255,255,0.12)',
                  width: '10px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {num}
              </span>
              <LineGraphic value={value} isMovingLine={moving} />
              <span
                style={{
                  fontSize: 'var(--num-size)',
                  color: moving ? '#FBBF24' : 'rgba(255,255,255,0.12)',
                  width: '10px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Divider between upper and lower trigram */}
      <div
        style={{
          width: 'var(--line-width)',
          margin: '4px auto',
          borderTop: '1px dashed rgba(255,255,255,0.06)',
        }}
      />

      {/* Lower trigram label */}
      <div
        style={{
          fontSize: 'var(--trigram-label-size)',
          color: 'rgba(255,255,255,0.2)',
          marginBottom: '4px',
        }}
      >
        {info.lowerTrigram.symbol} {info.lowerTrigram.name}
      </div>

      {/* Lower trigram lines (3, 2, 1) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        {lowerLines.map(({ num, value }) => {
          const moving = showMoving && isMoving(value)
          return (
            <div
              key={num}
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <span
                style={{
                  fontSize: 'var(--num-size)',
                  color: 'rgba(255,255,255,0.12)',
                  width: '10px',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {num}
              </span>
              <LineGraphic value={value} isMovingLine={moving} />
              <span
                style={{
                  fontSize: 'var(--num-size)',
                  color: moving ? '#FBBF24' : 'rgba(255,255,255,0.12)',
                  width: '10px',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Hexagram name */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ fontSize: 'var(--zh-size)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.2 }}>
          {info.name.zh}
        </div>
        <div style={{ fontSize: 'var(--vi-size)', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
          {info.name.vi} · #{info.number}
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>
          {info.name.en}
        </div>
      </div>
    </div>
  )
}

export function HexagramResult({ result, onCastAgain }: HexagramResultProps) {
  const { primary, changed, lines } = result
  const changedLineValues = changed ? getChangedLineValues(lines) : null

  const [primaryData, setPrimaryData] = useState<HexagramData | null>(null)
  const [changedData, setChangedData] = useState<HexagramData | null>(null)
  const [nuclearData, setNuclearData] = useState<HexagramData | null>(null)

  useEffect(() => {
    const numbers = new Set<number>()
    numbers.add(primary.number)
    numbers.add(primary.nuclearNumber)
    if (changed) {
      numbers.add(changed.number)
      numbers.add(changed.nuclearNumber)
    }

    fetch(`/api/iching/hexagrams?numbers=${[...numbers].join(',')}`)
      .then(res => res.json())
      .then((data: HexagramData[]) => {
        const map = new Map(data.map(h => [h.number, h]))
        setPrimaryData(map.get(primary.number) ?? null)
        setChangedData(changed ? (map.get(changed.number) ?? null) : null)
        setNuclearData(map.get(primary.nuclearNumber) ?? null)
      })
      .catch(() => {}) // silently fail — interpretation is supplementary
  }, [primary, changed])



  return (
    <div
      style={{
        background: '#0a0a0a',
        color: 'rgba(255,255,255,0.8)',
        minHeight: '100%',
        // CSS custom properties for responsive sizing (mobile defaults)
        ['--line-width' as string]: '68px',
        ['--line-height' as string]: '6px',
        ['--yin-gap' as string]: '8px',
        ['--label-size' as string]: '8px',
        ['--trigram-label-size' as string]: '8px',
        ['--num-size' as string]: '8px',
        ['--zh-size' as string]: '24px',
        ['--vi-size' as string]: '12px',
      }}
      className="[--line-width:68px] sm:[--line-width:88px] [--line-height:6px] sm:[--line-height:7px] [--yin-gap:8px] sm:[--yin-gap:10px] [--label-size:8px] sm:[--label-size:10px] [--trigram-label-size:8px] sm:[--trigram-label-size:9px] [--num-size:8px] sm:[--num-size:9px] [--zh-size:24px] sm:[--zh-size:28px] [--vi-size:12px] sm:[--vi-size:13px]"
    >
      <div style={{ padding: '20px 16px 40px', maxWidth: '720px', margin: '0 auto' }}>
        {/* Page title */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Gieo Quẻ · 擲錢法
        </div>

        {/* Hexagram area */}
        {changed && changedLineValues ? (
          // Two hexagrams side by side
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              position: 'relative',
            }}
            className="gap-3 sm:gap-4"
          >
            <HexagramDiagram
              info={primary}
              lineValues={lines}
              label="Bản Quái"
              showMoving={true}
            />
            <HexagramDiagram
              info={changed}
              lineValues={changedLineValues}
              label="Biến Quái"
              showMoving={false}
            />
          </div>
        ) : (
          // Single hexagram centered
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '200px' }}>
              <HexagramDiagram
                info={primary}
                lineValues={lines}
                label="Bản Quái"
                showMoving={true}
              />
            </div>
          </div>
        )}

        {/* Interpretation */}
        <InterpretationDisplay
          primaryNumber={primary.number}
          changedNumber={changed?.number ?? null}
          nuclearNumber={primary.nuclearNumber}
        />

        {/* Prompt Generator */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <PromptGenerator
            result={result}
            primaryData={primaryData}
            changedData={changedData}
            nuclearData={nuclearData}
          />
        </div>

        {/* Cast Again button */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={onCastAgain}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '12px 32px',
              fontSize: '15px',
              color: 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              minHeight: '48px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Gieo lại · Cast Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default HexagramResult

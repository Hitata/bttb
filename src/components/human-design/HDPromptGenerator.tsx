'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { HumanDesignChart } from '@/lib/human-design/types'
import { HD_CENTERS, HD_CHANNELS, HD_TYPES } from '@/lib/human-design-data'
import { getGateDescription } from '@/lib/human-design/gate-descriptions'
import { getIncarnationCross } from '@/lib/human-design/incarnation-crosses'

function generatePromptText(chart: HumanDesignChart): string {
  const typeData = HD_TYPES.find(t => t.id === chart.type)
  const profileLabel = `${chart.profile.conscious}/${chart.profile.unconscious}`

  const definedCentersList = chart.definedCenters
    .map(id => {
      const c = HD_CENTERS.find(cc => cc.id === id)
      return c ? `  ${c.vn} (${c.en})` : `  ${id}`
    })
    .join('\n')

  const channelsList = chart.definedChannels
    .map(ch => {
      const data = HD_CHANNELS.find(c => c.id === ch.id)
      return data
        ? `  ${ch.id}: ${data.vn} (${data.en}) — ${data.fromCenter} ↔ ${data.toCenter}`
        : `  ${ch.id}`
    })
    .join('\n')

  const formatPlanets = (planets: typeof chart.personalityPlanets) =>
    planets
      .map(p => {
        const desc = getGateDescription(p.gate)
        const name = desc ? ` — ${desc.hdName}` : ''
        return `  ${p.body.padEnd(10)} Gate ${String(p.gate).padStart(2)} Line ${p.line}${name}`
      })
      .join('\n')

  return `╔══════════════════════════════════════════╗
║      HUMAN DESIGN CHART · BIỂU ĐỒ      ║
╚══════════════════════════════════════════╝

Name: ${chart.input.name}
Birth: ${chart.input.year}-${String(chart.input.month).padStart(2, '0')}-${String(chart.input.day).padStart(2, '0')} ${String(chart.input.hour).padStart(2, '0')}:${String(chart.input.minute).padStart(2, '0')} ${chart.input.timezone}
${chart.birthTimeUnknown ? '⚠ Birth time unknown — chart may be approximate\n' : ''}
┌─ TYPE & STRATEGY ────────────────────────┐
│  Type: ${typeData?.vn ?? chart.type} (${typeData?.en ?? chart.type})
│  Strategy: ${typeData?.strategy.vn ?? ''}
│  Authority: ${chart.authority}
│  Profile: ${profileLabel}
│  Incarnation Cross: ${(() => { const c = getIncarnationCross(chart.incarnationCross.personalitySun, chart.profile.conscious, chart.profile.unconscious); return c ? c.fullName + ' — ' : '' })()}${chart.incarnationCross.personalitySun}/${chart.incarnationCross.personalityEarth} | ${chart.incarnationCross.designSun}/${chart.incarnationCross.designEarth}
└──────────────────────────────────────────┘

┌─ DEFINED CENTERS (${chart.definedCenters.length}/9) ────────────────┐
${definedCentersList || '  (none — Reflector)'}
└──────────────────────────────────────────┘

┌─ DEFINED CHANNELS (${chart.definedChannels.length}) ─────────────────┐
${channelsList || '  (none)'}
└──────────────────────────────────────────┘

┌─ PERSONALITY · Ý Thức (Conscious) ──────┐
${formatPlanets(chart.personalityPlanets)}
└──────────────────────────────────────────┘

┌─ DESIGN · Vô Thức (Unconscious) ────────┐
${formatPlanets(chart.designPlanets)}
└──────────────────────────────────────────┘`
}

export function HDPromptGenerator({ chart }: { chart: HumanDesignChart }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = generatePromptText(chart)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`transition-colors duration-150 ${copied ? 'bg-primary text-primary-foreground' : ''}`}
    >
      {copied ? 'Đã sao chép ✓' : 'Copy Prompt'}
    </Button>
  )
}

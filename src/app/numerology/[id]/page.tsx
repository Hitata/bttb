'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CoreNumbersPanel } from '@/components/numerology/CoreNumbersPanel'
import { NameBreakdown } from '@/components/numerology/NameBreakdown'
import { CyclesPanel } from '@/components/numerology/CyclesPanel'
import { ChallengesPanel } from '@/components/numerology/ChallengesPanel'
import { PinnaclesPanel } from '@/components/numerology/PinnaclesPanel'
import type { NumerologyResult } from '@/lib/numerology'

interface ReadingData {
  fullName: string
  birthYear: number
  birthMonth: number
  birthDay: number
  result: NumerologyResult
}

export default function SavedNumerologyReadingPage() {
  const params = useParams<{ id: string }>()
  const [reading, setReading] = useState<ReadingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/numerology/readings/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setReading)
      .catch(() => setError('Không tìm thấy lá số'))
  }, [params.id])

  if (error) return <div className="container mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">{error}</div>
  if (!reading) return <div className="container mx-auto max-w-6xl px-4 py-8 text-center text-muted-foreground">Đang tải...</div>

  const result = reading.result
  const currentAge = new Date().getFullYear() - reading.birthYear

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{reading.fullName}</h1>
        <p className="text-muted-foreground">
          {reading.birthDay}/{reading.birthMonth}/{reading.birthYear}
        </p>
      </div>

      <div className="space-y-8">
        <CoreNumbersPanel
          lifePath={result.lifePath}
          birthday={result.birthday}
          expression={result.expression}
          soulUrge={result.soulUrge}
          personality={result.personality}
          maturity={result.maturity}
        />

        <NameBreakdown breakdown={result.nameBreakdown} />

        <CyclesPanel cycles={result.cycles} />

        <ChallengesPanel challenges={result.challenges} currentAge={currentAge} />

        <PinnaclesPanel pinnacles={result.pinnacles} currentAge={currentAge} />
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import ImageDropZone from '@/components/iching/ImageDropZone'
import CoinCastAnimation from '@/components/iching/CoinCastAnimation'
import HexagramResult from '@/components/iching/HexagramResult'
import type { CastingResponse } from '@/lib/iching/types'

type PageState = 'idle' | 'casting' | 'result'

export default function IChing() {
  const [state, setState] = useState<PageState>('idle')
  const [result, setResult] = useState<CastingResponse | null>(null)
  const [question, setQuestion] = useState('')

  const handleCasted = (res: CastingResponse, q: string) => {
    setResult(res)
    setQuestion(q)
    setState('casting')
  }

  const handleAnimationComplete = () => setState('result')

  const handleCastAgain = () => {
    setResult(null)
    setQuestion('')
    setState('idle')
  }

  return (
    <div className="min-h-[calc(100vh-48px)] bg-background">
      {state === 'idle' && (
        <ImageDropZone onCasted={handleCasted} />
      )}
      {state === 'casting' && result && (
        <CoinCastAnimation result={result} onComplete={handleAnimationComplete} />
      )}
      {state === 'result' && result && (
        <HexagramResult result={result} question={question} onCastAgain={handleCastAgain} />
      )}
    </div>
  )
}

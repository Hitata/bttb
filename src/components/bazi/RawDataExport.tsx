'use client'

import { useState } from 'react'
import type { BaziResult, BirthInput } from '@/lib/bazi'
import { generateRawDataForAI, getRandomQuestions, DESTINY_QUESTIONS } from '@/lib/bazi/raw-data-generator'

interface RawDataExportProps {
  result: BaziResult
  input: BirthInput
}

export function RawDataExport({ result, input }: RawDataExportProps) {
  const [copied, setCopied] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const rawData = generateRawDataForAI(result, input)

  const fullPrompt = selectedQuestions.length > 0
    ? `${rawData}\n\n--- CÂU HỎI ---\n${selectedQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : rawData

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRandomQuestions = () => {
    setSelectedQuestions(getRandomQuestions(5))
    setShowQuestions(true)
  }

  const toggleQuestion = (q: string) => {
    setSelectedQuestions(prev =>
      prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Xuất dữ liệu cho AI</h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleCopy}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          {copied ? 'Đã copy!' : 'Copy prompt'}
        </button>
        <button
          onClick={handleRandomQuestions}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          5 câu hỏi ngẫu nhiên
        </button>
        <button
          onClick={() => setShowQuestions(!showQuestions)}
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          {showQuestions ? 'Ẩn câu hỏi' : 'Chọn câu hỏi'}
        </button>
      </div>

      {showQuestions && (
        <div className="max-h-60 overflow-y-auto rounded-md border p-3 space-y-1">
          {DESTINY_QUESTIONS.map((q, i) => (
            <label key={i} className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(q)}
                onChange={() => toggleQuestion(q)}
                className="mt-0.5"
              />
              <span>{q}</span>
            </label>
          ))}
        </div>
      )}

      <textarea
        readOnly
        value={fullPrompt}
        className="w-full h-48 rounded-md border bg-muted/50 p-3 text-xs font-mono"
      />
    </div>
  )
}

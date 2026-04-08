// src/components/readings/ChatPanel.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'

interface Message {
  id: string
  role: 'client' | 'assistant'
  content: string
  createdAt: string
}

interface ChatPanelProps {
  tokenId: string
  initialMessages: Message[]
  clientMessageCount: number
  maxMessages: number
  disabled?: boolean
  disabledReason?: string
}

export function ChatPanel({
  tokenId,
  initialMessages,
  clientMessageCount: initialCount,
  maxMessages,
  disabled = false,
  disabledReason,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientCount, setClientCount] = useState(initialCount)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isMaxed = clientCount >= maxMessages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending || disabled || isMaxed) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    setSending(true)

    // Optimistic UI — show client message immediately
    const tempId = `temp-${Date.now()}`
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'client',
      content: userMessage,
      createdAt: new Date().toISOString(),
    }])

    try {
      const res = await fetch(`/api/readings/${tokenId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send message')
      }

      const data = await res.json()
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content,
        createdAt: new Date().toISOString(),
      }])
      setClientCount(data.clientMessageCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="space-y-4 mb-4">
        {messages.length === 0 && !disabled && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Ask a follow-up question about your reading.
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                msg.role === 'client'
                  ? 'bg-primary text-primary-foreground whitespace-pre-wrap'
                  : 'bg-card border prose prose-sm prose-neutral dark:prose-invert max-w-none'
              }`}
            >
              {msg.role === 'client' ? msg.content : <Markdown>{msg.content}</Markdown>}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-lg px-4 py-2.5">
              <Loader2 size={16} className="animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive mb-2">{error}</p>
      )}

      {/* Input or status */}
      {disabled ? (
        <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          {disabledReason}
        </div>
      ) : isMaxed ? (
        <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          You have used all {maxMessages} questions. Contact your practitioner for a new reading link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            maxLength={2000}
            disabled={sending}
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="rounded-lg bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      )}

      {/* Question counter */}
      {!disabled && !isMaxed && (
        <p className="mt-2 text-xs text-muted-foreground text-right">
          {clientCount}/{maxMessages} questions used
        </p>
      )}
    </div>
  )
}

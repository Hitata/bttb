'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-card border rounded-2xl rounded-tl-md px-4 py-3">
        <div className="flex items-center gap-1" aria-label="Typing">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing_1.4s_ease-in-out_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing_1.4s_ease-in-out_0.2s_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-[typing_1.4s_ease-in-out_0.4s_infinite]" />
        </div>
      </div>
    </div>
  )
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
  const remaining = maxMessages - clientCount

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
      <div className="space-y-3 mb-4" role="log" aria-label="Chat messages">
        {messages.length === 0 && !disabled && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Ask a follow-up question about your reading.
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              You have {remaining} question{remaining !== 1 ? 's' : ''} available.
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] text-sm ${
                msg.role === 'client'
                  ? 'rounded-2xl rounded-br-md bg-primary text-primary-foreground px-4 py-2.5 whitespace-pre-wrap'
                  : 'rounded-2xl rounded-tl-md bg-card border px-4 py-2.5 prose prose-sm prose-neutral [&>*:first-child]:mt-0 [&>*:last-child]:mb-0'
              }`}
            >
              {msg.role === 'client' ? msg.content : <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>}
            </div>
          </div>
        ))}
        {sending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive mb-2" role="alert">{error}</p>
      )}

      {/* Input or status */}
      {disabled ? (
        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
          {disabledReason}
        </div>
      ) : isMaxed ? (
        <div className="rounded-lg border bg-muted/50 px-4 py-3 text-center text-sm text-muted-foreground">
          You have used all {maxMessages} questions. Contact your practitioner for a new reading link.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="bạn có muốn hỏi gì thêm ko?"
            maxLength={2000}
            disabled={sending}
            aria-label="Your question"
            className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground transition-shadow focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring/40 disabled:opacity-50"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            aria-label="Send question"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-primary/80 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Send size={16} />
          </button>
        </form>
      )}

      {/* Question counter */}
      {!disabled && !isMaxed && messages.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground text-right">
          {remaining} question{remaining !== 1 ? 's' : ''} remaining
        </p>
      )}
    </div>
  )
}

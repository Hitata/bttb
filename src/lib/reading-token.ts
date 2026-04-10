// src/lib/reading-token.ts
import { prisma } from '@/lib/prisma'

export type TokenStatus = 'valid' | 'not_found' | 'expired' | 'maxed'

export interface ValidatedToken {
  status: TokenStatus
  token?: Awaited<ReturnType<typeof loadToken>>
}

async function loadToken(tokenId: string) {
  return prisma.readingToken.findUnique({
    where: { id: tokenId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      clientProfile: {
        include: {
          baziClient: true,
          tuViClient: true,
        },
      },
    },
  })
}

export async function validateToken(tokenId: string): Promise<ValidatedToken> {
  const token = await loadToken(tokenId)
  if (!token) return { status: 'not_found' }
  if (new Date(token.expiresAt) <= new Date()) return { status: 'expired', token }

  const clientMessageCount = token.messages.filter(m => m.role === 'client').length
  if (clientMessageCount >= token.maxMessages) return { status: 'maxed', token }

  return { status: 'valid', token }
}

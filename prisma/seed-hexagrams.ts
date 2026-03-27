import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { join } from 'path'
import { HEXAGRAM_NAMES } from '../src/lib/iching/hexagram'

const prisma = new PrismaClient()

interface HexagramData {
  number: number
  nameVi: string
  nameZh: string
  nameEn: string
  structure: string
  nuclearNumber: number
  energyState: string
  physicist: string
  sage: string
  advisor: string
  balance: string
}

function extractSection(text: string, label: string): string {
  // Match from the label to the next **Section**: line or end of entry
  const regex = new RegExp(
    `\\*\\*${label}\\*\\*:\\s*([\\s\\S]*?)(?=\\*\\*[A-Za-z]|---\\s*$|$)`,
  )
  const match = regex.exec(text)
  if (!match) return ''
  return match[1].trim()
}

function parseHexagramEntry(entry: string): HexagramData | null {
  // Extract heading: ## Hexagram N — SYMBOL ZhName / ViName / EnName
  const headingMatch = /^## Hexagram (\d+) — .+? \/ (.+?) \/ (.+)$/m.exec(entry)
  if (!headingMatch) return null

  const number = parseInt(headingMatch[1], 10)
  const nameVi = headingMatch[2].trim()
  const nameEn = headingMatch[3].trim()

  // Get nameZh from HEXAGRAM_NAMES
  const nameZh = HEXAGRAM_NAMES[number]?.zh ?? ''

  // Extract Structure
  const structureMatch = /\*\*Structure\*\*:\s*(.+)/.exec(entry)
  const structure = structureMatch ? structureMatch[1].trim() : ''

  // Extract Nuclear Hexagram number only
  const nuclearMatch = /\*\*Nuclear Hexagram\*\*:\s*(\d+)/.exec(entry)
  const nuclearNumber = nuclearMatch ? parseInt(nuclearMatch[1], 10) : 0

  // Extract multi-line sections
  const energyState = extractSection(entry, 'Energy State')
  const physicist = extractSection(entry, 'Physicist')
  const sage = extractSection(entry, 'Sage')
  const advisor = extractSection(entry, 'Advisor')
  const balance = extractSection(entry, 'Balance')

  return {
    number,
    nameVi,
    nameZh,
    nameEn,
    structure,
    nuclearNumber,
    energyState,
    physicist,
    sage,
    advisor,
    balance,
  }
}

async function main() {
  const dataDir = join(__dirname, 'data')
  const part1 = readFileSync(join(dataDir, '64-hexagrams-part1.md'), 'utf-8')
  const part2 = readFileSync(join(dataDir, '64-hexagrams-part2.md'), 'utf-8')

  const combined = part1 + '\n' + part2

  // Split on "## Hexagram " boundaries, skip preamble (before first "## Hexagram")
  const rawEntries = combined.split(/(?=^## Hexagram \d+)/m)
  const hexagramEntries = rawEntries.filter((entry) => /^## Hexagram \d+/m.test(entry))

  const hexagrams: HexagramData[] = []

  for (const entry of hexagramEntries) {
    const parsed = parseHexagramEntry(entry)
    if (parsed) {
      hexagrams.push(parsed)
    } else {
      console.warn('Failed to parse entry:', entry.slice(0, 80))
    }
  }

  // Upsert all hexagrams
  for (const hex of hexagrams) {
    await prisma.hexagram.upsert({
      where: { number: hex.number },
      update: hex,
      create: hex,
    })
  }

  const count = await prisma.hexagram.count()
  if (count !== 64) {
    throw new Error(`Expected 64 hexagrams but got ${count}`)
  }

  console.log('Seeded 64 hexagrams')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

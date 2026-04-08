// scripts/migrate-client-profiles.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find all clients without profiles
  const [baziClients, tuViClients] = await Promise.all([
    prisma.baziClient.findMany({ where: { clientProfile: null } }),
    prisma.tuViClient.findMany({ where: { clientProfile: null } }),
  ])

  console.log(`Found ${baziClients.length} unlinked Bazi clients`)
  console.log(`Found ${tuViClients.length} unlinked Tu-Vi clients`)

  // Normalize gender for grouping
  const normalize = (g: string) => (g === 'Nam' || g === 'male') ? 'male' : 'female'

  // Group by name + birth date + normalized gender
  type Key = string
  const groups = new Map<Key, { baziId?: string; tuViId?: string; name: string }>()

  const key = (name: string, y: number, m: number, d: number, g: string): Key =>
    `${name}|${y}|${m}|${d}|${normalize(g)}`

  for (const c of baziClients) {
    const k = key(c.name, c.birthYear, c.birthMonth, c.birthDay, c.gender)
    const group = groups.get(k) ?? { name: c.name }
    group.baziId = c.id
    groups.set(k, group)
  }

  for (const c of tuViClients) {
    const k = key(c.name, c.birthYear, c.birthMonth, c.birthDay, c.gender)
    const existing = groups.get(k)
    if (existing) {
      existing.tuViId = c.id
    } else {
      groups.set(k, { name: c.name, tuViId: c.id })
    }
  }

  let created = 0
  let skipped = 0

  for (const [, group] of groups) {
    try {
      await prisma.clientProfile.create({
        data: {
          name: group.name,
          baziClientId: group.baziId ?? null,
          tuViClientId: group.tuViId ?? null,
        },
      })
      created++
    } catch (e) {
      // Skip if already linked (unique constraint violation)
      skipped++
    }
  }

  console.log(`Created ${created} profiles, skipped ${skipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

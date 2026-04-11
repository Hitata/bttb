import { Prisma } from '@prisma/client'

type SystemType = 'bazi' | 'tuvi' | 'hd' | 'numerology'

interface ClientMatch {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  gender?: string  // can be 'male', 'female', 'Nam', 'Nữ'
}

/**
 * Find or create a ClientProfile for a newly created system client.
 * Runs inside caller's Prisma transaction.
 *
 * Matching logic: name + birthYear + birthMonth + birthDay + normalized gender.
 * Gender is normalized for matching: 'Nam' = 'male', 'Nữ' = 'female'.
 * When gender is undefined (e.g. numerology), matching is by name + birth date only.
 */
export async function findOrCreateProfile(
  tx: Prisma.TransactionClient,
  system: SystemType,
  clientId: string,
  match: ClientMatch,
): Promise<string> {
  // Build OR clauses for finding existing profiles
  const orClauses: Prisma.ClientProfileWhereInput[] = []

  if (match.gender !== undefined) {
    // Normalize gender for matching
    const normalizedGender = match.gender === 'Nam' ? 'male'
      : match.gender === 'Nữ' ? 'female'
      : match.gender

    // Gender variants to match across systems (Bazi uses male/female, Tu-Vi uses Nam/Nữ)
    const genderVariants = normalizedGender === 'male' ? ['male', 'Nam'] : ['female', 'Nữ']

    orClauses.push(
      {
        baziClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
          gender: { in: genderVariants },
        },
      },
      {
        tuViClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
          gender: { in: genderVariants },
        },
      },
      {
        hdClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
          gender: { in: genderVariants },
        },
      },
    )
  } else {
    // No gender — match by birth date only
    orClauses.push(
      {
        baziClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
        },
      },
      {
        tuViClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
        },
      },
      {
        hdClient: {
          birthYear: match.birthYear,
          birthMonth: match.birthMonth,
          birthDay: match.birthDay,
        },
      },
    )
  }

  // Always include numerology matching (no gender)
  orClauses.push({
    numerologyClient: {
      birthYear: match.birthYear,
      birthMonth: match.birthMonth,
      birthDay: match.birthDay,
    },
  })

  // Find existing profile by matching linked clients' birth data
  const existing = await tx.clientProfile.findFirst({
    where: {
      name: match.name,
      OR: orClauses,
    },
  })

  const linkField = system === 'bazi' ? 'baziClientId'
    : system === 'tuvi' ? 'tuViClientId'
    : system === 'numerology' ? 'numerologyClientId'
    : 'hdClientId'

  if (existing) {
    // Link new client to existing profile
    const updated = await tx.clientProfile.update({
      where: { id: existing.id },
      data: { [linkField]: clientId },
    })
    return updated.id
  }

  // Create new profile
  const profile = await tx.clientProfile.create({
    data: {
      name: match.name,
      [linkField]: clientId,
    },
  })
  return profile.id
}

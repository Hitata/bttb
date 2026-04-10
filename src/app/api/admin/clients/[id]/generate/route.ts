import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeBazi, HEAVENLY_STEMS } from '@/lib/bazi'
import type { BirthInput } from '@/lib/bazi'
import { computeTuVi } from '@/lib/tu-vi'
import type { TuViBirthInput } from '@/lib/tu-vi'
import { computeHumanDesign } from '@/lib/human-design'

// HCMC fallback location for clients without location data
const HCMC_DEFAULTS = {
  timezone: 'Asia/Ho_Chi_Minh',
  latitude: 10.8231,
  longitude: 106.6297,
  birthPlace: 'Hồ Chí Minh',
}

/**
 * Normalize gender to 'male' | 'female' regardless of source system.
 * Bazi uses 'male'/'female'. Tu-Vi uses 'Nam'/'Nữ'.
 */
function normalizeGender(g: string): 'male' | 'female' {
  if (g === 'Nam' || g === 'male') return 'male'
  if (g === 'Nữ' || g === 'female') return 'female'
  // Fallback: try lowercase
  const lower = g.toLowerCase()
  if (lower === 'male' || lower === 'nam') return 'male'
  return 'female'
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { system } = body as { system: 'bazi' | 'tuvi' | 'hd' }

    if (!system || !['bazi', 'tuvi', 'hd'].includes(system)) {
      return NextResponse.json(
        { error: 'Invalid system. Must be one of: bazi, tuvi, hd' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Load the ClientProfile with all linked clients
      const profile = await tx.clientProfile.findUnique({
        where: { id },
        include: {
          baziClient: true,
          tuViClient: true,
          hdClient: true,
        },
      })

      if (!profile) {
        throw new Error('PROFILE_NOT_FOUND')
      }

      // 2. Validate system not already generated
      if (system === 'bazi' && profile.baziClient) {
        throw new Error('ALREADY_EXISTS')
      }
      if (system === 'tuvi' && profile.tuViClient) {
        throw new Error('ALREADY_EXISTS')
      }
      if (system === 'hd' && profile.hdClient) {
        throw new Error('ALREADY_EXISTS')
      }

      // 3. Get birth data from an existing linked client
      //    Prefer sources with location data (Tu-Vi and HD always have it; Bazi may not)
      const source = profile.tuViClient ?? profile.hdClient ?? profile.baziClient

      if (!source) {
        throw new Error('NO_SOURCE_DATA')
      }

      // 4. Validate gender is not empty
      if (!source.gender || source.gender.trim() === '') {
        throw new Error('MISSING_GENDER')
      }

      const normalizedGender = normalizeGender(source.gender)

      // Extract birth data
      const name = source.name
      const year = source.birthYear
      const month = source.birthMonth
      const day = source.birthDay
      const hour = source.birthHour ?? 0
      const minute = source.birthMinute ?? 0

      // Extract location (with fallback to HCMC defaults)
      const timezone = source.timezone ?? HCMC_DEFAULTS.timezone
      const latitude = source.latitude ?? HCMC_DEFAULTS.latitude
      const longitude = source.longitude ?? HCMC_DEFAULTS.longitude
      const birthPlace = source.birthPlace ?? HCMC_DEFAULTS.birthPlace

      // 5. Compute chart and create client record
      if (system === 'bazi') {
        const input: BirthInput = {
          name,
          gender: normalizedGender,
          year,
          month,
          day,
          hour,
          minute,
        }
        const baziResult = computeBazi(input)
        const dmStem = HEAVENLY_STEMS[baziResult.dayMasterIndex]
        const dayMaster = `${dmStem.name} ${dmStem.element}`
        const { tutru } = baziResult
        const chartSummary = `${tutru.thienTru.can}${tutru.thienTru.chi} ${tutru.nguyetTru.can}${tutru.nguyetTru.chi} ${tutru.nhatTru.can}${tutru.nhatTru.chi} ${tutru.thoiTru.can}${tutru.thoiTru.chi}`

        const client = await tx.baziClient.create({
          data: {
            name,
            gender: normalizedGender,
            birthYear: year,
            birthMonth: month,
            birthDay: day,
            birthHour: hour,
            birthMinute: minute,
            birthPlace: birthPlace ?? null,
            latitude: latitude ?? null,
            longitude: longitude ?? null,
            timezone: timezone ?? null,
            dayMaster,
            chartSummary,
            fullChart: JSON.stringify(baziResult),
          },
        })

        // 6. Link to the profile
        await tx.clientProfile.update({
          where: { id },
          data: { baziClientId: client.id },
        })

        return { clientId: client.id, chartSummary }
      }

      if (system === 'tuvi') {
        // Tu-Vi gender must be 'Nam' or 'Nữ'
        const tuviGender = normalizedGender === 'male' ? 'Nam' : 'Nữ'

        const input: TuViBirthInput = {
          name,
          gender: tuviGender,
          year,
          month,
          day,
          hour,
          minute,
          timezone,
          latitude,
          longitude,
          birthPlace,
        }
        const chart = computeTuVi(input)
        const cucName = chart.profile.cucName
        const chartSummary = `${chart.profile.napAm.name} · ${chart.profile.menhChu}`

        const client = await tx.tuViClient.create({
          data: {
            name,
            gender: tuviGender,
            birthYear: year,
            birthMonth: month,
            birthDay: day,
            birthHour: hour,
            birthMinute: minute,
            birthPlace,
            latitude,
            longitude,
            timezone,
            cucName,
            chartSummary,
            fullChart: JSON.stringify(chart),
          },
        })

        // 6. Link to the profile
        await tx.clientProfile.update({
          where: { id },
          data: { tuViClientId: client.id },
        })

        return { clientId: client.id, chartSummary }
      }

      // system === 'hd'
      const input = {
        name,
        gender: normalizedGender,
        year: Number(year),
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
        timezone,
        latitude: Number(latitude),
        longitude: Number(longitude),
        birthTimeUnknown: false,
      }
      const chart = computeHumanDesign(input)
      const designType = chart.type
      const chartSummary = `${chart.type} · ${chart.authority}`

      const client = await tx.humanDesignClient.create({
        data: {
          name,
          gender: normalizedGender,
          birthYear: Number(year),
          birthMonth: Number(month),
          birthDay: Number(day),
          birthHour: Number(hour),
          birthMinute: Number(minute),
          birthTimeUnknown: false,
          birthPlace: birthPlace ?? null,
          latitude: Number(latitude),
          longitude: Number(longitude),
          timezone: timezone ?? null,
          designType,
          chartSummary,
          fullChart: JSON.stringify(chart),
        },
      })

      // 6. Link to the profile
      await tx.clientProfile.update({
        where: { id },
        data: { hdClientId: client.id },
      })

      return { clientId: client.id, chartSummary }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'PROFILE_NOT_FOUND') {
        return NextResponse.json({ error: 'Client profile not found' }, { status: 404 })
      }
      if (error.message === 'ALREADY_EXISTS') {
        return NextResponse.json(
          { error: 'This system has already been generated for this client' },
          { status: 409 }
        )
      }
      if (error.message === 'NO_SOURCE_DATA') {
        return NextResponse.json(
          { error: 'No existing client data found to generate reading from' },
          { status: 400 }
        )
      }
      if (error.message === 'MISSING_GENDER') {
        return NextResponse.json(
          { error: 'Gender is required to generate readings' },
          { status: 400 }
        )
      }
    }
    console.error('Generate reading error:', error)
    return NextResponse.json({ error: 'Failed to generate reading' }, { status: 500 })
  }
}

// Human Design Chart Derivation
//
// Pure functional pipeline:
// Gate activations → defined channels → defined centers → type → authority → profile → cross

import { HD_CHANNELS, HD_CENTERS } from '@/lib/human-design-data'
import type {
  GateActivation,
  DefinedChannel,
  HDAuthorityType,
  HDTypeId,
  HumanDesignChart,
  HDBirthInput,
  PersonalityDesignActivations,
} from './types'

// Step 1: Collect all gate activations from personality + design
function collectGateActivations(activations: PersonalityDesignActivations): GateActivation[] {
  const fromSide = (positions: PersonalityDesignActivations['personality'], side: 'personality' | 'design') =>
    positions.map(p => ({ gate: p.gate, line: p.line, longitude: p.longitude, body: p.body, side }))
  return [
    ...fromSide(activations.personality, 'personality'),
    ...fromSide(activations.design, 'design'),
  ]
}

// Step 2: Find defined channels (both gates activated by any body on either side)
function findDefinedChannels(allActivations: GateActivation[]): DefinedChannel[] {
  const activeGates = new Set(allActivations.map(a => a.gate))
  return HD_CHANNELS
    .filter(ch => activeGates.has(ch.gates[0]) && activeGates.has(ch.gates[1]))
    .map(ch => ({
      id: ch.id,
      gates: ch.gates as readonly [number, number],
      fromCenter: ch.fromCenter,
      toCenter: ch.toCenter,
      activatedBy: {
        gate1: allActivations.find(a => a.gate === ch.gates[0])!,
        gate2: allActivations.find(a => a.gate === ch.gates[1])!,
      },
    }))
}

// Step 3: Find defined centers (connected to at least one defined channel)
function findDefinedCenters(definedChannels: DefinedChannel[]): string[] {
  const centers = new Set<string>()
  for (const ch of definedChannels) {
    centers.add(ch.fromCenter)
    centers.add(ch.toCenter)
  }
  return [...centers]
}

// Step 4: Motor-to-Throat detection via BFS
function hasMotorToThroat(
  definedChannels: DefinedChannel[],
  definedCenters: string[],
  excludeSacral = false,
): boolean {
  // Build adjacency list from defined channels only
  const adj = new Map<string, string[]>()
  for (const ch of definedChannels) {
    if (!adj.has(ch.fromCenter)) adj.set(ch.fromCenter, [])
    if (!adj.has(ch.toCenter)) adj.set(ch.toCenter, [])
    adj.get(ch.fromCenter)!.push(ch.toCenter)
    adj.get(ch.toCenter)!.push(ch.fromCenter)
  }

  // Motor centers from HD_CENTERS data
  const motorCenters = HD_CENTERS
    .filter(c => c.types.includes('motor') && definedCenters.includes(c.id))
    .filter(c => !excludeSacral || c.id !== 'sacral')
    .map(c => c.id)

  // BFS from each motor center to throat
  for (const motor of motorCenters) {
    const visited = new Set<string>()
    const queue = [motor]
    while (queue.length > 0) {
      const current = queue.shift()!
      if (current === 'throat') return true
      if (visited.has(current)) continue
      visited.add(current)
      for (const neighbor of (adj.get(current) ?? [])) {
        if (!visited.has(neighbor)) queue.push(neighbor)
      }
    }
  }
  return false
}

// Step 5: Derive type
function deriveType(definedCenters: string[], definedChannels: DefinedChannel[]): HDTypeId {
  const sacralDefined = definedCenters.includes('sacral')
  if (sacralDefined) {
    return hasMotorToThroat(definedChannels, definedCenters)
      ? 'manifesting-generator' : 'generator'
  }
  if (hasMotorToThroat(definedChannels, definedCenters, true)) return 'manifestor'
  if (definedCenters.length > 0) return 'projector'
  return 'reflector'
}

// Step 6: Derive authority (first defined center in hierarchy wins)
const AUTHORITY_HIERARCHY: { center: string; authority: HDAuthorityType }[] = [
  { center: 'solar-plexus', authority: 'emotional' },
  { center: 'sacral', authority: 'sacral' },
  { center: 'spleen', authority: 'splenic' },
  { center: 'heart', authority: 'ego' },
  { center: 'g', authority: 'self-projected' },
  { center: 'throat', authority: 'mental' },
]

function deriveAuthority(definedCenters: string[], type: HDTypeId): HDAuthorityType {
  if (type === 'reflector') return 'lunar'
  for (const { center, authority } of AUTHORITY_HIERARCHY) {
    if (definedCenters.includes(center)) return authority
  }
  return 'lunar'
}

// Main orchestrator: activations → complete chart
export function deriveChart(
  activations: PersonalityDesignActivations,
  input: HDBirthInput,
): HumanDesignChart {
  const allActivations = collectGateActivations(activations)
  const definedChannels = findDefinedChannels(allActivations)
  const definedCenters = findDefinedCenters(definedChannels)
  const allCenterIds = HD_CENTERS.map(c => c.id)
  const undefinedCenters = allCenterIds.filter(id => !definedCenters.includes(id))
  const type = deriveType(definedCenters, definedChannels)
  const authority = deriveAuthority(definedCenters, type)

  // Profile: Personality Sun line (conscious) + Design Sun line (unconscious)
  const personalitySun = activations.personality.find(p => p.body === 'Sun')!
  const designSun = activations.design.find(p => p.body === 'Sun')!
  const profile = {
    conscious: personalitySun.line,
    unconscious: designSun.line,
  }

  // Incarnation Cross: Sun/Earth gates from both sides
  const personalityEarth = activations.personality.find(p => p.body === 'Earth')!
  const designEarth = activations.design.find(p => p.body === 'Earth')!
  const incarnationCross = {
    personalitySun: personalitySun.gate,
    personalityEarth: personalityEarth.gate,
    designSun: designSun.gate,
    designEarth: designEarth.gate,
  }

  return {
    input,
    type,
    authority,
    profile,
    incarnationCross,
    definedCenters,
    undefinedCenters,
    definedChannels,
    gateActivations: allActivations,
    personalityPlanets: [...activations.personality],
    designPlanets: [...activations.design],
    designDate: activations.designDate.toISOString(),
    birthDateUTC: activations.birthDateUTC.toISOString(),
    birthTimeUnknown: input.birthTimeUnknown ?? false,
  }
}

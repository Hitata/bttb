// Human Design Calculator — Type Definitions
// All types are readonly for functional style

export interface HDBirthInput {
  readonly name: string
  readonly year: number
  readonly month: number
  readonly day: number
  readonly hour: number
  readonly minute: number
  readonly timezone: string      // IANA (authoritative for UTC conversion)
  readonly latitude: number
  readonly longitude: number
  readonly gender?: string
  readonly birthTimeUnknown?: boolean
}

export type CelestialBody =
  | 'Sun' | 'Earth' | 'Moon' | 'NorthNode' | 'SouthNode'
  | 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn'
  | 'Uranus' | 'Neptune' | 'Pluto'

export interface PlanetPosition {
  readonly body: CelestialBody
  readonly longitude: number     // ecliptic degrees 0-360
  readonly gate: number
  readonly line: number
}

export interface GateActivation {
  readonly gate: number          // 1-64
  readonly line: number          // 1-6
  readonly longitude: number     // ecliptic degrees
  readonly body: CelestialBody
  readonly side: 'personality' | 'design'
}

export interface PersonalityDesignActivations {
  readonly personality: readonly PlanetPosition[]  // 13 bodies at birth
  readonly design: readonly PlanetPosition[]       // 13 bodies at design date
  readonly designDate: Date
  readonly birthDateUTC: Date
}

export interface DefinedChannel {
  readonly id: string
  readonly gates: readonly [number, number]
  readonly fromCenter: string
  readonly toCenter: string
  readonly activatedBy: {
    readonly gate1: GateActivation
    readonly gate2: GateActivation
  }
}

export type HDAuthorityType =
  | 'emotional' | 'sacral' | 'splenic' | 'ego' | 'self-projected'
  | 'mental' | 'lunar'

export type HDTypeId =
  | 'generator' | 'manifesting-generator' | 'manifestor'
  | 'projector' | 'reflector'

export interface HumanDesignChart {
  readonly input: HDBirthInput
  readonly type: HDTypeId
  readonly authority: HDAuthorityType
  readonly profile: { readonly conscious: number; readonly unconscious: number }
  readonly incarnationCross: {
    readonly personalitySun: number
    readonly personalityEarth: number
    readonly designSun: number
    readonly designEarth: number
  }
  readonly definedCenters: readonly string[]
  readonly undefinedCenters: readonly string[]
  readonly definedChannels: readonly DefinedChannel[]
  readonly gateActivations: readonly GateActivation[]
  readonly personalityPlanets: readonly PlanetPosition[]
  readonly designPlanets: readonly PlanetPosition[]
  readonly designDate: string    // ISO string
  readonly birthDateUTC: string  // ISO string
  readonly birthTimeUnknown: boolean
}

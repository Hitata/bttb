'use client'

import { HD_CENTERS, HD_CHANNELS, type HdCenter } from '@/lib/human-design-data'
import type { GateActivation, DefinedChannel, PlanetPosition } from '@/lib/human-design/types'

// SVG positions for the 9 centers in the bodygraph layout
const CENTER_POSITIONS: Record<string, { x: number; y: number }> = {
  head: { x: 150, y: 32 },
  ajna: { x: 150, y: 90 },
  throat: { x: 150, y: 155 },
  g: { x: 150, y: 228 },
  heart: { x: 215, y: 262 },
  sacral: { x: 150, y: 325 },
  'solar-plexus': { x: 85, y: 315 },
  spleen: { x: 75, y: 262 },
  root: { x: 150, y: 405 },
}

// Gate positions on the bodygraph (approximate positions along channel lines)
// Each gate sits at a percentage along the channel line from its center
function getGatePosition(gate: number, channelId: string, fromCenter: string, toCenter: string): { x: number; y: number } | null {
  const from = CENTER_POSITIONS[fromCenter]
  const to = CENTER_POSITIONS[toCenter]
  if (!from || !to) return null

  // Find which end of the channel this gate is on
  const channel = HD_CHANNELS.find(c => c.id === channelId)
  if (!channel) return null

  // Gate at gates[0] is closer to fromCenter (30%), gate at gates[1] is closer to toCenter (70%)
  const t = channel.gates[0] === gate ? 0.3 : 0.7
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  }
}

// Shape renderers for each center type
function CenterShape({
  center,
  x,
  y,
  isDefined,
  isHighlighted,
  onClick,
}: {
  center: HdCenter
  x: number
  y: number
  isDefined: boolean
  isHighlighted: boolean
  onClick?: () => void
}) {
  const size = center.id === 'heart' ? 22 : 28
  const fill = isDefined ? center.color : 'transparent'
  const stroke = isDefined ? center.color : 'currentColor'
  const strokeOpacity = isDefined ? 1 : 0.3
  const fillOpacity = isDefined ? 0.25 : 0
  const highlightStroke = isHighlighted ? 3 : 1.5

  const commonProps = {
    fill,
    stroke,
    strokeWidth: highlightStroke,
    strokeOpacity,
    fillOpacity: isDefined ? fillOpacity + 0.15 : fillOpacity,
    className: `transition-all duration-200 ${onClick ? 'cursor-pointer hover:fill-opacity-40' : ''}`,
    onClick,
  }

  switch (center.shape) {
    case 'triangle-up':
      return (
        <polygon
          points={`${x},${y - size} ${x - size},${y + size * 0.6} ${x + size},${y + size * 0.6}`}
          {...commonProps}
        />
      )
    case 'triangle-down':
      return (
        <polygon
          points={`${x - size},${y - size * 0.6} ${x + size},${y - size * 0.6} ${x},${y + size}`}
          {...commonProps}
        />
      )
    case 'diamond':
      return (
        <polygon
          points={`${x},${y - size} ${x + size},${y} ${x},${y + size} ${x - size},${y}`}
          {...commonProps}
        />
      )
    case 'square':
    default:
      return (
        <rect
          x={x - size}
          y={y - size}
          width={size * 2}
          height={size * 2}
          rx={4}
          {...commonProps}
        />
      )
  }
}

interface BodygraphSvgProps {
  // Existing props (unchanged)
  definedCenters?: string[]
  highlightCenter?: string | null
  onCenterClick?: (centerId: string) => void
  showLabels?: boolean
  showChannels?: boolean
  className?: string
  // NEW optional props for personal chart
  definedChannels?: readonly DefinedChannel[]
  gateActivations?: readonly GateActivation[]
  onGateClick?: (gateId: number) => void
  onChannelClick?: (channelId: string) => void
  highlightGate?: number | null
  highlightChannel?: string | null
  showGateNumbers?: boolean
  // Transit overlay
  transitPositions?: readonly PlanetPosition[]
}

export function BodygraphSvg({
  definedCenters = [],
  highlightCenter,
  onCenterClick,
  showLabels = true,
  showChannels = true,
  className = '',
  definedChannels,
  gateActivations,
  onGateClick,
  onChannelClick,
  highlightGate,
  highlightChannel,
  showGateNumbers = false,
  transitPositions,
}: BodygraphSvgProps) {
  // Build lookup sets for gate activations
  const activeGates = gateActivations
    ? new Set(gateActivations.map(a => a.gate))
    : new Set<number>()

  const definedChannelIds = definedChannels
    ? new Set(definedChannels.map(c => c.id))
    : new Set<string>()

  // Determine if a gate activation is personality, design, or both
  const getGateSide = (gate: number): 'personality' | 'design' | 'both' | null => {
    if (!gateActivations) return null
    const activations = gateActivations.filter(a => a.gate === gate)
    if (activations.length === 0) return null
    const hasP = activations.some(a => a.side === 'personality')
    const hasD = activations.some(a => a.side === 'design')
    if (hasP && hasD) return 'both'
    if (hasP) return 'personality'
    return 'design'
  }

  return (
    <svg
      viewBox="0 0 300 450"
      className={`w-full max-w-xs mx-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Channel pulse animation */}
      <defs>
        <style>{`
          @keyframes subtle-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.75; }
          }
          .channel-defined {
            animation: subtle-pulse 3s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .channel-defined { animation: none; opacity: 0.65; }
            .transit-gate { animation: none; opacity: 0.4; }
          }
          @keyframes transit-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .transit-gate {
            animation: transit-glow 2s ease-in-out infinite;
          }
        `}</style>
      </defs>

      {/* Channels */}
      {showChannels && HD_CHANNELS.map((ch) => {
        const from = CENTER_POSITIONS[ch.fromCenter]
        const to = CENTER_POSITIONS[ch.toCenter]
        if (!from || !to) return null

        const isDefined = definedChannelIds.has(ch.id)
        const isHL = highlightChannel === ch.id

        // Use terracotta (primary) for defined channels when personal chart data is present
        const hasPersonalData = definedChannels && definedChannels.length > 0
        const stroke = isDefined
          ? (hasPersonalData ? 'var(--primary)' : '#8b5cf6')
          : 'currentColor'

        return (
          <line
            key={ch.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={stroke}
            strokeWidth={isDefined ? (isHL ? 3.5 : 2.5) : 1}
            strokeOpacity={isDefined ? 0.7 : 0.08}
            className={`transition-all duration-200 ${isDefined ? 'channel-defined' : ''} ${onChannelClick && isDefined ? 'cursor-pointer' : ''}`}
            onClick={onChannelClick && isDefined ? () => onChannelClick(ch.id) : undefined}
          />
        )
      })}

      {/* Gate number labels on channels */}
      {showGateNumbers && gateActivations && HD_CHANNELS.map((ch) => {
        const isDefined = definedChannelIds.has(ch.id)
        return ch.gates.map(gate => {
          if (!activeGates.has(gate)) return null
          const pos = getGatePosition(gate, ch.id, ch.fromCenter, ch.toCenter)
          if (!pos) return null
          const side = getGateSide(gate)
          const isHL = highlightGate === gate
          return (
            <g key={`gate-${ch.id}-${gate}`}>
              {/* Invisible hit area for touch */}
              {onGateClick && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={10}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onGateClick(gate)}
                />
              )}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHL ? 8 : 6.5}
                fill={isDefined ? 'var(--card)' : 'var(--background)'}
                stroke={
                  side === 'design' ? 'var(--destructive)'
                    : side === 'personality' ? 'var(--foreground)'
                      : side === 'both' ? 'var(--primary)'
                        : 'currentColor'
                }
                strokeWidth={isDefined ? 1.5 : 0.8}
                strokeOpacity={isDefined ? 0.9 : 0.3}
                className="transition-all duration-200"
              />
              <text
                x={pos.x}
                y={pos.y + 0.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontWeight="500"
                className={`pointer-events-none ${
                  side === 'design' ? 'fill-destructive'
                    : side === 'personality' ? 'fill-foreground'
                      : side === 'both' ? 'fill-primary'
                        : 'fill-muted-foreground'
                }`}
                opacity={isDefined ? 0.9 : 0.4}
              >
                {gate}
              </text>
            </g>
          )
        })
      })}

      {/* Transit overlay gates */}
      {transitPositions && HD_CHANNELS.map((ch) => {
        const transitGates = new Set(transitPositions.map(p => p.gate))
        return ch.gates.map(gate => {
          if (!transitGates.has(gate)) return null
          const pos = getGatePosition(gate, ch.id, ch.fromCenter, ch.toCenter)
          if (!pos) return null
          return (
            <circle
              key={`transit-${ch.id}-${gate}`}
              cx={pos.x}
              cy={pos.y}
              r={8}
              fill="var(--chart-2, #14b8a6)"
              fillOpacity={0.15}
              stroke="var(--chart-2, #14b8a6)"
              strokeWidth={1.5}
              strokeOpacity={0.5}
              className="transit-gate pointer-events-none"
            />
          )
        })
      })}

      {/* Centers */}
      {HD_CENTERS.map((center) => {
        const pos = CENTER_POSITIONS[center.id]
        if (!pos) return null
        const isDefined = definedCenters.includes(center.id)
        const isHighlighted = highlightCenter === center.id

        return (
          <g key={center.id}>
            <CenterShape
              center={center}
              x={pos.x}
              y={pos.y}
              isDefined={isDefined}
              isHighlighted={isHighlighted}
              onClick={onCenterClick ? () => onCenterClick(center.id) : undefined}
            />
            {/* Center label */}
            {showLabels && (
              <text
                x={pos.x}
                y={pos.y + 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7"
                fontWeight="600"
                className="fill-foreground pointer-events-none"
                opacity={isDefined ? 0.9 : 0.35}
              >
                {center.en.replace(' Center', '').replace('Heart/Will', 'Will')}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

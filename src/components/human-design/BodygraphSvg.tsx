'use client'

import { HD_CENTERS, HD_CHANNELS, type HdCenter } from '@/lib/human-design-data'

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

export function BodygraphSvg({
  definedCenters = [],
  highlightCenter,
  onCenterClick,
  showLabels = true,
  showChannels = true,
  className = '',
}: {
  definedCenters?: string[]
  highlightCenter?: string | null
  onCenterClick?: (centerId: string) => void
  showLabels?: boolean
  showChannels?: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 300 450"
      className={`w-full max-w-xs mx-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Channels */}
      {showChannels && HD_CHANNELS.map((ch) => {
        const from = CENTER_POSITIONS[ch.fromCenter]
        const to = CENTER_POSITIONS[ch.toCenter]
        if (!from || !to) return null
        const bothDefined =
          definedCenters.includes(ch.fromCenter) && definedCenters.includes(ch.toCenter)
        return (
          <line
            key={ch.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={bothDefined ? '#8b5cf6' : 'currentColor'}
            strokeWidth={bothDefined ? 2 : 1}
            strokeOpacity={bothDefined ? 0.6 : 0.12}
          />
        )
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
                {center.en.replace(' Center', '')}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

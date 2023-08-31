import React from 'react'

interface ProviderPatternProps {
  width: number
  height: number
  radius: number
  provider: string
  stroke?: string
  strokeWidth?: number
  strokeDasharray?: string
  className?: string
  imageSpacing?: number
}

/**
 * Generates an svg pattern for a specific provider. The id of the pattern is the provider name + `-pattern` (ex.: `example-pattern`).
 * @param param0
 * @returns
 */
const ProviderPattern: React.FC<ProviderPatternProps> = ({
  width,
  height,
  radius,
  stroke,
  provider,
  strokeWidth,
  strokeDasharray,
  className,
  imageSpacing = 30
}) => {
  const id = `${provider}-pattern`
  const patternWidth = width + imageSpacing
  const patternHeight = height + imageSpacing
  return (
    <pattern
      id={id}
      width={patternWidth}
      height={patternHeight}
      patternUnits="userSpaceOnUse"
      className={className}
    >
      <image
        href={`/provider-icons/${provider}.png`}
        x="0"
        y="0"
        width={width}
        height={height} />
      <circle
        cx={width / 2}
        cy={height / 2}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        fill={`url(#${id})`}
      />
    </pattern>
  )
}

export { ProviderPattern }

import { Orientation } from '@visx/axis'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridColumns } from '@visx/react-spring/lib'
import { useState } from 'react'
import { AnimationTrajectory, Gradient, IVisVAxisProps, gridColor, labelColor, tickLabelProps } from '.'
import { useColors } from '../../../..'
export function VisHAxis({
  scale,
  width = 0,
  height = 0,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  axisWidth = 0
}: IVisVAxisProps) {
  const colors = useColors()
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('min')
  const axis = (!!scale) ? {
    scale,
    label: 'timescale',
  } : undefined
  if (!axis) return <></>
  return <>
    <Gradient />
    <rect
      x={marginLeft}
      y={marginTop}
      width={width}
      height={axisWidth}
      fill={'url(#visx-axis-gradient)'}
      rx={14}
    />
    <g>
      <AnimatedGridColumns
        key={`gridcolumns-${animationTrajectory}`}
        scale={scale as GridScale}
        stroke={gridColor}
        height={axisWidth}
        top={marginTop}
        left={marginLeft}
        animationTrajectory={animationTrajectory}
      />
      <AnimatedAxis
        key={`axis-${animationTrajectory}`}
        orientation={Orientation.top}
        top={marginTop}
        scale={scale as GridScale}
        stroke={colors.chartBackground}
        tickStroke={colors.chartBackground}
        tickLabelProps={{
          ...tickLabelProps,
          fill: colors.primaryContrast,
          className: 'unselectable',
        }}
        labelProps={{
          x: marginLeft,
          y1: marginTop,
          y2: axisWidth + marginTop,
          fill: labelColor,
          fontSize: 18,
          paintOrder: 'stroke',
          fontFamily: 'sans-serif',
          textAnchor: 'start',
          className: 'unselectable',
        }}
        animationTrajectory={animationTrajectory}
      />
    </g>
  </>
}

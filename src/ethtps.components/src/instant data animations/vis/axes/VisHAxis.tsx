import { AxisScale, Orientation } from '@visx/axis'
import { LinearGradient } from '@visx/gradient'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridColumns, AnimatedGridRows } from '@visx/react-spring/lib'
import { useState } from 'react'
import { IComponentSize, WithMargins, range } from '../../../..'
import { AnimationTrajectory, IVisVAxisProps, axisColor, backgroundColor, gridColor, labelColor, tickLabelProps } from './Types'
import { scaleBand, scaleLinear } from 'd3'
import * as d3 from 'd3'
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
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('min')
  const axis = (!!scale) ? {
    scale,
    label: 'timescale',
  } : undefined
  if (!axis) return <></>
  return <>
    <LinearGradient
      id="visx-axis-xgradient"
      from={backgroundColor}
      to={backgroundColor}
      toOpacity={0.5}
    />
    <rect
      x={marginLeft}
      y={marginTop}
      width={width}
      height={axisWidth}
      fill={'url(#visx-axis-xgradient)'}
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
        orientation={Orientation.bottom}
        top={marginTop}
        scale={scale as GridScale}
        stroke={axisColor}
        tickStroke={axisColor}
        tickLabelProps={tickLabelProps}
        labelProps={{
          x: marginLeft,
          y1: marginTop,
          y2: axisWidth + marginTop,
          fill: labelColor,
          fontSize: 18,
          strokeWidth: 0,
          stroke: '#fff',
          paintOrder: 'stroke',
          fontFamily: 'sans-serif',
          textAnchor: 'start',
        }}
        animationTrajectory={animationTrajectory}
      />
    </g>
  </>
}

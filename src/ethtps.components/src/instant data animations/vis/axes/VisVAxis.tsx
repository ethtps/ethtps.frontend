import { Orientation } from '@visx/axis'
import { LinearGradient } from '@visx/gradient'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridColumns, AnimatedGridRows } from '@visx/react-spring/lib'
import { scaleLinear } from 'd3'
import { useState } from 'react'
import { range } from '../../../..'
import { AnimationTrajectory, IVisVAxisProps, axisColor, backgroundColor, gridColor, labelColor, tickLabelProps } from './Types'



export function VisVAxis({
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
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('center')

  const axis = (!!scale) ? {
    scale,
    label: 'y',
  } : undefined
  console.info(axis)
  if (!axis) return <></>
  return <>
    <LinearGradient
      id="visx-axis-ygradient"
      from={backgroundColor}
      to={backgroundColor}
      toOpacity={0.5}
    />
    <rect
      x={marginLeft}
      y={marginTop}
      width={axisWidth}
      height={height}
      fill={'url(#visx-axis-ygradient)'}
      rx={14}
    />
    <g >
      <AnimatedGridRows
        key={`gridrows-${animationTrajectory}`}
        scale={scaleLinear().domain(scale!.domain()).range(scale!.range())}
        stroke={gridColor}
        width={axisWidth}
        top={marginTop}
        left={marginLeft}
        tickValues={range(3).map((i) => i * 1)}
        animationTrajectory={animationTrajectory}
      />
      <AnimatedAxis
        key={`axis-${animationTrajectory}`}
        orientation={Orientation.left}
        top={marginTop}
        scale={scale as GridScale}
        stroke={axisColor}
        tickStroke={axisColor}
        tickLabelProps={tickLabelProps}
        labelProps={{
          x1: marginLeft + axisWidth,
          x2: marginLeft + axisWidth,
          y: marginTop,
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

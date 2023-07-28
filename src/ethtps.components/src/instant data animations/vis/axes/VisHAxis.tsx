import { Orientation } from '@visx/axis'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridColumns } from '@visx/react-spring/lib'
import { useState } from 'react'
import { AnimationTrajectory, Gradient, IVisAxisProps, extend, gridColor, labelColor, tickLabelProps } from '.'
import { useColors } from '../../../..'

export function VisHAxis(props: IVisAxisProps) {
  const colors = useColors()
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('min')
  const axis = (!!props.scale) ? {
    scale: props.scale,
    label: 'timescale',
  } : undefined
  if (!axis) return <></>
  const axisWidth = props.axisWidth ?? 50
  const eprops = extend(props)
  return <>
    <Gradient />
    <rect
      x={eprops.left}
      y={eprops.top}
      width={props.width}
      height={props.axisWidth}
      fill={'url(#visx-axis-gradient)'}
      rx={14}
    />
    <g>
      <AnimatedGridColumns
        key={`gridcolumns-${animationTrajectory}`}
        scale={props.scale as GridScale}
        stroke={gridColor}
        height={props.axisWidth ?? 50}
        top={eprops.top}
        left={eprops.left}
        animationTrajectory={animationTrajectory}
      />
      <AnimatedAxis
        key={`axis-${animationTrajectory}`}
        orientation={Orientation.top}
        top={eprops.top}
        scale={props.scale as GridScale}
        stroke={colors.chartBackground}
        tickStroke={colors.chartBackground}
        tickLabelProps={{
          ...tickLabelProps,
          fill: colors.primaryContrast,
          className: 'unselectable',
        }}
        labelProps={{
          x: eprops.left,
          y1: eprops.top,
          y2: axisWidth + (props.marginTop ?? 0) - (props.marginBottom ?? 0),
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

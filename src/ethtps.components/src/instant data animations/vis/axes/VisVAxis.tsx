import { Orientation } from '@visx/axis'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridRows } from '@visx/react-spring/lib'
import { useState } from 'react'
import { AnimationTrajectory, Gradient, IVisAxisProps, extend, gridColor, tickLabelProps } from '.'
import { useColors } from '../../../..'



export function VisVAxis(props: IVisAxisProps) {
  const {
    scale,
    width = 0,
    height = 0,
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    axisWidth = 0
  } = props
  const colors = useColors()
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('center')

  const axis = (!!scale) ? {
    scale,
    label: 'y',
  } : undefined
  if (!axis) return <></>
  const eprops = extend(props)
  return <>
    <Gradient />
    <rect
      x={eprops.left}
      y={eprops.top}
      width={axisWidth}
      height={eprops.bottom - axisWidth}
      fill={'url(#visx-axis-gradient)'}
      rx={14}
    />
    <g >
      <AnimatedGridRows
        key={`gridrows-${animationTrajectory}`}
        scale={scale as GridScale}
        stroke={gridColor}
        width={axisWidth}
        top={eprops.top}
        left={eprops.left}
        animationTrajectory={animationTrajectory}
      />
      <AnimatedAxis
        key={`axis-${animationTrajectory}`}
        orientation={Orientation.right}
        top={eprops.top}
        scale={scale as GridScale}
        stroke={colors.chartBackground}
        left={marginLeft + axisWidth}
        tickStroke={colors.chartBackground}
        tickFormat={(label: number, index) => {
          label = Math.abs(label)
          if (label >= 1000000)
            return (
              Math.round(
                label / 1000000
              ) + 'M'
            )
          if (label >= 1000)
            return (
              Math.round(label) /
              1000 +
              'k'
            )
          return Math.round(label).toString()
        }}
        tickLabelProps={{
          ...tickLabelProps,
          fill: colors.primaryContrast,
          className: 'unselectable',
        }}
        labelProps={{
          x: eprops.left + axisWidth + 2 * 18,
          y1: eprops.top,
          y2: eprops.bottom - axisWidth,
          fontSize: 18,
          strokeWidth: 0,
          stroke: '#fff',
          paintOrder: 'fill',
          fontFamily: 'sans-serif',
          textAnchor: 'middle',
          className: 'unselectable',
        }}
        animationTrajectory={animationTrajectory}
      />
    </g>
  </>
}

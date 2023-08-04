import { Orientation, Axis } from '@visx/axis'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridRows } from '@visx/react-spring/lib'
import { useState } from 'react'
import { AnimationTrajectory, Gradient, IVisAxisProps, extend, gridColor, tickLabelProps } from '.'
import { useColors } from '../../../..'
import { motion, useTransform } from 'framer-motion'
import { NumberValue } from 'd3'
import { logToOverlay } from '../../../../../ethtps.data/src'
import { raise } from "@visx/drag"
import { GridRows, GridColumns } from '@visx/grid'

export function VisVAxis(props: IVisAxisProps) {
  const {
    scale,
    width = 0,
    height = 0,
    marginTop = 0,
    marginBottom = 0,
    marginLeft = 0,
    marginRight = 0,
    axisWidth = 50,
    scaleFactor = 2,
    ty
  } = props
  const colors = useColors()
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>(undefined)

  const axis = (!!scale) ? {
    scale,
    label: 'y',
  } : undefined
  if (!axis) return <></>
  const eprops = extend(props)
  const extent = (scale?.domain()[1] ?? 0) - (scale?.domain()[0] ?? 0)
  /* if (scale) {
     //adjust
     const domainExtent = Math.abs(scale.domain()[1] - scale.domain()[0])
     scale.domain([scale.domain()[0] - scaleFactor * domainExtent / 2, scale.domain()[1] + scaleFactor * domainExtent / 2])
     const rangeExtent= Math.abs(scale.range()[1] - scale.range()[0])
     scale.range([scale.range()[0] - scaleFactor * rangeExtent / 2, scale.range()[1] + scaleFactor * extent / 2])
   }*/
  const aw = (axisWidth === 0) ? 50 : axisWidth
  return <>
    <Gradient />
    <rect
      x={eprops.left}
      y={eprops.top}
      width={aw}
      height={extent - aw}
      fill={colors.chartBackground}
      rx={14}
    />
    <motion.g style={{
      translateY: props.ty
    }}>
      <GridRows /* Long grid lines */
        key={`ygridrows-${animationTrajectory}`}
        scale={scale as GridScale}
        stroke={colors.grid}
        width={props.width ?? eprops.left}
        numTicks={12}
        top={eprops.top}
        left={marginLeft + 0.75 * aw}
      />
      <AnimatedAxis
        key={`yaxis-${animationTrajectory}`}
        animationTrajectory={animationTrajectory}
        orientation={Orientation.right}
        top={eprops.top}
        scale={scale as GridScale}
        stroke={colors.chartBackground}
        left={marginLeft}
        tickStroke={colors.text}
        tickLength={5}
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
          if (extent < 10) {
            return label.toFixed(2)
          }
          return Math.round(label).toString()
        }}
        tickLabelProps={{
          ...tickLabelProps,
          fill: colors.primaryContrast,
          className: 'unselectable',
          x: aw / 3,
          y: 3.5,
        }}
      />
    </motion.g>
  </>
}

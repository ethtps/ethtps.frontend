import { Orientation, Axis } from '@visx/axis'
import { GridScale } from "@visx/grid/lib/types"
import { AnimatedAxis, AnimatedGridColumns } from '@visx/react-spring/lib'
import { useCallback, useState } from 'react'
import { AnimationTrajectory, Gradient, IVisAxisProps, extend, gridColor, labelColor, tickLabelProps } from '.'
import { useColors } from '../../../..'
import moment from 'moment-timezone'
import { format } from 'path'
import { motion, useTransform } from 'framer-motion'
import { logToOverlay } from '../../../../../ethtps.data/src'
import { GridRows, GridColumns } from '@visx/grid'

export function VisHAxis(props: IVisAxisProps) {
  const colors = useColors()
  const prefersReducedMotionQuery =
    typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
  const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('outside')
  const axis = (!!props.scale) ? {
    scale: props.scale,
    label: 'timescale',
  } : undefined
  if (!axis) return <></>
  const axisWidth = (!props.axisWidth || props.axisWidth === 0) ? 50 : props.axisWidth
  const eprops = extend(props)
  const extent = (props.scale?.domain()[1] ?? 0) - (props.scale?.domain()[0] ?? 0)
  const dxv = (props.tx?.get() ?? 0) / Math.abs((props.scale?.range()[1] ?? 0) - (props.scale?.range()[0] ?? 0)) * extent
  const tickFormat = useCallback((label: number, index: number) => {
    const diff = (moment().utc(true).diff(moment(label).utc(true), undefined, true))
    return "-" + formatDuration(diff + dxv)
  }, [props.scale?.domain()[0], props.scale?.domain()[1], dxv])
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
    <motion.g style={{
      translateX: props.tx
    }}>
      <GridColumns /* Long grid lines */
        key={`xgridcolumns-${animationTrajectory}`}
        scale={props.scale as GridScale}
        stroke={colors.grid}
        height={eprops.bottom - 0.75 * axisWidth}
        numTicks={12}
      />
      <Axis
        key={`xaxis-${animationTrajectory}`}
        // animationTrajectory={animationTrajectory}
        orientation={Orientation.top}
        top={eprops.top}
        scale={props.scale as GridScale}
        stroke={colors.gray}
        tickStroke={colors.text}
        tickLength={5}
        tickFormat={tickFormat}
        tickLabelProps={{
          ...tickLabelProps,
          fill: colors.primaryContrast,
          className: 'unselectable',
          y: eprops.bottom - eprops.top - axisWidth / 4,
        }}
      />
    </motion.g>
  </>
}
function formatDuration(duration: number) {
  let remaining = Math.abs(duration)

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  remaining %= 1000 * 60 * 60 * 24

  const hours = Math.floor(remaining / (1000 * 60 * 60))
  remaining %= 1000 * 60 * 60

  const minutes = Math.floor(remaining / (1000 * 60))
  remaining %= 1000 * 60

  const seconds = Math.floor(remaining / 1000)

  let result = ''
  if (days) result += `${days}d `
  if (hours) result += `${hours}h `
  if (minutes) result += `${minutes}m `
  if (seconds) result += `${seconds}s `

  return result.trim()
}
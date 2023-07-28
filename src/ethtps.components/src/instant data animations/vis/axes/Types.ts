import { AxisScale, SharedAxisProps } from '@visx/axis'
import { GridColumnsProps } from '@visx/grid/lib/grids/GridColumns'
import { GridRowsProps } from '@visx/grid/lib/grids/GridRows'
import { getSeededRandom } from '@visx/mock-data'
import { coerceNumber } from '@visx/scale'
import React from 'react'
import { Bounded, ExtraBounded, IComponentSize } from '../../../..'

export const backgroundColor = '#da7cff'
export const axisColor = '#fff'
export const tickLabelColor = '#fff'
export const labelColor = '#340098'
export const gridColor = '#6e0fca'
export const seededRandom = getSeededRandom(0.5)

export const tickLabelProps = {
  fill: tickLabelColor,
  fontSize: 12,
  fontFamily: 'sans-serif',
  textAnchor: 'middle',
} as const

export const getMinMax = (vals: (number | { valueOf(): number })[]) => {
  const numericVals = vals.map(coerceNumber)
  return [Math.min(...numericVals), Math.max(...numericVals)]
}

export type AnimationTrajectory = 'outside' | 'center' | 'min' | 'max' | undefined

export type AxisComponentType = React.FC<
  SharedAxisProps<AxisScale> & {
    animationTrajectory: AnimationTrajectory
  }
>

export type GridRowsComponentType = React.FC<
  GridRowsProps<AxisScale> & {
    animationTrajectory: AnimationTrajectory
  }
>

export type GridColumnsComponentType = React.FC<
  GridColumnsProps<AxisScale> & {
    animationTrajectory: AnimationTrajectory
  }
>


export interface IVisAxisProps extends Partial<Bounded>, Partial<IComponentSize> {
  scale?: AxisScale<number>
  width?: number
  height?: number
  axisWidth?: number
}

export const extend = (props: IVisAxisProps): ExtraBounded => {
  const l = (props.marginLeft ?? 0) + (props.paddingLeft ?? 0)
  const t = props.marginTop ?? 0 + (props.paddingTop ?? 0)
  return {
    ...props,
    left: l,
    right: l + (props.width ?? 0),
    top: t,
    bottom: t + (props.height ?? 0),
    horizontalSize: props.width ?? 0 - (props.marginLeft ?? 0) - (props.marginRight ?? 0) - (props.paddingLeft ?? 0) - (props.paddingRight ?? 0),
    verticalSize: props.height ?? 0 - (props.marginTop ?? 0) - (props.marginBottom ?? 0) - (props.paddingTop ?? 0) - (props.paddingBottom ?? 0)
  }
}
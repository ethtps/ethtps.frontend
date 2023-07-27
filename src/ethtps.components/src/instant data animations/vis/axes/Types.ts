import { AxisScale, SharedAxisProps } from '@visx/axis'
import { GridColumnsProps } from '@visx/grid/lib/grids/GridColumns'
import { GridRowsProps } from '@visx/grid/lib/grids/GridRows'
import { getSeededRandom } from '@visx/mock-data'
import { coerceNumber } from '@visx/scale'
import React from 'react'
import { IComponentSize, WithMargins } from '../../../..'

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


export interface IVisVAxisProps extends Partial<WithMargins>, Partial<IComponentSize> {
  scale?: AxisScale<number>
  width?: number
  height?: number
  axisWidth?: number
}
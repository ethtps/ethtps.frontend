import { DataType } from '@/api-client'

export type StreamGraphProps = {
  width: number
  height: number
  animate?: boolean
}

export type MouseOverEvents = {
  onMouseOver?: () => void,
  onMouseLeave?: () => void,
  onClick?: () => void
}

export type MouseOverDataTypesEvents = {
  onMouseOver?: (dataType: DataType) => void,
  onMouseLeave?: (dataType: DataType) => void,
  onClick?: (dataType: DataType) => void
}

export type DataPoint = {
  tps: number
  gps: number
  gtps: number
}

export const range = (n: number) => Array.from(new Array(n), (_, i) => i)

import { ETHTPSDataCoreDataType } from 'ethtps.api'

export type StreamGraphProps = {
	width: number
	height: number
	animate?: boolean
}

export type MouseOverEvents = {
	onMouseOver?: () => void
	onMouseLeave?: () => void
	onClick?: () => void
}

export type MouseOverDataTypesEvents = {
	onMouseOver?: (dataType: ETHTPSDataCoreDataType) => void
	onMouseLeave?: (dataType: ETHTPSDataCoreDataType) => void
	onClick?: (dataType: ETHTPSDataCoreDataType) => void
}

export type DataPoint = {
	tps: number
	gps: number
	gtps: number
}

export const range = (n: number) => Array.from(new Array(n), (_, i) => i)

export type LiveDataPoint = { x: number; y: { tps: number | undefined; gps: number | undefined; gtps: number }; z: string }
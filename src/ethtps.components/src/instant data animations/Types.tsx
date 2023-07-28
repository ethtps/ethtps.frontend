import { UseDisclosureProps } from '@chakra-ui/react'
import { IconArrowsDiagonal, IconArrowsDiagonalMinimize, IconLayoutNavbarCollapse, IconLayoutNavbarExpand } from '@tabler/icons-react'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { DefinedHook, Hook } from '..'
import { ExtendedTimeInterval, GenericDictionary } from '../../../ethtps.data/src'
import { ETHTPSAnimation } from './InstantDataAnimationProps'
import { ExpansionEvent } from './streaming'

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

/**
 * Specifies how the chart control panel should expand
 * None: No expansion
 * Float: Float at the bottom of the window (and is sticky)
 * ExpandVertically: Expand downwards; the chart will be pushed down while the control panel stays in the same (relative) position
 */
export enum ExpandType {
	None = 'none', Float = 'float', ExpandVertically = 'expand'
}

/**
 * Specifies the factor by which a chart should expand when the control panel is expanded.
 */
export const expandRatios: GenericDictionary<number> = {
	[ExpandType.None]: 1,
	[ExpandType.Float]: 3,
	[ExpandType.ExpandVertically]: 1.8
}

export type ExpansionIconPair = {
	expand: JSX.Element
	collapse: JSX.Element
}

/**
 * Which icons to display depending on the expansion type for the chart control panel
 */
export const expandIcons: GenericDictionary<ExpansionIconPair> = {
	[ExpandType.None]: {
		expand: <></>,
		collapse: <></>
	},
	[ExpandType.Float]: {
		expand: <IconArrowsDiagonal />,
		collapse: <IconArrowsDiagonalMinimize />
	},
	[ExpandType.ExpandVertically]: {
		expand: <IconLayoutNavbarExpand />,
		collapse: <IconLayoutNavbarCollapse />
	}
}


/**
 * Configuration for standard chart control panel actions
 */
export interface StandardControlProps {
	expandedChanged?: ExpansionEvent
	showSidechains?: boolean
	//Floaty may or may not floaty anymore, who knows
	floaty: UseDisclosureProps
	showSidechainsToggled?: (() => void) | undefined
	height: number
	intervalHook: DefinedHook<ExtendedTimeInterval>
	pausedHook: DefinedHook<boolean>
	children?: React.ReactNode
	expandType: ExpandType
	isMaximizedHook: Hook<boolean>
}

export interface IChartControlCenterProps extends StandardControlProps, Omit<Partial<ETHTPSAnimation>, keyof StandardControlProps> {

}
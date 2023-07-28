import { Box, Grid } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'
import { useEffect, useRef, useState } from 'react'
import { ETHTPSAnimation, useColors } from '../../..'
import {
	ExtendedTimeInterval,
	TimeIntervalToStreamProps
} from '../../../../ethtps.data/src'
import { ChartControlCenter } from '../ChartControlCenter'
import { SimpleLiveDataPoint, SimpleLiveDataStat } from '../simple stat'
import { MouseOverDataTypesEvents } from '../types'
import { VisStream } from '../vis'
import { ExpansionEvent } from './Hooks'

interface IStreamingComponentProps extends MouseOverDataTypesEvents, Partial<ETHTPSAnimation> {
	connected: boolean
	data: SimpleLiveDataPoint
	providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
	dataMode: ETHTPSDataCoreDataType
	hoveredDataMode?: ETHTPSDataCoreDataType
	showSidechains: boolean
	showSidechainsToggled?: () => void
	isLeaving?: boolean
	controlsFloatOnExpand?: boolean
	expandedChanged?: ExpansionEvent
}

const pad = 100

export function StreamingComponent({
	connected,
	data,
	newestData,
	providerData,
	onClick,
	onMouseLeave,
	onMouseOver,
	dataMode,
	hoveredDataMode,
	showSidechains,
	showSidechainsToggled,
	isLeaving,
	controlsFloatOnExpand = false,
	expandedChanged,
	height = 600
}: IStreamingComponentProps): JSX.Element {
	const colors = useColors()
	const containerRef = useRef<any>(null)
	const controlRef = useRef<any>(null)
	const sizeRef = useSize(containerRef)
	const intervalHook = useState<ExtendedTimeInterval>(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
	const [interval, setInterval] = intervalHook
	const [streamConfig, setStreamConfig] = useState(TimeIntervalToStreamProps(interval))
	useEffect(() => {
		setStreamConfig(TimeIntervalToStreamProps(interval))
	}, [interval])
	const [paused, setPaused] = useState(false)


	const [floaty, setFloaty] = useState()

	return <>
		<Grid w={'inherit'}
			sx={{
				margin: 0,
				padding: 0
			}}
			ref={containerRef}>
			<SimpleLiveDataStat
				absolute
				fillWidth
				connected={connected}
				onClick={onClick}
				onMouseLeave={onMouseLeave}
				onMouseOver={onMouseOver}
				currentDataType={hoveredDataMode ?? dataMode}
				data={data}
				w={sizeRef?.width}
			/>
			<Box
				w={sizeRef?.width}
				h={height}
				borderRadius="lg"
				borderWidth={0}
				overflow="visible">
				<Box
					width={sizeRef?.width}
					height={height}
					borderWidth={0}
					sx={{
						paddingTop: pad,
						overflow: 'visible',
					}}>
					<VisStream
						width={sizeRef?.width ?? 500}
						height={height}
						isLeaving={isLeaving}
						dataType={hoveredDataMode ?? dataMode}
						newestData={newestData}
						connected={connected}
						providerData={providerData}
						maxEntries={streamConfig.limit}
						duration={streamConfig.duration}
						refreshInterval={streamConfig.refreshInterval}
						timeInterval={interval}
						showSidechains={showSidechains}
						paused={paused}
					/>
					<ChartControlCenter
						height={height}
						intervalHook={intervalHook}
						expandedChanged={expandedChanged}
						controlsFloatOnExpand={controlsFloatOnExpand}
						showSidechainsToggled={showSidechainsToggled}
						showSidechains={showSidechains} />
				</Box>
			</Box>
		</Grid>
	</>
}

/*

							<CrosshairDiv
								ssr={false}
								timeScale={{
									interval,
									start: 0,
									end: -streamConfig.duration,
								}}
								verticalPadding={pad}
								width={sizeRef?.width ?? 0}
								height={(sizeRef?.height??0*) ?? 0}>
								<></>
							</CrosshairDiv>
*/

import { Box, Grid, Skeleton, useDisclosure } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ETHTPSAnimation, Hook, useColors, useQueryStringAndLocalStorageBoundState } from '../../..'
import {
	ExtendedTimeInterval,
	IDataModel,
	TimeIntervalToStreamProps
} from '../../../../ethtps.data/src'
import { ChartControlCenter } from '../ChartControlCenter'
import { ExpandType, MouseOverDataTypesEvents, expandRatios } from '../Types'
import { SimpleLiveDataPoint, SimpleLiveDataStat } from '../simple stat'
import { VisStream } from '../vis'
import { ExpansionEvent, useChartControlExpansion } from './Hooks'

interface IStreamingComponentProps extends MouseOverDataTypesEvents, Partial<ETHTPSAnimation> {
	connected: boolean
	data: SimpleLiveDataPoint
	providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
	dataMode: ETHTPSDataCoreDataType
	hoveredDataMode?: ETHTPSDataCoreDataType
	showSidechains: boolean
	showSidechainsToggled?: () => void
	isLeaving?: boolean
	expandedChanged?: ExpansionEvent
	expandType?: ExpandType
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
	expandedChanged,
	initialData,
	expandType = ExpandType.ExpandVertically,
	height = 600
}: IStreamingComponentProps): JSX.Element {
	const colors = useColors()
	const containerRef = useRef<any>(null)
	const sizeRef = useSize(containerRef)
	const intervalHook = useState<ExtendedTimeInterval>(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
	const [interval, setInterval] = intervalHook
	const [streamConfig, setStreamConfig] = useState(TimeIntervalToStreamProps(interval))
	const maxedHook = useQueryStringAndLocalStorageBoundState(false, 'smaxed')
	const [isMaximized] = maxedHook
	useEffect(() => {
		setStreamConfig(TimeIntervalToStreamProps(interval))
	}, [interval])
	const pausedHook = useState<boolean>(() => false)
	const floaty = useDisclosure({
		isOpen: isMaximized
	})
	const expansion = useChartControlExpansion()
	const heightMultiplier = useMemo(() => isMaximized || !!floaty.isOpen ? expandRatios[expandType] : 1, [isMaximized, floaty.isOpen, expandType])
	const finalHeight = useMemo(() => height * heightMultiplier, [height, heightMultiplier])
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
				borderRadius="lg"
				borderWidth={0}
				overflow="visible">
				<Box
					width={sizeRef?.width}
					height={expandType === ExpandType.Float && floaty.isOpen ? '95vh' : finalHeight}
					borderWidth={0}
					sx={{
						paddingTop: pad,
						overflow: 'visible'
					}}>
					<Skeleton isLoaded={connected} fadeDuration={1} height={'inherit'}>
						<VisStream // Height is inherited if not defined
							width={sizeRef?.width ?? 500}
							isLeaving={isLeaving}
							dataType={hoveredDataMode ?? dataMode}
							newestData={newestData}
							connected={connected}
							providerData={providerData}
							maxEntries={streamConfig.limit}
							duration={streamConfig.duration}
							refreshInterval={streamConfig.refreshInterval}
							timeInterval={interval}
							paused={pausedHook[0]}
							marginLeft={20}
							expandType={expandType}
							initialData={initialData}
							showSidechains={showSidechains}
						/>
					</Skeleton>
					<ChartControlCenter
						isMaximizedHook={maxedHook as Hook<boolean>}
						height={finalHeight}
						floaty={floaty}
						width={sizeRef?.width ?? 500}
						pausedHook={pausedHook}
						intervalHook={intervalHook}
						expandType={expandType}
						expandedChanged={(e, s) => {
							expandedChanged?.(expansion.state?.expanded ?? false, expansion.state?.expansionSize ?? { width: 0, height: 0 })
							//setFinalHeight(height + heightMultiplier * (!!!expansion.state?.expanded ? (expansion.state?.expansionSize?.height as number ?? 0) : 0))
						}}
						showSidechainsToggled={showSidechainsToggled}
						showSidechains={showSidechains} />
				</Box>
			</Box>
		</Grid>
	</>
}
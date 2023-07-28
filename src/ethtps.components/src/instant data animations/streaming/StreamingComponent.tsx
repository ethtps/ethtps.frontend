import { Box, Button, Grid, Tooltip } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import {
	IconBadgeHd,
	IconBadgeSd,
	IconLink,
	IconLinkOff,
	IconMaximize,
	IconMinimize,
	IconPlayerPause,
	IconPlayerPlay
} from '@tabler/icons-react'
import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ETHTPSAnimation, TimeIntervalButtonGroup, useColors, useQueryStringAndLocalStorageBoundState } from '../../..'
import {
	ExtendedTimeInterval,
	TimeIntervalToStreamProps
} from '../../../../ethtps.data/src'
import { SimpleLiveDataPoint, SimpleLiveDataStat } from '../simple stat'
import { MouseOverDataTypesEvents } from '../types'
import { VisStream } from '../vis/VisStream'

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
	height = 600
}: IStreamingComponentProps): JSX.Element {
	const colors = useColors()
	const containerRef = useRef<any>(null)
	const controlRef = useRef<any>(null)
	const sizeRef = useSize(containerRef)
	const controlBoxSizeRef = useSize(controlRef)
	const [interval, setInterval] = useState<ExtendedTimeInterval>(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
	const [streamConfig, setStreamConfig] = useState(TimeIntervalToStreamProps(interval))
	useEffect(() => {
		setStreamConfig(TimeIntervalToStreamProps(interval))
	}, [interval])
	const [paused, setPaused] = useState(false)
	const [isMaximized, setIsMaximized] = useQueryStringAndLocalStorageBoundState(false, 'smaxed')
	const [isLowRes, setIsLowRes] = useState(false)
	const [resMultiplier, setResMultiplier] = useState(1)
	useEffect(() => {
		setResMultiplier(isLowRes ? 0.5 : 1)
	}, [isLowRes])
	// Factor by which to multiply divide the height of the chart when it is maximized
	const heightMultiplier = !!isMaximized ? 1.8 : 1
	const floaty = !!controlsFloatOnExpand && !!isMaximized
	const controlBox = useMemo(() => {
		return <Box
			ref={controlRef}
			pos={floaty ? 'fixed' : 'relative'}
			display={floaty ? 'flex' : 'block'}
			bg={colors.chartBackground}
			w={floaty ? '100vw' : sizeRef?.width}
			padding={2 * (heightMultiplier)}
			borderWidth={0}
			bottom={floaty ? 0 : undefined}
			left={floaty ? 0 : undefined}
			borderRadius={'lg'}
			overflowX={'visible'}>
			<TimeIntervalButtonGroup onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
			<Tooltip
				label={`Sidechains ${showSidechains ? 'shown' : 'hidden'
					}. Click to toggle`}>
				<Button
					iconSpacing={0}
					leftIcon={
						showSidechains ? <IconLink /> : <IconLinkOff />
					}
					variant={'ghost'}
					onClick={showSidechainsToggled}
				/>
			</Tooltip>
			<Tooltip label={`Click to ${paused ? 'resume' : 'pause'}`}>
				<Button
					disabled={!connected}
					iconSpacing={0}
					leftIcon={
						paused ? (
							<IconPlayerPlay />
						) : (
							<IconPlayerPause />
						)
					}
					variant={'ghost'}
					onClick={() => setPaused(!paused)}
				/>
			</Tooltip>
			<Tooltip label={`Click to ${isMaximized ? 'minimize' : 'maximize'}`}>
				<Button
					iconSpacing={0}
					leftIcon={
						!isMaximized ? (
							<IconMaximize />
						) : (
							<IconMinimize />
						)
					}
					variant={'ghost'}
					onClick={() => setIsMaximized(!isMaximized)}
				/>
			</Tooltip>
			<Tooltip isDisabled label={`Change to ${isLowRes ? 'high-res' : 'low-res'}`}>
				<Button
					isDisabled
					iconSpacing={0}
					leftIcon={
						!isLowRes ? (
							<IconBadgeHd />
						) : (
							<IconBadgeSd />
						)
					}
					variant={'ghost'}
					onClick={() => setIsLowRes(!isLowRes)}
				/>
			</Tooltip>
		</Box>
	}, [connected, floaty, isLowRes, isMaximized, paused, showSidechains, showSidechainsToggled, sizeRef?.width, heightMultiplier])
	return (
		<Grid
			w={'inherit'}
			sx={{
				margin: 0,
				padding: 0,
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
				minH={floaty ? `${90 * heightMultiplier}wh` : heightMultiplier * 600}
				h={(sizeRef?.height ?? 0 * heightMultiplier) ?? 0 + (controlBoxSizeRef?.height ?? 0)}
				borderRadius="lg"
				borderWidth={0}
				overflow="visible">
				<Box
					width={sizeRef?.width}
					height={(sizeRef?.height ?? 0 * heightMultiplier) ?? 0 + ((floaty ? undefined : controlBoxSizeRef?.height) ?? 0)}
					borderWidth={0}
					sx={{
						paddingTop: pad,
						overflow: 'visible',
					}}>
					<VisStream
						width={sizeRef?.width ?? 500}
						height={((sizeRef?.height ?? 0 * heightMultiplier) ?? heightMultiplier * 500) - heightMultiplier * (controlBoxSizeRef?.height ?? 0)}
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
					{controlBox}
				</Box>
			</Box>
		</Grid>
	)
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

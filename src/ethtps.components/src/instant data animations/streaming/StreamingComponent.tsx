import { Box, Button, Container, Tooltip } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import { Dictionary } from '@reduxjs/toolkit'
import {
	IconBadgeHd,
	IconBadgeSd,
	IconLink,
	IconLinkOff,
	IconMaximize,
	IconMinimize,
	IconPlayerPause,
	IconPlayerPlay,
} from '@tabler/icons-react'
import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CrosshairDiv, TimeIntervalButtonGroup, useColors } from '../../..'
import {
	ExtendedTimeInterval,
	L2DataUpdateModel,
	TimeIntervalToStreamProps
} from '../../../../ethtps.data/src'
import { SimpleLiveDataPoint, SimpleLiveDataStat } from '../simple stat'
import { MouseOverDataTypesEvents } from '../types'
import { CustomStreamchart } from './custom/CustomStreamchart'

interface IStreamingComponentProps extends MouseOverDataTypesEvents {
	connected: boolean
	data: SimpleLiveDataPoint
	newestData?: Dictionary<L2DataUpdateModel>
	providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
	dataMode: ETHTPSDataCoreDataType
	hoveredDataMode?: ETHTPSDataCoreDataType
	showSidechains: boolean
	showSidechainsToggled?: () => void
	isLeaving?: boolean
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
}: IStreamingComponentProps): JSX.Element {
	const colors = useColors()
	const containerRef = useRef<any>(null)
	const sizeRef = useSize(containerRef)
	const [interval, setInterval] = useState<ExtendedTimeInterval>(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
	const [streamConfig, setStreamConfig] = useState(TimeIntervalToStreamProps(interval))
	useEffect(() => {
		setStreamConfig(TimeIntervalToStreamProps(interval))
	}, [interval])
	const [paused, setPaused] = useState(false)
	const [isMaximized, setIsMaximized] = useState(false)
	const [isLowRes, setIsLowRes] = useState(false)
	const [resMultiplier, setResMultiplier] = useState(1)
	useEffect(() => {
		setResMultiplier(isLowRes ? 0.5 : 1)
	}, [isLowRes])
	const liveStat = useMemo(() => {
		return (
			<></>)
	}, [
		connected,
		newestData,
		sizeRef?.width,
		sizeRef?.height,
		providerData,
		colors,
		hoveredDataMode,
		dataMode,
		onClick,
		onMouseLeave,
		onMouseOver,
		data,
		isLeaving,
		showSidechains,
		showSidechainsToggled,
		paused,
		interval
	])
	return (
		<>
			<Box ref={containerRef}>
				<Container
					h={600}
					w={sizeRef?.width}
					sx={{
						margin: 0,
						padding: 0,
					}}>
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
						h={sizeRef?.height ?? 0 + pad * 2}
						bg={colors.tertiary}
						borderRadius="lg"
						overflow="hidden">
						<Box
							width={sizeRef?.width}
							height={sizeRef?.height ?? 0 - pad * 2}
							sx={{
								paddingTop: pad,
								overflow: 'hidden',
							}}>
							<CrosshairDiv
								ssr={false}
								timeScale={{
									interval,
									start: 0,
									end: -streamConfig.duration,
								}}
								verticalPadding={pad}
								width={sizeRef?.width ?? 0}
								height={sizeRef?.height ?? 0}>
								<CustomStreamchart
									width={sizeRef?.width}
									height={sizeRef?.height}
									isLeaving={isLeaving}
									dataType={hoveredDataMode ?? dataMode}
									newestData={newestData}
									connected={connected}
									providerData={providerData}
									maxEntries={streamConfig.limit}
									duration={streamConfig.duration}
									refreshInterval={streamConfig.refreshInterval}
									showSidechains={showSidechains}
									paused={paused}
								/>
							</CrosshairDiv>
						</Box>
					</Box>
					<Box
						w={sizeRef?.width}
						bg={colors.tertiary}
						borderRadius="lg"
						sx={{
							padding: '5px',
						}}>
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
				</Container>
			</Box>
		</>
	)
}

import { Box, Button, Container, Tooltip } from '@chakra-ui/react'
import { useSize } from '@chakra-ui/react-use-size'
import { Dictionary } from '@reduxjs/toolkit'
import {
	IconLink,
	IconLinkOff,
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
	TimeIntervalToStreamProps,
} from '../../../../ethtps.data/src'
import { SimpleLiveDataPoint, SimpleLiveDataStat } from '../simple stat'
import { MouseOverDataTypesEvents } from '../types'
import { StreamingTest } from './StreamingTest'

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
	const [interval, setInterval] = useState<ExtendedTimeInterval>(
		ETHTPSDataCoreTimeInterval.ONE_MINUTE
	)
	const [streamConfig, setStreamConfig] = useState(
		TimeIntervalToStreamProps(interval)
	)
	useEffect(() => {
		setStreamConfig(TimeIntervalToStreamProps(interval))
	}, [interval])
	const [paused, setPaused] = useState(false)
	const liveStat = useMemo(() => {
		return (
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
					overflow="scroll">
					<Box
						width={sizeRef?.width}
						height={sizeRef?.height ?? 0 - pad * 2}
						sx={{
							paddingTop: pad,
						}}>
						<CrosshairDiv
							width={sizeRef?.width ?? 0}
							height={sizeRef?.height ?? 0}>
							<StreamingTest
								isLeaving={isLeaving}
								dataType={hoveredDataMode ?? dataMode}
								newestData={newestData}
								connected={connected}
								providerData={providerData}
								width={sizeRef?.width}
								maxEntries={streamConfig.limit}
								duration={streamConfig.duration}
								refreshInterval={streamConfig.refreshInterval}
								height={sizeRef?.height}
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
						title={`Sidechains ${showSidechains ? 'shown' : 'hidden'
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
					<Tooltip title={`Click to ${paused ? 'play' : 'pause'}`}>
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
				</Box>
			</Container>
		)
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
		streamConfig,
		showSidechains,
		showSidechainsToggled,
		paused,
	])
	return (
		<>
			<Box ref={containerRef}>{liveStat}</Box>
		</>
	)
}

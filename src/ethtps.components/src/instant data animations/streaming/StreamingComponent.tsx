import { Box, Button, Container, Tooltip } from '@chakra-ui/react'
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
import { useEffect, useRef, useState } from 'react'
import { ETHTPSAnimation, TimeIntervalButtonGroup, useColors } from '../../..'
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
	height = 600
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

	return (
		<>
			<Box ref={containerRef}>
				<Container
					h={height}
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

						borderRadius="lg"
						overflow="hidden">
						<Box
							width={sizeRef?.width}
							height={sizeRef?.height ?? 0 - pad * 1}
							sx={{
								paddingTop: pad,
								overflow: 'hidden',
							}}>
							<VisStream
								width={sizeRef?.width ?? 500}
								height={(sizeRef?.height ?? 500) - pad * 1}
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
						</Box>
					</Box>
					<Box
						w={sizeRef?.width}
						bg={colors.chartScaleBackgroundGradient}
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
								height={sizeRef?.height ?? 0}>
								<></>
							</CrosshairDiv>
*/

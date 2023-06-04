import { DataPoint, IntervalSlider, LiveDataWithDeltaReturnType, MouseOverDataTypesEvents, MouseOverEvents, SimpleLiveDataPoint, SimpleLiveDataStat, StreamingTest, TimeIntervalButtonGroup } from "@/components"
import { Container, Box, Switch, FormControl, FormLabel, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Button, Tooltip } from "@chakra-ui/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useSize } from "@chakra-ui/react-use-size"
import { DataType, ProviderResponseModel, TimeInterval } from "@/api-client"
import { useColors } from "@/services"
import { ExtendedTimeInterval, L2DataUpdateModel, TimeIntervalToSeconds, TimeIntervalToStreamProps } from "@/data"
import { Dictionary } from "@reduxjs/toolkit"
import { IconLink, IconLinkOff } from "@tabler/icons-react"

interface IStreamingComponentProps extends MouseOverDataTypesEvents {
    connected: boolean
    data: SimpleLiveDataPoint
    newestData?: Dictionary<L2DataUpdateModel>
    providerData?: ProviderResponseModel[]
    dataMode: DataType
    hoveredDataMode?: DataType
    showSidechains: boolean
    showSidechainsToggled?: () => void
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
    showSidechainsToggled
}: IStreamingComponentProps) {
    const colors = useColors()
    const containerRef = useRef<any>(null)
    const sizeRef = useSize(containerRef)
    const [interval, setInterval] = useState<ExtendedTimeInterval>(TimeInterval.OneMinute)
    const [streamConfig, setStreamConfig] = useState(TimeIntervalToStreamProps(interval))
    useEffect(() => {
        setStreamConfig(TimeIntervalToStreamProps(interval))
    }, [interval])
    const liveStat = useMemo(() => {
        return <Container
            h={650}
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
                w={sizeRef?.width} />
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
                        paddingTop: pad
                    }}>
                    <StreamingTest
                        dataType={hoveredDataMode ?? dataMode}
                        newestData={newestData}
                        connected={connected}
                        providerData={providerData}
                        width={sizeRef?.width}
                        maxEntries={streamConfig.limit}
                        duration={streamConfig.duration}
                        refreshInterval={streamConfig.refreshInterval}
                        height={sizeRef?.height}
                        showSidechains={showSidechains} />
                </Box>
            </Box>
            <Box
                w={sizeRef?.width}
                bg={colors.tertiary}
                borderRadius="lg"
                sx={{
                    padding: '5px'
                }}>
                <TimeIntervalButtonGroup onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
                <Tooltip label={`Sidechains ${showSidechains ? "shown" : "hidden"}. Click to toggle`}>
                    <Button leftIcon={showSidechains ? <IconLink /> : <IconLinkOff />} variant={'ghost'} onClick={showSidechainsToggled} />
                </Tooltip>
            </Box>
        </Container>
    }, [connected, newestData, sizeRef?.width, sizeRef?.height, providerData, colors, hoveredDataMode, dataMode, onClick, onMouseLeave, onMouseOver, data, streamConfig, showSidechains, showSidechainsToggled])
    return (
        <>
            <Box
                ref={containerRef}>
                {liveStat}
            </Box>
        </>
    )
}
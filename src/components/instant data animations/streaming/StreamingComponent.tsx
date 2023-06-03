import { DataPoint, LiveDataWithDeltaReturnType, MouseOverDataTypesEvents, MouseOverEvents, SimpleLiveDataPoint, SimpleLiveDataStat, StreamingTest } from "@/components"
import { Container, Box } from "@chakra-ui/react"
import { useMemo, useRef, useState } from "react"
import { useSize } from "@chakra-ui/react-use-size"
import { DataType, ProviderResponseModel } from "@/api-client"
import { useColors } from "@/services"
import { L2DataUpdateModel } from "@/data"
import { Dictionary } from "@reduxjs/toolkit"

interface IStreamingComponentProps extends MouseOverDataTypesEvents {
    connected: boolean
    data: SimpleLiveDataPoint
    newestData?: Dictionary<L2DataUpdateModel>
    providerData?: ProviderResponseModel[]
    dataMode: DataType
    hoveredDataMode?: DataType
}

export function StreamingComponent({
    connected,
    data,
    newestData,
    providerData,
    onClick,
    onMouseLeave,
    onMouseOver,
    dataMode,
    hoveredDataMode
}: IStreamingComponentProps) {
    const colors = useColors()
    const containerRef = useRef<any>(null)
    const sizeRef = useSize(containerRef)

    const liveStat = useMemo(() => {
        return <Container
            h={500}
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
                h={sizeRef?.height}
                bg={colors.tertiary}
                borderRadius="lg"
                overflow="scroll">
                <StreamingTest
                    dataType={hoveredDataMode ?? dataMode}
                    newestData={newestData}
                    connected={connected}
                    providerData={providerData}
                    width={sizeRef?.width}
                    height={sizeRef?.height} />
            </Box>
        </Container>
    }, [connected, newestData, sizeRef?.width, sizeRef?.height, providerData, colors.tertiary, hoveredDataMode, dataMode, onClick, onMouseLeave, onMouseOver, data])
    return (
        <>
            <Box
                ref={containerRef}>
                {liveStat}
            </Box>
        </>
    )
}
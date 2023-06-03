import { Box, Flex, HStack, SimpleGrid, Spacer, Stack, StatGroup } from "@chakra-ui/react"
import { LiveDataDelta, SimpleLiveDataPoint, SimpleStat } from "."
import { MouseOverEvents } from "@/components"
import { DataType } from "@/api-client"
import { current } from "@reduxjs/toolkit"

interface ISimpleLiveDataStatProps {
    connected: boolean,
    data: SimpleLiveDataPoint,
    absolute?: boolean,
    w?: string | number,
    fillWidth?: boolean,
    currentDataType?: DataType,
    onMouseOver?: (dataType: DataType) => void
    onMouseLeave?: (dataType: DataType) => void
    onClick?: (dataType: DataType) => void
}

export function SimpleLiveDataStat({
    connected,
    data,
    w,
    fillWidth = false,
    absolute = false,
    currentDataType,
    onMouseOver,
    onMouseLeave,
    onClick
}: ISimpleLiveDataStatProps) {
    return (
        <Flex
            alignItems={'flex-start'}
            justifyContent={absolute ? "center" : "center"}
            sx={{
                pos: absolute ? "absolute" : "relative",
                w: w,
                paddingLeft: '2rem',
                paddingRight: '2rem',
                paddingTop: '1rem',
            }}>
            <Box>
                <SimpleStat
                    isSelected={currentDataType === DataType.Gps}
                    onClick={() => onClick?.(DataType.Gps)}
                    onMouseOver={() => onMouseOver?.(DataType.Gps)}
                    onMouseLeave={() => onMouseLeave?.(DataType.Gps)}
                    loading={!connected}
                    data={data.gps}
                    alt={'Gas per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat
                    isSelected={currentDataType === DataType.Tps}
                    onClick={() => onClick?.(DataType.Tps)}
                    onMouseOver={() => onMouseOver?.(DataType.Tps)}
                    onMouseLeave={() => onMouseLeave?.(DataType.Tps)}
                    loading={!connected}
                    data={data.tps}
                    alt={'Transactions per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat
                    isEstimated
                    isSelected={currentDataType === DataType.GasAdjustedTps}
                    onClick={() => onClick?.(DataType.GasAdjustedTps)}
                    onMouseOver={() => onMouseOver?.(DataType.GasAdjustedTps)}
                    onMouseLeave={() => onMouseLeave?.(DataType.GasAdjustedTps)}
                    loading={!connected}
                    data={data.gtps}
                    alt={"Gas-adjusted transactions per second"} />
            </Box>
        </Flex>
    )
}

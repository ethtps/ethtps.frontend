import { Box, Flex, Spacer } from "@chakra-ui/react"
import { ETHTPSDataCoreDataType } from "ethtps.api"
import { SimpleLiveDataPoint, SimpleStat } from "."

interface ISimpleLiveDataStatProps {
    connected: boolean,
    data: SimpleLiveDataPoint,
    absolute?: boolean,
    w?: string | number,
    fillWidth?: boolean,
    currentDataType?: ETHTPSDataCoreDataType,
    onMouseOver?: (dataType: ETHTPSDataCoreDataType) => void
    onMouseLeave?: (dataType: ETHTPSDataCoreDataType) => void
    onClick?: (dataType: ETHTPSDataCoreDataType) => void
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
    onClick,
}: ISimpleLiveDataStatProps): JSX.Element {
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
                    isSelected={currentDataType === ETHTPSDataCoreDataType.GPS}
                    onClick={() => onClick?.(ETHTPSDataCoreDataType.GPS)}
                    onMouseOver={() => onMouseOver?.(ETHTPSDataCoreDataType.GPS)}
                    onMouseLeave={() => onMouseLeave?.(ETHTPSDataCoreDataType.GPS)}
                    loading={!connected}
                    data={data.gps}
                    alt={'Gas per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat
                    isSelected={currentDataType === ETHTPSDataCoreDataType.TPS}
                    onClick={() => onClick?.(ETHTPSDataCoreDataType.TPS)}
                    onMouseOver={() => onMouseOver?.(ETHTPSDataCoreDataType.TPS)}
                    onMouseLeave={() => onMouseLeave?.(ETHTPSDataCoreDataType.TPS)}
                    loading={!connected}
                    data={data.tps}
                    alt={'Transactions per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat
                    isEstimated
                    isSelected={currentDataType === ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS}
                    onClick={() => onClick?.(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS)}
                    onMouseOver={() => onMouseOver?.(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS)}
                    onMouseLeave={() => onMouseLeave?.(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS)}
                    loading={!connected}
                    data={data.gtps}
                    alt={"Gas-adjusted transactions per second"} />
            </Box>
        </Flex>
    )
}

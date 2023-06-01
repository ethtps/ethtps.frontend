import { Box, Flex, HStack, SimpleGrid, Spacer, Stack, StatGroup } from "@chakra-ui/react"
import { LiveDataDelta, SimpleStat } from "."

interface ISimpleLiveDataStatProps {
    connected: boolean,
    data: {
        tps: LiveDataDelta
        gps: LiveDataDelta
        gtps: LiveDataDelta
    },
    absolute?: boolean,
    w?: string | number,
    fillWidth?: boolean
}

export function SimpleLiveDataStat({
    connected,
    data,
    w,
    fillWidth = false,
    absolute = false
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
                <SimpleStat loading={!connected} data={data.tps} alt={'Transactions per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat loading={!connected} data={data.gps} alt={'Gas per second'} />
            </Box>
            <Spacer />
            <Box>
                <SimpleStat isEstimated loading={!connected} data={data.gtps} alt={"Gas-adjusted transactions per second"} />
            </Box>
        </Flex>
    )
}

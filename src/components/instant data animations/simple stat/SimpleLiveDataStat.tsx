import { StatGroup } from "@chakra-ui/react"
import { LiveDataDelta, SimpleStat } from "."

interface ISimpleLiveDataStatProps {
    connected: boolean,
    data: {
        tps: LiveDataDelta
        gps: LiveDataDelta
        gtps: LiveDataDelta
    }
}

export function SimpleLiveDataStat({
    connected,
    data
}: ISimpleLiveDataStatProps) {
    return <>
        <StatGroup>
            <SimpleStat loading={!connected} data={data.tps} />
            <SimpleStat loading={!connected} data={data.gps} />
            <SimpleStat isEstimated loading={!connected} data={data.gtps} />
        </StatGroup>
    </>
}
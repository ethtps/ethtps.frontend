import { StatGroup } from "@chakra-ui/react"
import { useState } from "react"
import { SimpleStat, diff, useLiveDataWithDelta } from "."
import { LiveDataContainer } from ".."
import { useColors } from "@/services"
import { L2DataUpdateModel } from "@/data"

export function SimpleLiveDataStat() {
    const { data, setTPS, setGPS } = useLiveDataWithDelta()
    const [connected, setConnected] = useState(false)
    const colors = useColors()
    const onDataReceived = (liveData: L2DataUpdateModel[]) => {
        // calculate average tps
        let tps = 0
        let gps = 0
        for (const update of liveData) {
            tps += update.data?.tps ?? 0
            gps += update.data?.gps ?? 0
        }
        if (liveData.length > 0) {
            tps /= liveData.length
            gps /= liveData.length

            setTPS(tps)
            setGPS(gps)
        }
    }
    return <>
        <LiveDataContainer
            onConnected={() => setConnected(true)}
            onDisconnected={() => setConnected(false)}
            onError={(error) => console.error(error)}
            onDataReceived={onDataReceived}
            component={
                <StatGroup>
                    <SimpleStat loading={!connected} data={data.tps} />
                    <SimpleStat loading={!connected} data={data.gps} />
                    <SimpleStat isEstimated loading={!connected} data={data.gtps} />
                </StatGroup>
            } />
    </>
}
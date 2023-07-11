import { ETHTPSDataCoreDataType } from "ethtps.api"
import { useEffect, useState } from "react"
import { AreaSerie, InstantDataAnimationProps, useAccumulator } from "../../../../.."

export function CustomSeries(props: Partial<InstantDataAnimationProps>) {
    const [mountTime, setMountTime] = useState<number>(Date.now())
    useEffect(() => {
        setMountTime(Date.now())
    }, [])
    const [liveData, columns, lastValues] = useAccumulator(props.newestData, props.maxEntries ?? 30, props.dataType ?? ETHTPSDataCoreDataType.TPS, props.providerData, props.refreshInterval)
    return <>
        {columns.map((providerName, i) => (<AreaSerie {...props}
            customKey={providerName}
            providerName={providerName}
            lineStrokeWidth={2}
            lineTension={0.2}
            lineColor={props.providerData?.find(p => p.name === providerName)?.color}
            mountTime={mountTime} />))}
    </>
}
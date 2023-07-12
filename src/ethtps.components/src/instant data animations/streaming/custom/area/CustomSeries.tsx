import { ETHTPSDataCoreDataType } from "ethtps.api"
import { useEffect, useState } from "react"
import { AreaSerie, InstantDataAnimationProps, useAccumulator } from "../../../../.."

interface ICustomSeriesProps extends InstantDataAnimationProps {
    stacked?: boolean
}

export function CustomSeries(props: Partial<ICustomSeriesProps>) {
    const [mountTime, setMountTime] = useState<number>(Date.now())
    useEffect(() => {
        setMountTime(Date.now())
    }, [])
    const [liveData, columns, lastValues] = useAccumulator(props.newestData, props.maxEntries ?? 30, props.dataType ?? ETHTPSDataCoreDataType.TPS, props.providerData, props.refreshInterval)
    let stackOffset = 0
    return <>
        {columns.filter(x => x === "Polygon").map((providerName, i) => {
            return <AreaSerie {...props}
                customKey={providerName}
                providerName={providerName}
                lineStrokeWidth={2}
                lineTension={0.2}
                index={i}
                //fill={props.providerData?.find(p => p.name === providerName)?.color ?? 'transparent'}
                lineColor={props.providerData?.find(p => p.name === providerName)?.color}
                mountTime={mountTime}
                liveData={liveData}
                lastValues={lastValues}
                offsetBy={props.stacked ? stackOffset : 0} />
        })}
    </>
}
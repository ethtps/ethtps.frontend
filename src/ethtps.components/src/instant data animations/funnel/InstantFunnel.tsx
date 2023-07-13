import { ETHTPSDataCoreDataType } from "ethtps.api"
import dynamic from "next/dynamic"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useColors } from "../../.."
import { MinimalDataPoint } from "../../../../ethtps.data/src"
import { IInstantDataAnimationProps } from "../InstantDataAnimationProps"

const data = [
    {
        "id": "step_sent",
        "value": 91448,
        "label": "Sent"
    },
    {
        "id": "step_viewed",
        "value": 78271,
        "label": "Viewed"
    },
    {
        "id": "step_clicked",
        "value": 63555,
        "label": "Clicked"
    },
    {
        "id": "step_add_to_card",
        "value": 52450,
        "label": "Add To Card"
    },
    {
        "id": "step_purchased",
        "value": 34841,
        "label": "Purchased"
    }
]

const dataExtractor = (data: MinimalDataPoint, dataType: ETHTPSDataCoreDataType) => {
    return {
        tps: data?.tps,
        gps: data?.gps,
        gtps: data?.gps ?? 0 / 21000,
    }
}

const dataSelector = (data: MinimalDataPoint, dataType: ETHTPSDataCoreDataType) => {
    if (dataType === ETHTPSDataCoreDataType.TPS) return data?.tps
    if (dataType === ETHTPSDataCoreDataType.GPS) return data?.gps
    return data?.gps
}

export function InstantFunnel({
    width,
    height,
    dataType,
    newestData,
    connected,
    providerData,
    maxEntries,
    duration,
    refreshInterval,
    showSidechains,
    paused,
    isLeaving,
}: IInstantDataAnimationProps) {
    const Funn = dynamic(() => import('@nivo/funnel').then((mod) => mod.Funnel), { ssr: false })
    const colors = useColors()
    const [liveData, setLiveData] = useState<any[]>([])
    const [columns, setColumns] = useState<string[]>([])
    const [lastValues, setLastValues] = useState({})
    useEffect(() => {
        if (!newestData) return

        setColumns((c) => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c
            const newColumns = [...c, ...keys.filter((k) => !c.includes(k))]

            setLiveData((l) => {
                let dataPoints = l // Take the last 'maxEntries' data points
                setLastValues((oldValues) => {
                    const newLastValues: any = { ...oldValues } // Make a copy of the last values

                    // Add new data point for each column
                    newColumns.forEach((c) => {
                        const value = dataExtractor(
                            newestData[c]?.data ?? newLastValues[c],
                            dataType
                        ) ?? {
                            tps: 0,
                            gps: 0,
                            gtps: 0,
                        }

                        dataPoints.push({
                            x: Date.now() + refreshInterval,
                            y: value,
                            z: c,
                        })

                        newLastValues[c] = value // Update the last value
                    })

                    return newLastValues
                }) // Store the updated last values
                // We don't really need to remove old data points, since we're using a 'realtime' x-axis
                /*
                if (dataPoints.length > 2 * maxEntries * newColumns.length)
                    dataPoints = dataPoints.slice(-maxEntries * newColumns.length)*/
                return dataPoints // This replaces the old liveData with the new dataPoints, including the newly added points
            })
            return newColumns
        })
    }, [newestData, maxEntries, dataType, providerData, refreshInterval])
    const ref = useRef(null)
    const fun = useCallback(() => {
        if (columns.length === 0) return <></>
        if (liveData.length === 0) return <></>
        console.log(liveData)
        return <Funn
            width={width ?? 0}
            height={height ?? 400}
            data={liveData.filter(x => x.z === "Ethereum").map((c, i) => {
                return {
                    id: c.x,
                    value: dataSelector(c.y, dataType) ?? 0,
                    label: c.z,
                }
            })}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            direction="horizontal"
            valueFormat=">-.4s"
            fillOpacity={0.75}
            borderWidth={19}
            borderColor={{ from: 'color', modifiers: [] }}
            borderOpacity={0.6}
            colors={{ scheme: 'purple_orange' }}
            labelColor={{
                from: 'color',
                modifiers: [
                    [
                        'brighter',
                        3
                    ]
                ]
            }}
            beforeSeparatorLength={100}
            beforeSeparatorOffset={19}
            afterSeparatorLength={100}
            afterSeparatorOffset={20}
            currentPartSizeExtension={10}
            currentBorderWidth={40}
            motionConfig="wobbly"
        />
    }, [
        width,
        height,
        lastValues,
        liveData,
        columns,
        providerData,
        dataType,
        duration,
        refreshInterval,
        showSidechains,
        colors,
        connected,
        paused,
        isLeaving,
    ])
    return <>
        <div className="chart">
            <Suspense fallback={<div>Loading...</div>}>
                {fun()}
            </Suspense>
        </div>
    </>
}
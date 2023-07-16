import dynamic from "next/dynamic"

import { useToast } from "@chakra-ui/react"
import { ETHTPSDataCoreDataType } from "ethtps.api"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { IInstantDataAnimationProps, } from ".."
import { useColors } from "../../.."
import { GenericDictionary, LiveDataPoint, MinimalDataPoint, groupBy } from "../../../../ethtps.data/src"
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
    return data?.gps ?? 0 / 21000
}

export function NivoRealtimeChart({
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
    const ResponsiveLine = dynamic(() => import('@nivo/line').then((mod) => mod.ResponsiveLine), { ssr: false })
    const colors = useColors()
    const [liveData, setLiveData] = useState<LiveDataPoint[]>([])
    const [streamData, setStreamData] = useState<GenericDictionary<MinimalDataPoint>[]>([])
    const [lineData, setLineData] = useState<GenericDictionary<LiveDataPoint[]>>({})
    const [columns, setColumns] = useState<string[]>([])
    const [lastValues, setLastValues] = useState({})
    const toast = useToast()
    useEffect(() => {
        if (!newestData) return

        setColumns((c) => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c
            const newColumns = [...c, ...keys.filter((k) => !c.includes(k))]

            setStreamData(oldStreamData => {
                setLiveData((l) => {
                    let dataPoints = l // Take the last 'maxEntries' data points
                    setLastValues((oldValues) => {
                        const newLastValues: any = { ...oldValues } // Make a copy of the last values

                        // Add new data point for each column
                        const newPointX = Date.now() + refreshInterval
                        let newStreamPoint: GenericDictionary<MinimalDataPoint> = {}
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
                                x: newPointX,
                                y: value,
                                z: c,
                            } as LiveDataPoint)

                            const e = value
                            if (e) newStreamPoint[c] = e

                            newLastValues[c] = value // Update the last value
                        })

                        oldStreamData.push(newStreamPoint)

                        return newLastValues
                    }) // Store the updated last values
                    // We don't really need to remove old data points, since we're using a 'realtime' x-axis
                    /*
                    if (dataPoints.length > 2 * maxEntries * newColumns.length)
                        dataPoints = dataPoints.slice(-maxEntries * newColumns.length)*/
                    setLineData(groupBy(liveData, b => b.z!)!)
                    return dataPoints
                })
                return oldStreamData
            })
            return newColumns
        })
    }, [newestData, maxEntries, dataType, providerData, refreshInterval])
    const ref = useRef(null)
    const fun = useCallback(() => {
        if (columns.length === 0) return <></>
        if (liveData.length === 0) return <></>
        return <ResponsiveLine data={Object.keys(lineData).map(g => ({
            id: g,
            data: lineData[g].map(q => ({
                x: q.x,
                y: dataSelector(q.y, dataType) ?? 0
            }))
        }))}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: 36
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
                legendOffset: -40
            }}
            enableGridX={true}
            curve="cardinal"
            colors={{ scheme: 'purple_orange' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#2c998f',
                    size: 4,
                    padding: 2,
                    stagger: true
                },
                {
                    id: 'squares',
                    type: 'patternSquares',
                    background: 'inherit',
                    color: '#e4c912',
                    size: 6,
                    padding: 2,
                    stagger: true
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'Ethereum'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'Celo'
                    },
                    id: 'squares'
                }
            ]}
            motionConfig="stiff"
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    translateX: 100,
                    itemWidth: 80,
                    itemHeight: 20,
                    itemTextColor: colors.text,
                    symbolSize: 12,
                    symbolShape: 'diamond',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: colors.text,
                                itemBackground: colors.background
                            }
                        }
                    ]
                }
            ]}
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
        streamData
    ])
    return <>
        <div style={{
            width: '100%',
            height: '100%',
        }} className="chartContainer">
            <Suspense fallback={<div>Loading...</div>}>
                {fun()}
            </Suspense>
        </div>
    </>
}
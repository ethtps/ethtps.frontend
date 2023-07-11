import { Dictionary } from '@reduxjs/toolkit'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useEffect, useState } from 'react'
import { LiveDataPoint, minimalDataPointToLiveDataPoint } from '../../../..'
import { GenericDictionary, L2DataUpdateModel } from '../../../../../ethtps.data/src'

/**
 * Returns a hook representing the speed in px/s for a vertical scrolling animation
 * @param duration
 * @param height
 * @returns
 */
export function useVerticalScrolling(duration: number, height?: number) {
    const [speed, setSpeed] = useState(0)
    useEffect(() => {
        setSpeed((height ?? 0) / (duration / 1000))
    }, [height, duration])
    return speed
}

export function useAccumulator(newestData: Dictionary<L2DataUpdateModel> | undefined, maxEntries: number, dataType: ETHTPSDataCoreDataType, providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[] | undefined, refreshInterval?: number) {
    const [liveData, setLiveData] = useState<LiveDataPoint[]>([])
    const [columns, setColumns] = useState<string[]>([])
    const [lastValues, setLastValues] = useState<GenericDictionary<LiveDataPoint>>({})
    useEffect(() => {
        if (!newestData) return

        setColumns((c) => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c
            const newColumns = [...c, ...keys.filter((k) => !c.includes(k))]

            setLiveData((l) => {
                let dataPoints = l // Take the last 'maxEntries' data points
                setLastValues((oldValues) => {
                    const newLastValues = { ...oldValues } // Make a copy of the last values

                    // Add new data point for each column
                    newColumns.forEach((c) => {
                        const value =
                            minimalDataPointToLiveDataPoint(newestData[c]?.data, c) ?? newLastValues[c]
                            ?? {
                                tps: 0,
                                gps: 0,
                                gtps: 0,
                            }

                        dataPoints.push(value)

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
    return [liveData, columns, lastValues] as const
}
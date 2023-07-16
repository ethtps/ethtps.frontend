import { Dictionary } from '@reduxjs/toolkit'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useEffect, useState } from 'react'
import { minimalDataPointToLiveDataPoint } from '../../../..'
import { L2DataUpdateModel, LiveDataPoint } from '../../../../../ethtps.data/src'

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

export function useAccumulator(newestData: Dictionary<L2DataUpdateModel> | undefined, maxEntries: number, dataType: ETHTPSDataCoreDataType | undefined, providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[] | undefined, refreshInterval?: number) {
    const [liveData, setLiveData] = useState<LiveDataPoint[]>(JSON.parse(localStorage.getItem('liveData') ?? '[]'))
    const [columns, setColumns] = useState<string[]>(JSON.parse(localStorage.getItem('liveDataColumns') ?? '[]'))
    useEffect(() => {
        if (!newestData) return

        setColumns((c) => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c
            const newColumns = [...c, ...keys.filter((k) => !c.includes(k))]
            localStorage.setItem('liveDataColumns', JSON.stringify(newColumns))
            return newColumns
        })
        setLiveData((ld) => {
            const d: LiveDataPoint[] = Object.keys(newestData).filter(x => !!newestData[x]).map((k) => minimalDataPointToLiveDataPoint(newestData[k]?.data, k))
            const result = [...ld, ...d]
            localStorage.setItem('liveData', JSON.stringify(result))
            return result
        })
    }, [newestData, dataType, providerData, refreshInterval])
    return [liveData, columns] as const
}
import * as d3 from 'd3'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { useEffect, useState } from 'react'
import { liveDataPointExtractor, minimalDataPointToLiveDataPoint } from '..'
import { ExtendedTimeInterval, FrequencyLimiter, GenericDictionary, L2DataUpdateModel, TimeIntervalToStreamProps, extractData } from '../../../../ethtps.data/src'
import { NumericInterval } from './Types'

/**
 * Returns the bounds of the x-axis in unix milliseconds
 * @param timeInterval
 */
export function useXAxisBounds(timeInterval?: ETHTPSDataCoreTimeInterval | ExtendedTimeInterval) {
    const i = (timeInterval ?? ETHTPSDataCoreTimeInterval.ONE_MINUTE) as ExtendedTimeInterval
    const [xBounds, setXBounds] = useState<NumericInterval>([-TimeIntervalToStreamProps(i).duration / 1000, 0])
    return xBounds
}

function getRange(newestData: GenericDictionary<L2DataUpdateModel>, dataType: ETHTPSDataCoreDataType): NumericInterval {
    const values = Object.keys(newestData).map(k => extractData(newestData[k].data, dataType))
    return [Math.min(...values), Math.max(...values)] as NumericInterval
}

export function useYAxisBounds(newestData: GenericDictionary<L2DataUpdateModel>,
    dataType: ETHTPSDataCoreDataType) {
    const action = 'y bounds'
    const t = dataType ?? ETHTPSDataCoreDataType.TPS
    const [yBounds, setYBounds] = useState(getRange(newestData, t))
    useEffect(() => {
        if (!FrequencyLimiter.canExecute(action)) return
        const values = Object.keys(newestData).map(k => liveDataPointExtractor(minimalDataPointToLiveDataPoint(newestData[k].data, k), t) ?? 0)
        const min = Math.min(...values)
        if (min < yBounds[0]) setYBounds([min, yBounds[1]])
        const max = Math.max(...values)
        if (max > yBounds[1]) setYBounds([yBounds[0], max])
    }, [newestData, dataType])
    return yBounds
}

export function useD3Scale(bounds: NumericInterval, range: NumericInterval) {
    const [axis, setAxis] = useState<d3.ScaleLinear<number, number, never>>(() => d3.scaleLinear().domain(bounds)
        .range(range))
    return axis
}
import * as d3 from 'd3'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { useCallback, useEffect, useState } from 'react'
import { liveDataPointExtractor, minimalDataPointToLiveDataPoint, useDebugMeasuredEffect } from '..'
import { Padded, WithMargins } from '../../..'
import { ExtendedTimeInterval, FrequencyLimiter, GenericDictionary, L2DataUpdateModel, TimeIntervalToStreamProps, extractData } from '../../../../ethtps.data/src'
import { NumericInterval } from './Types'

/**
 * Returns the bounds of the x-axis in unix milliseconds
 * @param timeInterval
 */
export function useXAxisBounds(timeInterval?: ETHTPSDataCoreTimeInterval | ExtendedTimeInterval) {
    const i = (timeInterval ?? ETHTPSDataCoreTimeInterval.ONE_MINUTE) as ExtendedTimeInterval
    const [xBounds, setXBounds] = useState<NumericInterval>()
    useEffect(() => {
        setXBounds([-TimeIntervalToStreamProps(i).duration / 1000, 0])
    }, [timeInterval])
    return xBounds
}

function getRange(newestData: GenericDictionary<L2DataUpdateModel> | undefined, dataType: ETHTPSDataCoreDataType): NumericInterval {
    if (!newestData) return [0, 1]
    const values = Object.keys(newestData).map(k => extractData(newestData[k].data, dataType))
    return [Math.min(...values), Math.max(...values)] as NumericInterval
}

export function useYAxisBounds(newestData: GenericDictionary<L2DataUpdateModel> | undefined,
    dataType: ETHTPSDataCoreDataType) {
    const action = 'y bounds'
    const t = dataType ?? ETHTPSDataCoreDataType.TPS
    const [yBounds, setYBounds] = useState(getRange(newestData, t))
    useEffect(() => {
        if (!newestData) return
        if (!FrequencyLimiter.canExecute(action)) return
        const values = Object.keys(newestData).map(k => liveDataPointExtractor(minimalDataPointToLiveDataPoint(newestData[k].data, k), t) ?? 0)
        const min = Math.min(...values)
        if (min < yBounds[0]) setYBounds([min, yBounds[1]])
        const max = Math.max(...values)
        if (max > yBounds[1]) setYBounds([yBounds[0], max])
    }, [newestData, dataType])
    return yBounds
}



export function useD3Scale(bounds: NumericInterval | undefined, range: NumericInterval) {
    const getter = useCallback(() => d3.scaleLinear().domain(bounds ?? [0, 1])
        .range(range), [bounds, range])
    const [axis, setAxis] = useState<d3.ScaleLinear<number, number, never>>(getter)
    useEffect(() => {
        setAxis(getter())
    }, [getter])
    return axis
}

export function useD3Axis(axis: d3.ScaleLinear<number, number, never>, orientation: (scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>, svgRef: React.RefObject<any>, padding?: Partial<Padded>, margins?: Partial<WithMargins>, name?: string) {
    useDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis`)) return
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.call(orientation(axis))
    }, `${name} axis`, [axis, orientation, svgRef, padding, margins])
}
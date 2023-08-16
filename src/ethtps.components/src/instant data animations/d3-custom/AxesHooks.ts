import * as d3 from 'd3'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { useEffect, useState } from 'react'
import { liveDataPointExtractor, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '..'
import { Padded, WithMargins } from '../../..'
import { ExtendedTimeInterval, FrequencyLimiter, GenericDictionary, L2DataUpdateModel, LiveDataPoint, TimeIntervalToStreamProps, extractData } from '../../../../ethtps.data/src'
import { NumericInterval, TimeInterval } from './Types'

/**
 * Returns the bounds of the x-axis in unix milliseconds
 * @param timeInterval
 */
export function getXAxisBounds(timeInterval?: ETHTPSDataCoreTimeInterval | ExtendedTimeInterval): NumericInterval {
    const i = (timeInterval ?? ETHTPSDataCoreTimeInterval.ONE_MINUTE) as ExtendedTimeInterval
    return [Date.now() - TimeIntervalToStreamProps(i).duration, Date.now()]
}

/**
 * Gets the bounds of the x-axis for a given set of data.
 * @param data The data to get the bounds of
 * @param leftTimePadding  The amount of padding to add to the left of the x-axis, as a fraction of the total time range
 * @param rightTimePadding  The amount of padding to add to the right of the x-axis, as a fraction of the total time range
 * @returns A time range in unix milliseconds
 */
export function getDataXAxisBounds(data: GenericDictionary<LiveDataPoint>[], leftTimePadding = 0.1, rightTimePadding = 0.1): NumericInterval {
    const now = Date.now()
    const oldest = Math.min(...data.flatMap(d => Object.keys(d ?? {}).map(y => d[y].x ?? now)))
    const dt = now - oldest
    return [oldest - dt * leftTimePadding, now + dt * rightTimePadding]
}

export function getDataXAxisBoundsFromArray(data: LiveDataPoint[], leftTimePadding = 0.1, rightTimePadding = 0.1): NumericInterval {
    if (data.length === 0) return [Date.now(), Date.now()]
    return [data[0].x ?? Date.now(), data[data.length - 1].x ?? Date.now()]
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
    }, [newestData, dataType, t, yBounds])
    useEffect(() => {
        setYBounds(getRange(newestData, t))
    }, [dataType, t, newestData])
    return yBounds
}

export function getD3Scale(bounds: NumericInterval, range: NumericInterval): d3.ScaleLinear<number, number, never> {
    return d3.scaleLinear().domain(bounds).nice().range(range)
}

export function getD3TimeScale(bounds: TimeInterval, range: NumericInterval): d3.ScaleTime<number, number, never> {
    return d3.scaleTime().domain(bounds).nice().range(range)
}

/**
 *  Adds a d3 axis to a given svg node.
 * @param axis
 * @param orientation
 * @param svgRef
 * @param padding
 * @param margins
 * @param name
 */
export function useD3Axis(axis: d3.ScaleLinear<number, number, never>, orientation: ((scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>),
    svgRef: React.RefObject<any>,
    padding?: Partial<Padded>,
    margins?: Partial<WithMargins>,
    name?: string) {
    useGroupedDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis delta`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.call(orientation(axis)
            .ticks(12))
    }, `Δ`, `${name} axis`, [axis, orientation, svgRef, padding, margins, name])
    useGroupedDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis change`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.transition(`d3-${name}-change`)
            .duration(1000)
            .selection()
            .call(orientation(axis))
    }, `Δv`, `${name} axis`)
}
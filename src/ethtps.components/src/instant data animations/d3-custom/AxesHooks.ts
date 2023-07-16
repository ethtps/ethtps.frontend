import * as d3 from 'd3'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { liveDataPointExtractor, measure, minimalDataPointToLiveDataPoint, useDebugMeasuredEffect, useGroupedDebugMeasuredEffect } from '..'
import { Padded, WithMargins } from '../../..'
import { ExtendedTimeInterval, FrequencyLimiter, GenericDictionary, L2DataUpdateModel, TimeIntervalToStreamProps, extractData, logToOverlay } from '../../../../ethtps.data/src'
import { NumericInterval } from './Types'
import { useState, useEffect } from 'react'

/**
 * Returns the bounds of the x-axis in unix milliseconds
 * @param timeInterval
 */
export function getXAxisBounds(timeInterval?: ETHTPSDataCoreTimeInterval | ExtendedTimeInterval): NumericInterval {
    const i = (timeInterval ?? ETHTPSDataCoreTimeInterval.ONE_MINUTE) as ExtendedTimeInterval
    return [-TimeIntervalToStreamProps(i).duration / 1000, 0]
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
    useEffect(() => {
        setYBounds(getRange(newestData, t))
    }, [dataType])
    return yBounds
}

export function getD3Scale(bounds: NumericInterval, range: NumericInterval): d3.ScaleLinear<number, number, never> {
    return d3.scaleLinear().domain(bounds).nice().range(range)
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
export function addD3Axis(axis: d3.ScaleLinear<number, number, never>, orientation: ((scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>),
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
        s.call(orientation(axis))
    }, `Δ`, `${name} axis`, [axis, orientation, svgRef, padding, margins, name])
    useGroupedDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis change`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.transition(`d3-${name}-change`)
            .duration(750)
            .selection()
            .call(orientation(axis))
            .on('start', () => {
                logToOverlay({
                    name: `d3-${axis}-change`,
                    details: 'running',
                    level: 'info'
                })
            }
            )
            .on('end', () => {
                logToOverlay({
                    name: `d3-${name}-change`,
                    details: 'ended',
                    level: 'info'
                })
            })
    }, `Δv`, `${name} axis`)
}
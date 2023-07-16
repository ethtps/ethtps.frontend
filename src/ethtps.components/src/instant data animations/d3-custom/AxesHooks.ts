import * as d3 from 'd3'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { measure } from '..'
import { Padded, WithMargins } from '../../..'
import { ExtendedTimeInterval, FrequencyLimiter, GenericDictionary, L2DataUpdateModel, TimeIntervalToStreamProps, extractData, logToOverlay } from '../../../../ethtps.data/src'
import { NumericInterval } from './Types'

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

export function getYAxisBounds(newestData: GenericDictionary<L2DataUpdateModel> | undefined,
    dataType: ETHTPSDataCoreDataType) {
    return getRange(newestData, dataType)
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
    measure(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis delta`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.append('g').call(orientation(axis))
    }, `Δ`, `${name} axis`)
    measure(() => {
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
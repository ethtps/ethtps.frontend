/// <reference path="./Types.ts" />
import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { Vector2D, dataExtractor, liveDataPointExtractor } from '../../../..'
import { GenericDictionary, LiveDataAccumulator, LiveDataPoint, XYZDataPoint } from '../../../../../ethtps.data/src'
import { LiveDataPointKey, StackKey } from '../../../../../ethtps.data/src/models/StackKey'
import { LinScale, PointPair, PointPairInterpolator } from './Types'

/**
 * Helper class for transforming data into d3-friendly formats
 */
export namespace D3Helpers.DataTransformation {
    export const getLastPointPairInterpolator = (xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType, arr?: LiveDataPoint[]) => {
        if (!arr || arr.length < 2) return null
        return getPointPairInterpolator(xScale, yScale, dataType, arr[arr.length - 2], arr[arr.length - 1])
    }

    export const getPointPairInterpolator = (xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType, initial?: LiveDataPoint, final?: LiveDataPoint): PointPairInterpolator | null => {
        const p2 = initial //p[n-2]
        const p1 = final//p[n-1]
        if (!p1 || !p2 || !dataExtractor(p1?.y, dataType) || !dataExtractor(p2?.y, dataType)) return null

        const p2Top = getCoordinates(p2, xScale, yScale, dataType)
        const p1Top = getCoordinates(p1, xScale, yScale, dataType)
        const p2Bottom = getInverseCoordinates(p2, xScale, yScale, dataType)
        const p1Bottom = getInverseCoordinates(p1, xScale, yScale, dataType)
        const d3interpolator = d3.interpolateNumber
        const interpolator = {
            top: {
                x: d3interpolator(p2Top.x, p1Top.x),
                y: d3interpolator(p2Top.y, p1Top.y),
                points: {
                    initial: p2Top,
                    final: p1Top
                }
            },
            bottom: {
                x: d3interpolator(p2Bottom.x, p1Bottom.x),
                y: d3interpolator(p2Bottom.y, p1Bottom.y),
                points: {
                    initial: p2Bottom,
                    final: p1Bottom
                }
            }
        }
        return interpolator
    }

    export const getInverseCoordinates = (d: LiveDataPoint, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => ({ x: xScale(d.x!), y: yScale(-liveDataPointExtractor(d, dataType)!) }) as Vector2D // y scale is not somethingmorphic - y(-x) != -y(x) because we're drawing the chart relative to the vertical midpoint

    export const getCoordinates = (d: LiveDataPoint, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => ({ x: xScale(d.x!), y: yScale(liveDataPointExtractor(d, dataType)!) }) as Vector2D

    export const dx = (pair?: Partial<PointPair>) => {
        if (!pair?.initial?.x || !pair?.final?.x) return NaN
        return (pair.final.x - pair.initial.x)
    }

    export const dy = (pair?: Partial<PointPair>) => {
        if (!pair?.initial?.y || !pair?.final?.y) return NaN
        return (pair.final.y - pair.initial.y)
    }

    export function stackAndGroup(collection: LiveDataPoint[],
        valueExtractor: (d: LiveDataPoint) => number,
        offset: ((series: d3.Series<any, any>, order: Iterable<number>) => void) = d3.stackOffsetExpand) {
        const mapped = collection.map(x => {
            return {
                x: x.x ?? 0,
                z: x.z ?? 'unknown',
                y: valueExtractor(x)
            } as XYZDataPoint
        })
        const groups = d3.groups(mapped, x => x.z!)
        const stacks = d3.stack<XYZDataPoint, string>()
            .keys(groups.map(x => x[0]))
            .order(d3.stackOrderInsideOut)
            .value((d, k, i, arr) => d.y)
            .offset(offset)
            (mapped)
        return stacks
    }
    export const stack = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType) => {
        return generateStack<LiveDataPoint, LiveDataPointKey>(
            accumulator.all,
            d => (d.key ?? {
                provider: d.z ?? 'unknown',
                x: d.x ?? 0
            } as LiveDataPointKey),
            (d) => liveDataPointExtractor(d, dataType) ?? 0)
    }

    function generateStack<T extends StackKey<TK>, TK extends LiveDataPointKey>(collection: GenericDictionary<T>[],
        keyExtractor: (d: T) => TK,
        valueExtractor: (d: T) => number,
        offset: ((series: d3.Series<any, any>, order: Iterable<number>) => void) = d3.stackOffsetExpand): d3.Series<GenericDictionary<T>, TK>[] {
        if (!collection || collection.length === 0 || collection.some(x => !!!x)) return []
        const index = d3.index(
            collection.flatMap(x =>
                Object.keys(x).map(k => keyExtractor(x[k]))),
            d => d, d => d.provider, d => d.x)
        const stack = d3.stack<GenericDictionary<T>, TK>()
            .offset(offset)
            .keys(index.keys())
            .value((d, k, i, arr) => valueExtractor(d[k.provider]))(collection)

        return stack
    }
    /*
        export function toPointPair(d:d3.SeriesPoint<GenericDictionary<LiveDataPoint>>, scale:LinXYScale){
            return {
                initial: {
                    x: d.data[0].x,
                    y: d[0]
                },
                final: {
                    x: d.data[d.index].x,
                    y: d[1]
                }
            } as PointPair
        }*/
}

export default D3Helpers.DataTransformation
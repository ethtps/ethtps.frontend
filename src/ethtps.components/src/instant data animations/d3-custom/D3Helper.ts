import * as d3 from 'd3'
import { Area } from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { SelectedSVG, Vector2D, dataExtractor, liveDataPointExtractor } from '../../..'
import { GenericDictionary, LiveDataAccumulator, LiveDataPoint } from '../../../../ethtps.data/src'
import { LiveDataPointKey, StackKey } from '../../../../ethtps.data/src/models/StackKey'


export type AreaPointPair = {
    initial: Vector2D,
    final: Vector2D
}

export type LinScale = d3.ScaleLinear<number, number>

export type PointPair = {
    initial: Vector2D
    final: Vector2D
}

export type PointPairInterpolator = {
    top: {
        x: (t: number) => number
        y: (t: number) => number
        points?: Partial<PointPair>
    }
    bottom: {
        x: (t: number) => number
        y: (t: number) => number
        points?: Partial<PointPair>
    }
}

export class D3Helper {

    public static getLastPointPairInterpolator = (xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType, arr?: LiveDataPoint[]) => {
        if (!arr || arr.length < 2) return null
        return D3Helper.getPointPairInterpolator(xScale, yScale, dataType, arr[arr.length - 2], arr[arr.length - 1])
    }

    public static getPointPairInterpolator = (xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType, initial?: LiveDataPoint, final?: LiveDataPoint): PointPairInterpolator | null => {
        const p2 = initial //p[n-2]
        const p1 = final//p[n-1]
        if (!p1 || !p2 || !dataExtractor(p1?.y, dataType) || !dataExtractor(p2?.y, dataType)) return null

        const p2Top = D3Helper.getCoordinates(p2, xScale, yScale, dataType)
        const p1Top = D3Helper.getCoordinates(p1, xScale, yScale, dataType)
        const p2Bottom = D3Helper.getInverseCoordinates(p2, xScale, yScale, dataType)
        const p1Bottom = D3Helper.getInverseCoordinates(p1, xScale, yScale, dataType)
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

    public static lastPointPairAnimation = (interpolator: PointPairInterpolator, easingFn: ((normalizedTime: number) => number) = d3.easeQuad, fill: string = 'blue', opacityAnimation: boolean = true): ((selection: SelectedSVG) => void) => (selection: SelectedSVG) => {
        let dx = D3Helper.dx(interpolator.top.points)
        dx = !Number.isNaN(dx) && dx > 0 ? dx : 1000
        let animated = selection.append('path')
            .transition()
            .attr('fill', fill)
            .duration(dx)
            .ease(easingFn)
        if (opacityAnimation) animated = animated.attrTween('fill-opacity', () => (t) => d3.interpolateNumber(0.3, 0.5)(t).toString())
        animated.attrTween('d', () => (t) => D3Helper.getAreaGenerator(d3.curveCatmullRom)([
            {
                initial: interpolator.top.points?.initial,
                final: {
                    x: interpolator.top.x(t),
                    y: interpolator.top.y(t)
                } as Vector2D,
            } as AreaPointPair,
            {
                initial: interpolator.bottom.points?.initial,
                final: {
                    x: interpolator.bottom.x(t),
                    y: interpolator.bottom.y(t)
                } as Vector2D,
            } as AreaPointPair
        ]) ?? '')
    }

    /**
     * Creates a d3 area generator for the given point pair.
     * @returns
     */
    public static getAreaGenerator = (curve: d3.CurveFactory): Area<AreaPointPair> => d3.area<AreaPointPair>()
        .x0((d, i) => d.initial.x)
        .y0((d, i) => d.initial.y)
        .x1((d, i) => d.final.x)
        .y1((d, i) => d.final.y)
        .curve(curve)

    public static getPointAreaGenerator = (curve: d3.CurveFactory, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => d3.area<LiveDataPoint>()
        .x((d: LiveDataPoint) => xScale(d?.x!))
        .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
        .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
        .curve(curve)

    public static lineGenerator = (curve: (d3.CurveFactory | d3.CurveFactoryLineOnly)) => d3.line<Vector2D>()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .curve(curve)

    private static getInverseCoordinates = (d: LiveDataPoint, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => ({ x: xScale(d.x!), y: yScale(-liveDataPointExtractor(d, dataType)!) }) as Vector2D // y scale is not somethingmorphic - y(-x) != -y(x) because we're drawing the chart relative to the vertical midpoint

    private static getCoordinates = (d: LiveDataPoint, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => ({ x: xScale(d.x!), y: yScale(liveDataPointExtractor(d, dataType)!) }) as Vector2D

    public static dx = (pair?: Partial<PointPair>) => {
        if (!pair?.initial?.x || !pair?.final?.x) return NaN
        return (pair.final.x - pair.initial.x)
    }

    public static dy = (pair?: Partial<PointPair>) => {
        if (!pair?.initial?.y || !pair?.final?.y) return NaN
        return (pair.final.y - pair.initial.y)
    }

    public static barsFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, xScale: LinScale, yScale: LinScale, barWidth: number, colorScheme: readonly string[] = d3.schemeCategory10, opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const stack = D3Helper.stack(accumulator, dataType)
        selection
            .append('g')
            .selectAll('g')
            .data(stack)
            .join("g")
            .attr("fill", d => d3.schemeCategory10[d.index % 10])
            .selectAll("rect")
            .data(D => D)
            .join("rect")
            .attr("x", (d, k, i) => xScale(d.data[Object.keys(d.data)[k]]?.x ?? 0))
            .attr("y0", d => yScale(Math.min(d[0], d[1]) ?? 0))
            .attr("y1", d => yScale(Math.max(d[0], d[1]) ?? 0))
            .attr("width", barWidth)
            .attr("height", d => Math.abs(yScale(d[0]) - yScale(d[1])))
    }

    public static stack<T>(accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType) {
        return this.generateStack(accumulator.all, (d) => liveDataPointExtractor(d, dataType) ?? 0)
    }

    private static generateStack<T extends StackKey<TK>, TK extends LiveDataPointKey>(collection: GenericDictionary<T>[], valueExtractor: (d: T) => number) {
        const index = d3.index(collection.flatMap(x => Object.keys(x).map(k => (x[k].key))), d => d)
        const stack = d3.stack<GenericDictionary<T>, TK>().keys(index.keys())
            .value((d, k, i, arr) => valueExtractor(d[k.provider]))(collection)
        return stack
    }
}

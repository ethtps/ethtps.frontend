import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { AreaPointPair, LinScale, LinXYScale, PointPairInterpolator } from '.'
import { SelectedSVG, Vector2D, liveDataPointExtractor } from '../../../..'
import { GenericDictionary, LiveDataAccumulator, LiveDataPoint, flatten } from '../../../../../ethtps.data/src'
import DataTransformHelper from './D3Data'


/**
 * Helper class for visualizing data using d3.
 */
export namespace D3Helpers.Visualization {
    export const lastPointPairAnimation = (interpolator: PointPairInterpolator, easingFn: ((normalizedTime: number) => number) = d3.easeQuad, fill: string = 'blue', opacityAnimation: boolean = true): ((selection: SelectedSVG) => void) => (selection: SelectedSVG) => {
        let dx = DataTransformHelper.dx(interpolator.top.points)
        dx = !Number.isNaN(dx) && dx > 0 ? dx : 1000
        let animated = selection.append('path')
            .transition()
            .attr('fill', fill)
            .duration(dx)
            .ease(easingFn)
        if (opacityAnimation) animated = animated.attrTween('fill-opacity', () => (t) => d3.interpolateNumber(0.3, 0.5)(t).toString())
        animated.attrTween('d', () => (t) => getAreaGenerator(d3.curveCatmullRom)([
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
    export const getAreaGenerator = (curve: d3.CurveFactory): d3.Area<AreaPointPair> => d3.area<AreaPointPair>()
        .x0((d, i) => d.initial.x)
        .y0((d, i) => d.initial.y)
        .x1((d, i) => d.final.x)
        .y1((d, i) => d.final.y)
        .curve(curve)

    export const getPointDictionaryAreaGenerator = (curve: d3.CurveFactory, scale: LinXYScale, dataType: ETHTPSDataCoreDataType) => d3.area<GenericDictionary<LiveDataPoint>>()


    export const getPointAreaGenerator = (curve: d3.CurveFactory, scale: LinXYScale, dataType: ETHTPSDataCoreDataType) => d3.area<LiveDataPoint>()
        .x((d: LiveDataPoint) => scale.x(new Date(d?.x!)))
        .y0((d: LiveDataPoint) => scale.y(-liveDataPointExtractor(d, dataType)!))
        .y1((d: LiveDataPoint) => scale.y(liveDataPointExtractor(d, dataType)!))
        .curve(curve)





    export const applyDefaultStyles = (colorScheme: readonly string[], opacity: number) => (selection: SelectedSVG) => selection.attr("fill", (d, i) => colorScheme[i % colorScheme.length])
        .attr("stroke", (d, i) => colorScheme[i % colorScheme.length])
        .attr('fill-opacity', opacity)
        .attr('stroke-opacity', opacity)
        .attr('stroke-width', 2)

    export const areaFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, scale: LinXYScale, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const stack = DataTransformHelper.stack(accumulator, dataType)
        console.log(stack)
        selection.append("g")
            .selectAll("g")
            .data(stack)
            .join("g")
            .attr("fill", d => colorScheme[d.index % colorScheme.length])

            .selectAll("rect")
            .data(D => D)
            .join("rect")
            .attr("x", d => scale.x(d.data[0]?.x ?? 0))
            .attr("y", d => scale.y(liveDataPointExtractor(d.data[1]?.y ?? 0, dataType) ?? 0))
            .attr("height", d => scale.y(Math.abs(liveDataPointExtractor(d.data[0]?.y ?? 0, dataType) ?? 0 - (liveDataPointExtractor(d.data[1]?.y ?? 0, dataType) ?? 0))))
            .attr("width", 20)

    }

    export const barsFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, xScale: LinScale, yScale: LinScale, barWidth: number, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const stack = DataTransformHelper.stack(accumulator, dataType)
        selection
            .append('g')
            .selectAll('g')
            .data(stack)
            .join("g")
            .attr("fill", d => colorScheme[d.index % colorScheme.length])
            .selectAll("rect")
            .data(D => D)
            .join("rect")
            .attr("x", (d, k, i) => xScale(d.data[Object.keys(d.data)[k]]?.x ?? 0))
            .attr("y0", d => yScale(Math.min(d[0], d[1]) ?? 0))
            .attr("y1", d => yScale(Math.max(d[0], d[1]) ?? 0))
            .attr("width", barWidth)
            .attr("height", d => Math.abs(yScale(d[0]) - yScale(d[1])))
    }

    export const streamAreaFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, scale: LinXYScale, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const data = accumulator.allFlat
        const X = d3.map(data, x => x.x!)
        const Y = d3.map(data, y => liveDataPointExtractor(y, dataType) ?? 0)
        const Z = d3.map(data, x => 1)

        const xDomain = scale.x.domain()
        const yDomain = scale.y.domain()
        const zDomain = new d3.InternSet(accumulator.distinctProviders)
        const I = d3.range(X.length)
        const roll: any = d3.rollup(
            I,
            ([i]) => i,
            (i) => X[i],
            (i) => Z[i]
        )
        const series = d3
            .stack()
            .keys(zDomain)
            .value((d, k, i) => Y[I[i]])
            .order(d3.stackOrderInsideOut)
            .offset(d3.stackOffsetWiggle)(roll)
            .map((s) => s.map((d) => Object.assign(d, { i: d.data[1] })))

        const area = d3
            .area()
            .x(([i]) => scale.x(X[i]))
            .y0(([y1]) => scale.y(y1))
            .y1(([y1, y2]) => scale.y(-y1))
            .curve(d3.curveCatmullRom)

        selection.append('g')
            .selectAll('path')
            .data(series)
            .join('path')
            .attr('fill', ([{ i }]) => colorScheme[i % colorScheme.length])
            .attr('fill-opacity', opacity)
            .attr('d', d => area(d as any))
            .append('title')
            .text(([{ i }]) => Z[i])

    }

}

export default D3Helpers.Visualization
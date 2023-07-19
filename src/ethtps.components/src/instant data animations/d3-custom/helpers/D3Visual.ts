import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { AreaPointPair, LinScale, LinXYScale, PointPairInterpolator } from '.'
import { SelectedSVG, Vector2D, liveDataPointExtractor } from '../../../..'
import { LiveDataAccumulator, LiveDataPoint, flatten } from '../../../../../ethtps.data/src'
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

    export const getPointAreaGenerator = (curve: d3.CurveFactory, xScale: LinScale, yScale: LinScale, dataType: ETHTPSDataCoreDataType) => d3.area<LiveDataPoint>()
        .x((d: LiveDataPoint) => xScale(d?.x!))
        .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
        .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
        .curve(curve)

    export const lineGenerator = (curve: (d3.CurveFactory | d3.CurveFactoryLineOnly)) => d3.line<Vector2D>()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .curve(curve)

    export const streamLines = (curve: (d3.CurveFactory | d3.CurveFactoryLineOnly), scale: LinXYScale, dataType: ETHTPSDataCoreDataType) => d3.line<LiveDataPoint>()
        .x(d => scale.x(d.x ?? 0))
        .y(d => scale.y(liveDataPointExtractor(d, dataType) ?? 0))
        .curve(curve)

    export const linesFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, scale: LinXYScale, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const stack = DataTransformHelper.stack(accumulator, dataType)
        selection.append('path')
            .selectAll('path')
            .datum(stack)
            .attr('d', (d, i) => streamLines(d3.curveCatmullRom, scale, dataType)(accumulator.getDataPointsFor((d[i]?.key).provider) ?? []))
            .attr('stroke', (d, i) => colorScheme[i % colorScheme.length])
            .attr('stroke-opacity', opacity)
            .attr('stroke-width', 2)
    }

    export const areaFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, scale: LinXYScale, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const stack = DataTransformHelper.stack(accumulator, dataType)
        console.log(stack)
        selection.append('g')
            .selectAll("path")
            .data(stack)
            .join("path")
            .attr("fill", (d, i) => colorScheme[i % colorScheme.length])
            .attr("stroke", (d, i) => colorScheme[i % colorScheme.length])
            .attr('fill-opacity', opacity)
            .attr('stroke-opacity', opacity)
            .attr('stroke-width', 2)
            .attr('d', (q, qi) => getPointAreaGenerator(d3.curveCatmullRom, scale.x, scale.y, dataType)(flatten(q.at(qi)?.data ?? {})))

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
}

export default D3Helpers.Visualization